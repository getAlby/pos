import { webln } from "@getalby/sdk";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { localStorageKeys } from "../constants";

export function Wallet() {
  const { nwcUrl } = useParams();

  const [provider, setProvider] = React.useState<
    webln.NostrWebLNProvider | undefined
  >();
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      if (nwcUrl) {
        try {
          console.log("Enabling provider");
          const _provider = new webln.NostrWebLNProvider({
            nostrWalletConnectUrl: nwcUrl,
          });

          await _provider.enable();
          setProvider(_provider);

          // store the wallet URL so PWA can restore it (PWA always loads on the homepage)
          window.localStorage.setItem(localStorageKeys.nwcUrl, nwcUrl);
        } catch (error) {
          console.error(error);
          alert("Failed to load wallet: " + error);
        }
      }
    })();
  }, [nwcUrl]);

  if (!nwcUrl) {
    navigate("/");
    return null;
  }
  if (!provider) {
    // TODO: loading
    return null;
  }

  return (
    <div className="flex flex-col w-full h-full p-2">
      <Outlet context={provider} />
    </div>
  );
}
