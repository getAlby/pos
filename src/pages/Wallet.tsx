import { webln } from "@getalby/sdk";
import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { localStorageKeys } from "../constants";
import useStore from "../state/store";

export function Wallet() {

  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    (async () => {
      // Load label from query parameter and save it to local storage
      const queryParams = new URLSearchParams(location.search);
      const nwcEncoded = queryParams.get("nwc");
      if (nwcEncoded) {
        try {
          const nwcUrl = atob(nwcEncoded);
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
      } else {
        navigate("/");
      }
    })();
  }, []);


  return (
    <div className="flex flex-col w-full h-full p-2">
      <Outlet />
    </div>
  );
}
