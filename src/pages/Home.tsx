import {
  Button,
  closeModal,
  disconnect,
  init,
  WebLNProviders,
} from "@getalby/bitcoin-connect-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BuzzPay } from "../components/icons/BuzzPay";
import { localStorageKeys } from "../constants";
import { Footer } from "../components/Footer";

export function Home() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const nwcUrl = window.localStorage.getItem(localStorageKeys.nwcUrl);
    if (nwcUrl) {
      console.log("Restoring wallet URL", nwcUrl);
      navigate(`/wallet/${encodeURIComponent(nwcUrl)}/new`);
    }

    init({
      filters: ["nwc"],
      showBalance: false,
      providerConfig: {
        nwc: {
          authorizationUrlOptions: {
            requestMethods: ["get_info", "make_invoice", "lookup_invoice"],
          },
        },
      },
    });
    disconnect();
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-full bg-primary">
        <div className="flex flex-1 flex-col justify-center items-center max-w-lg">
          <BuzzPay className="mb-8" />

          <p className="text-center mb-24">
            Point-of-Sale for bitcoin lightning payments
          </p>
          <Button
            onConnected={async (provider) => {
              try {
                const info = await provider.getInfo();
                if (
                  info.methods.length > 3 ||
                  info.methods.indexOf("makeInvoice") < 0 ||
                  info.methods.indexOf("lookupInvoice") < 0 ||
                  info.methods.indexOf("getInfo") < 0
                ) {
                  throw new Error(
                    "This provider must support exactly NWC getInfo, makeInvoice and lookupInvoice. Supports: " +
                      info.methods.join(",")
                  );
                }
                if (!(provider instanceof WebLNProviders.NostrWebLNProvider)) {
                  throw new Error(
                    "WebLN provider is not an instance of NostrWebLNProvider"
                  );
                }
                // TODO: below line should not be needed when modal is updated to close automatically after connecting
                closeModal();
                navigate(
                  `/wallet/${encodeURIComponent(
                    provider.nostrWalletConnectUrl
                  )}/new`
                );
              } catch (error) {
                console.error(error);
                alert(error);
              }
            }}
          />
          <button
            className="btn btn-outline mt-8 btn-sm btn-secondary"
            onClick={importWallet}
          >
            Import wallet URL
          </button>
        </div>
        <Footer />
      </div>
    </>
  );
}

// Needed on iOS because PWA localStorage is not shared with Safari.
// PWA can only be installed with a static URL (e.g. "/pos/").
function importWallet() {
  const url = prompt("Copy wallet URL from your browser");
  if (url) {
    window.location.href = url;
  }
}
