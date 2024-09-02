import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";
import { MAX_MEMO_LENGTH } from "../../constants";

export function New() {
  const [amount, setAmount] = React.useState("");
  const [label, setLabel] = React.useState("");
  const { cart, addItemToCart } = useStore();
  const [isLoading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);

  function convertCurrentEntryToCartItem() {
    if (amount) {
      const findFreeLabel = () => {
        const labelPrefix = "Item ";
        let index = 0;
        let freeLabel: string;
        do {
          index++;
          freeLabel = `${labelPrefix}${index}`;
        } while (cart.some((item) => item.name === freeLabel));
        return freeLabel;
      };

      addItemToCart({
        name: label || findFreeLabel(),
        price: parseInt(amount),
      });
      setAmount("");
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      convertCurrentEntryToCartItem();

      const finalCart = useStore.getState().cart;
      if (!finalCart.length) {
        throw new Error("Empty cart");
      }
      let memo = "";

      // TODO: group cart items
      memo += finalCart.map((item) => item.name).join(", ");
      memo += " - ";

      memo += "BuzzPay";

      const totalAmount = finalCart
        .map((cart) => cart.price * cart.quantity)
        .reduce((a, b) => a + b);

      const invoice = await provider?.makeInvoice({
        amount: totalAmount,
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
      <Navbar onOpenCart={convertCurrentEntryToCartItem} />
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
            disabled={isLoading || (!amount && !cart.length)}
          >
            Charge{" "}
            {cart
              .map((cart) => cart.price * cart.quantity)
              .reduce((a, b) => a + b, parseInt(amount || "0"))}{" "}
            sats
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
