import { PopiconsCircleCheckDuotone } from "@popicons/react"
import { Link } from "react-router-dom";

export function Paid() {
  return (
    <>
      <div className="flex flex-col gap-5 justify-center items-center grow">
        <div className="text-center">
          <PopiconsCircleCheckDuotone className="w-56 h-56 text-primary" />
          <span className="text-xl">Payment received</span>
        </div>
      </div>
      <Link to="../new" className="w-full">
        <button className="btn btn-primary w-full">Start over</button>
      </Link>
    </>
  );
}
