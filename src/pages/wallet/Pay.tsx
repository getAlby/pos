import { Invoice } from "@getalby/lightning-tools";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Backbar } from "../../components/Backbar";
import { useProfileMetadata } from "../../hooks/useProfileMetadata";
import { useProfilePubkey } from "../../hooks/useProfilePubkey";
import useStore from "../../state/store";

export function Pay() {
  const { clearCart } = useStore();
  const { invoice } = useParams();
  const navigate = useNavigate();
  const { cart, provider } = useStore();
  const [amount, setAmount] = useState(0);
  const profileData = useProfilePubkey(provider?.publicKey);
  const { metadata } = useProfileMetadata(profileData.profilePubkey);

  useEffect(() => {
    if (!provider) {
      return;
    }
    if (invoice) {
      const inv = new Invoice({ pr: invoice });
      const { satoshi } = inv;
      setAmount(satoshi);

      const interval = setInterval(async () => {
        console.log("Checking invoice", invoice);
        const response = await provider.lookupInvoice({
          paymentRequest: invoice,
        });
        if (response.paid) {
          useStore.getState().clearCart();
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
      <div className="flex grow gap-5 flex-col justify-center items-center">
        <span className="text-4xl font-bold">{amount} sats</span>
        {metadata?.name && (
          <span className="text-lg font-medium">to {metadata?.name}</span>
        )}
        {cart && (
          // TODO: group cart items
          <p>{cart.map((item) => item.name).join(", ")}</p>
        )}
        <div className="relative flex justify-center items-center">
          <QRCodeSVG value={invoice} size={256} />
          {metadata?.picture && (
            <img
              src={metadata.picture}
              className="absolute w-[25%] h-[25%] rounded-full z-10 border-white border-4"
            />
          )}
        </div>
        <p className="flex flex-row justify-center items-center gap-2 mb-4">
          <span className="loading loading-spinner text-primary"></span>
          Waiting for payment...
        </p>
        <button
          onClick={() => {
            clearCart();
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
