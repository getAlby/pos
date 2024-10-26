import {
  Button,
  closeModal,
  disconnect,
  init,
  WebLNProviders,
} from "@getalby/bitcoin-connect-react";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BuzzPay } from "../components/icons/BuzzPay";
import { localStorageKeys } from "../constants";
import { Footer } from "../components/Footer";

export function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  React.useEffect(() => {
    // Load label from query parameter and save it to local storage
    const nwcEncoded = params.get("nwc");
    if (nwcEncoded) {
      try {
        const nwcUrl = atob(nwcEncoded);
        // store the wallet URL so PWA can restore it (PWA always loads on the homepage)
        window.localStorage.setItem(localStorageKeys.nwcUrl, nwcUrl);
        navigate(`/wallet/new`);
      } catch (error) {
        console.error(error);
        alert("Failed to load wallet: " + error);
      }
    }
    const nwcUrl = window.localStorage.getItem(localStorageKeys.nwcUrl);
    if (nwcUrl) {
      navigate(`/wallet/new`);
    }
  }, [navigate, params]);

  React.useEffect(() => {
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

          <p className="text-center mb-24">Point-of-Sale for bitcoin lightning payments</p>
          <Button
            onConnected={async (provider) => {
              try {
                const info = await provider.getInfo();
                if (info.methods.includes("sendPayment")) {
                  throw new Error("Only read-only connections can be used.");
                }
                if (
                  !info.methods.includes("makeInvoice") ||
                  !info.methods.includes("lookupInvoice")
                ) {
                  throw new Error(
                    "Missing permissions. Make sure your select make_invoice and lookup_invoice."
                  );
                }
                if (!(provider instanceof WebLNProviders.NostrWebLNProvider)) {
                  throw new Error("WebLN provider is not an instance of NostrWebLNProvider");
                }
                // TODO: below line should not be needed when modal is updated to close automatically after connecting
                closeModal();
                window.localStorage.setItem(
                  localStorageKeys.nwcUrl,
                  provider.client.nostrWalletConnectUrl
                );
                navigate(`/wallet/new`);
              } catch (error) {
                console.error(error);
                alert(error);
                disconnect();
              }
            }}
          />
          <button className="btn btn-outline mt-8 btn-sm btn-secondary" onClick={importWallet}>
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
