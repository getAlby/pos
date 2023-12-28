import { webln } from "@getalby/sdk";
import React, { FormEvent } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

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
        className="flex flex-col justify-center items-center max-w-full h-full"
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
          <div className="mt-10">
            <Link className="link link-secondary" to="../share">
              Share with a co-worker
            </Link>
          </div>
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Continue
        </button>
      </form>
    </>
  );
}
