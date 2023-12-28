import { webln } from "@getalby/sdk";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

export function Pay() {
  const { invoice } = useParams();
  const navigate = useNavigate();
  const provider = useOutletContext() as webln.NostrWebLNProvider;

  React.useEffect(() => {
    if (invoice) {
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
    navigate(-1);
    return null;
  }

  return (
    <>
      <p className="mb-4">Waiting for payment...</p>
      <QRCodeSVG value={invoice} size={256} />
    </>
  );
}
