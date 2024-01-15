import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Wallet } from './pages/Wallet';
import { NotFound } from './pages/NotFound';
import { New } from './pages/wallet/New';
import { Pay } from './pages/wallet/Pay';
import { Paid } from './pages/wallet/Paid';
import { Share } from './pages/wallet/Share';
import { About } from './pages/About';
import { Profile } from './pages/wallet/Profile';
import { Items } from './pages/wallet/Items';

function App() {
  return (
    <div
      data-theme="bumblebee"
      className="flex flex-col justify-center items-center font-sans h-full w-full"
    >
      <HashRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/wallet/:nwcUrl" Component={Wallet}>
            <Route path="new" Component={New} />
            <Route path="pay/:invoice" Component={Pay} />
            <Route path="paid" Component={Paid} />
            <Route path="share" Component={Share} />
            <Route path="profile" Component={Profile} />
            <Route path="items" Component={Items} />
          </Route>
          <Route path="/about" Component={About} />
          <Route path="/*" Component={NotFound} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
