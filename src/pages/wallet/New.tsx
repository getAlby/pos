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
      <div className="flex flex-1 flex-col w-full h-full justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center items-center w-full h-full"
        >
          <div className="flex flex-col justify-center items-center grow max-w-full gap-5">
            <p>Amount (sats)</p>
            <input
              type="number"
              className="input input-ghost text-6xl text-center max-w-full"
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
