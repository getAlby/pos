import { Link } from "react-router-dom";
import { BuzzPay } from "./icons/BuzzPay";
import {
  PopiconsBulbDuotone,
  PopiconsLeftSidebarTopNavDuotone,
  PopiconsLogoutDuotone,
  PopiconsShareDuotone,
} from "@popicons/react";
import { localStorageKeys } from "../constants";

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            <PopiconsLeftSidebarTopNavDuotone className="h-6 w-6" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-60 p-2 shadow"
          >
            <li key="share">
              <Link to="../share">
                <PopiconsShareDuotone className="w-4 h-4" /> Share with a co-worker
              </Link>
            </li>
            <li key="about">
              <Link to="/about">
                <PopiconsBulbDuotone className="h-4 w-4" /> About BuzzPay
              </Link>
            </li>
            <li key="logout">
              <Link
                to="/"
                onClick={(e) => {
                  if (!confirm("Are you sure you wish to log out? your wallet will be lost.")) {
                    e.preventDefault();
                    return;
                  }
                  window.localStorage.removeItem(localStorageKeys.nwcUrl);
                }}
                className="text-error"
              >
                <PopiconsLogoutDuotone className="h-4 w-4" /> Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 justify-center">
        <BuzzPay className="mt-2 h-6 w-24" style={{ marginLeft: "-66px" }} />
      </div>
      <div className="flex-none"></div>
    </div>
  );
}
