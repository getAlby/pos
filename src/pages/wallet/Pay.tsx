import { Invoice } from "@getalby/lightning-tools";
import { webln } from "@getalby/sdk";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";

export function Pay() {
  const { invoice } = useParams();
  const navigate = useNavigate();
  const provider = useOutletContext() as webln.NostrWebLNProvider;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
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
      <div className="flex grow gap-5 flex-col justify-center items-center">
        <span className="text-4xl font-bold">{amount} sats</span>
        <QRCodeSVG value={invoice} size={256} />
        <p className="flex flex-row justify-center items-center gap-2 mb-4">
          <span className="loading loading-spinner text-primary"></span>
          Waiting for payment...
        </p>
      </div>
      <p>
        <Link to="" onClick={() => navigate(-1)}>
          <a className="link link-secondary">Back</a>
        </Link>
      </p>
    </>
  );
}
