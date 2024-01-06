import { PopiconsArrowLeftDuotone } from "@popicons/react";
import { useNavigate } from "react-router-dom";

export function Backbar() {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button className="btn btn-ghost m-1" onClick={() => navigate(-1)}>
          <PopiconsArrowLeftDuotone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
