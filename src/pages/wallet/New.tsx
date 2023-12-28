import { webln } from "@getalby/sdk";
import React, { FormEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export function New() {
  const [amount, setAmount] = React.useState("");
  const navigate = useNavigate();
  const provider = useOutletContext() as webln.NostrWebLNProvider;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
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
    }
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center h-full flex-1"
      >
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="mb-4">Amount (sats)</p>
          <input
            type="number"
            className="input input-ghost text-6xl text-center"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></input>
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Continue
        </button>
      </form>
    </>
  );
}
