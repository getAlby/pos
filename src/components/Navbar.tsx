import { Link } from "react-router-dom";
import { BuzzPay } from "./icons/BuzzPay";
import {
  PopiconsCartDuotone,
  PopiconsShareDuotone,
  PopiconsLeftSidebarTopNavDuotone,
} from "@popicons/react";

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost m-1">
            <PopiconsLeftSidebarTopNavDuotone className="w-6 h-6" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-60"
          >
            <li>
              <Link to="../share">
                <PopiconsShareDuotone className="w-4 h-4" /> Share with a
                co-worker
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 justify-center">
        <BuzzPay className="h-6 mt-2" />
      </div>
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => alert("Coming soon!")}
        >
          <PopiconsCartDuotone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
