import { webln } from "@getalby/sdk";
import React from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { localStorageKeys } from "../constants";
import useStore from "../state/store";

export function Wallet() {
  const { nwcUrl } = useParams();

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
          useStore.getState().setProvider(_provider);

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

  return (
    <div className="flex flex-col w-full h-full p-2">
      <Outlet />
    </div>
  );
}
