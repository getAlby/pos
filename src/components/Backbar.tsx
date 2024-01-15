import { PopiconsArrowLeftDuotone } from '@popicons/react';
import { To, useNavigate } from 'react-router-dom';

type BackbarProps = {
  navigateTo?: string | -1;
};

export function Backbar({ navigateTo }: BackbarProps) {
  const navigate = useNavigate();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button
          className="btn btn-ghost m-1"
          onClick={() => navigate((navigateTo as To) || '../new')}
        >
          <PopiconsArrowLeftDuotone className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
