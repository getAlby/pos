import { Invoice } from "@getalby/lightning-tools";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Backbar } from "../../components/Backbar";
import useStore from "../../state/store";

const POLL_INTERVAL_MS = 3000;
const NOTIFICATIONS_FALLBACK_POLL_INTERVAL_MS = 30000;

export function Pay() {
  const { invoice } = useParams();
  const navigate = useNavigate();
  const { provider } = useStore();
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [hasCopied, setCopied] = useState(false);

  function copyQr() {
    try {
      if (!invoice) {
        return;
      }
      window.navigator.clipboard.writeText(invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!provider || !invoice) {
      return;
    }
    const inv = new Invoice({ pr: invoice });
    const { satoshi, description } = inv;
    setAmount(satoshi);
    if (description) {
      setDescription(description);
    }

    let cancelled = false;
    let paid = false;
    let unsubscribe: (() => void) | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    const onPaid = () => {
      if (cancelled || paid) {
        return;
      }
      paid = true;
      navigate("../paid");
    };

    const checkInvoice = async () => {
      try {
        console.log("Checking invoice", invoice);
        const response = await provider.lookupInvoice({
          paymentRequest: invoice,
        });
        if (response.paid) {
          onPaid();
        }
      } catch (error) {
        console.error("Failed to look up invoice", error);
      }
    };

    const startPolling = (intervalMs: number) => {
      interval = setInterval(checkInvoice, intervalMs);
    };

    (async () => {
      try {
        // Prefer NIP-47 notifications when the wallet supports them
        const info = await provider.client.getInfo();
        if (cancelled) {
          return;
        }
        if (info.notifications?.includes("payment_received")) {
          const unsub = await provider.client.subscribeNotifications(
            (notification) => {
              if (
                notification.notification_type === "payment_received" &&
                (notification.notification.payment_hash === inv.paymentHash ||
                  notification.notification.invoice === invoice)
              ) {
                onPaid();
              }
            },
            ["payment_received"]
          );
          if (cancelled) {
            unsub();
            return;
          }
          unsubscribe = unsub;
          // the invoice may have been paid before the subscription was active
          checkInvoice();
          // slow safety net in case the relay subscription silently drops
          startPolling(NOTIFICATIONS_FALLBACK_POLL_INTERVAL_MS);
          return;
        }
      } catch (error) {
        console.error("Failed to subscribe to notifications, falling back to polling", error);
      }
      if (!cancelled) {
        startPolling(POLL_INTERVAL_MS);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [invoice, navigate, provider]);

  if (!invoice) {
    return null;
  }

  return (
    <>
      <Backbar />
      <div className="flex grow flex-col items-center justify-center gap-5">
        <span className="text-4xl font-bold">{new Intl.NumberFormat().format(amount)} sats</span>
        <span className="font-semibold">{description}</span>
        <div className="relative flex items-center justify-center p-4 bg-white" onClick={copyQr}>
          <QRCode value={invoice} size={256} />
        </div>
        <p className="mb-4 flex flex-row items-center justify-center gap-2">
          {!hasCopied && <span className="loading loading-spinner text-primary"></span>}
          {hasCopied ? "✅ Invoice Copied!" : "Waiting for payment..."}
        </p>
        <button
          onClick={() => {
            navigate("../new");
          }}
          className="btn"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
