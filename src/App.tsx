import { HashRouter as Router, Route, Routes, useParams, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Wallet } from "./pages/Wallet";
import { NotFound } from "./pages/NotFound";
import { New } from "./pages/wallet/New";
import { Pay } from "./pages/wallet/Pay";
import { Paid } from "./pages/wallet/Paid";
import { Share } from "./pages/wallet/Share";
import { About } from "./pages/About";
import React from "react";
import { localStorageKeys } from "./constants";

function App() {
  return (
    <div
      data-theme="bumblebee"
      className="flex h-full w-full flex-col items-center justify-center font-sans"
    >
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/wallet" Component={Wallet}>
            <Route path="new" Component={New} />
            <Route path="pay/:invoice" Component={Pay} />
            <Route path="paid" Component={Paid} />
            <Route path="share" Component={Share} />
            <Route path=":legacyWallet/new" Component={LegacyWalletRedirect} />
          </Route>
          <Route path="/about" Component={About} />
          <Route path="/*" Component={NotFound} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

// TODO: remove after 2025-01-01
function LegacyWalletRedirect() {
  const { legacyWallet } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!legacyWallet) {
      return;
    }

    window.localStorage.setItem(localStorageKeys.nwcUrl, legacyWallet);
    navigate("/wallet/new");
  }, [navigate, legacyWallet]);

  return null;
}
