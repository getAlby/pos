import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";
import { MAX_MEMO_LENGTH } from "../../constants";

export function New() {
  const { amount, setAmount, cart } = useStore();
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const amountSats = parseInt(amount);
      if (isNaN(amountSats) || amountSats < 1) {
        throw new Error("Invalid amount: " + amountSats);
      }

      let memo = "";

      if (cart.length) {
        // TODO: group cart items
        memo += cart.map((cart) => cart.name).join(", ");
        memo += " - ";
      }

      memo += "Alby PoS";

      const invoice = await provider?.makeInvoice({
        amount: amountSats,
        defaultMemo: memo.substring(0, MAX_MEMO_LENGTH),
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
              onChange={(e) => {
                setAmount(e.target.value);
              }}
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
