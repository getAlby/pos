import { PopiconsCircleCheckDuotone } from "@popicons/react"

export function Paid() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <div className="text-center">
        <PopiconsCircleCheckDuotone className="w-56 h-56 text-primary" />
        <span className="text-xl">Payment received</span>
      </div>
      <a href="new">
        <button className="btn btn-primary">Start over</button>
      </a>
    </div>
  );
}
