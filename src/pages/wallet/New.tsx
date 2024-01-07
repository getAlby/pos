import { webln } from "@getalby/sdk";
import React, { FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Navbar } from "../../components/Navbar";

export function New() {
  const [amount, setAmount] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const provider = useOutletContext() as webln.NostrWebLNProvider;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const amountSats = parseInt(amount);
      if (isNaN(amountSats) || amountSats < 1) {
        throw new Error("Invalid amount: " + amountSats);
      }

      const invoice = await provider.makeInvoice({
        amount: amountSats,
        defaultMemo: "Alby PoS",
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
              className="input input-ghost max-w-full text-center text-6xl p-16"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            ></input>
          </div>
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isLoading || !amount}
          >
            Charge
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
