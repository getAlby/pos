import { webln } from "@getalby/sdk";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { localStorageKeys } from "../constants";
import useStore from "../state/store";

export function Wallet() {

  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const nwcUrl = window.localStorage.getItem(localStorageKeys.nwcUrl);
      if (nwcUrl) {
        console.log("Enabling provider");
        try {
          const _provider = new webln.NostrWebLNProvider({
            nostrWalletConnectUrl: nwcUrl,
          });
          await _provider.enable();
          useStore.getState().setProvider(_provider);
        } catch (error) {
          console.error(error);
          alert("Failed to load wallet: " + error);
          navigate("/");
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
