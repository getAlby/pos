import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";

export function New() {
  const [amount, setAmount] = React.useState("");
  const [label, setLabel] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount) {
      return;
    }
    try {
      setLoading(true);

      const invoice = await provider?.makeInvoice({
        amount: amount,
        defaultMemo: label,
      });
      navigate(`../pay/${invoice.paymentRequest}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create invoice: " + error);
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
        <form
          onSubmit={onSubmit}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <div className="flex max-w-full grow flex-col items-center justify-center gap-5">
            <p>Amount (sats)</p>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              className="input input-ghost max-w-full p-16 text-center text-6xl"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            ></input>
            <button
              type="button"
              onClick={() => {
                const newLabel = prompt("Label", label);
                if (newLabel) {
                  setLabel(newLabel);
                }
              }}
            >
              {label || "+ Add label"}
            </button>
          </div>
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isLoading || !amount}
          >
            Charge {amount}
            sats
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
