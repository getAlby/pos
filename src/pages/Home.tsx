import {
  Button,
  closeModal,
  disconnect,
  init,
  WebLNProviders,
} from "@getalby/bitcoin-connect-react";
import albyImage from "../assets/alby.png";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  React.useEffect(() => {
    // TODO: allow specifying the NWC methods in advance
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
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col justify-center items-center max-w-lg w-full">
        <h1 className="text-2xl mb-4 font-bold">Alby PoS</h1>
        <div className="flex justify-center items-center gap-4 mb-8">
          <img src={albyImage} className="w-16 h-16 rounded" />
        </div>
        <p className="text-center mb-4">
          Connect your wallet and only choose permissions to get info, receive
          and lookup invoices to ensure you can only receive payments.
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
      </div>
    </>
  );
}
