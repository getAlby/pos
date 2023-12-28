import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Wallet } from "./pages/Wallet";
import { NotFound } from "./pages/NotFound";
import { New } from "./pages/wallet/New";
import { Pay } from "./pages/wallet/Pay";
import { Paid } from "./pages/wallet/Paid";

function App() {
  return (
    <div
      data-theme="bumblebee"
      className="flex flex-col justify-center items-center w-full min-h-full p-8 font-sans"
    >
      <BrowserRouter basename="/pos">
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/wallet/:nwcUrl" Component={Wallet}>
            <Route path="new" Component={New} />
            <Route path="pay/:invoice" Component={Pay} />
            <Route path="paid" Component={Paid} />
          </Route>
          <Route path="/*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
