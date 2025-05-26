import { Invoice } from "@getalby/lightning-tools";
import QRCode from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Backbar } from "../../components/Backbar";
import useStore from "../../state/store";

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
    if (!provider) {
      return;
    }
    if (invoice) {
      const inv = new Invoice({ pr: invoice });
      const { satoshi, description } = inv;
      setAmount(satoshi);
      if (description) {
        setDescription(description);
      }

      const interval = setInterval(async () => {
        console.log("Checking invoice", invoice);
        const response = await provider.lookupInvoice({
          paymentRequest: invoice,
        });
        if (response.paid) {
          navigate("../paid");
        }
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
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
