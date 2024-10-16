import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import useStore from "../../state/store";
import { CURRENCIES, MAX_MEMO_LENGTH } from "../../constants";
import { fiat } from "@getalby/lightning-tools";

export function New() {
  const [amount, setAmount] = React.useState("");
  const [label, setLabel] = React.useState("");
  const { cart, addItemToCart, removeItemFromCart } = useStore();
  const [isLoading, setLoading] = React.useState(false);
  const [currency, setCurrency] = React.useState("sats");
  const navigate = useNavigate();
  const provider = useStore((store) => store.provider);

  async function convertCurrentEntryToCartItem() {
    if (amount) {
      try {
        const satoshiValue =
          currency === "sats" ? parseInt(amount) : await fiat.getSatoshiValue({ amount, currency });
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
          price: satoshiValue,
        });
        setAmount("");
      } catch (error) {
        alert("Failed to create invoice: " + error);
      }
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await convertCurrentEntryToCartItem();

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
      //remove the last item from the cart if the price is too high for lightning payment
      const { cart } = useStore.getState();
      removeItemFromCart(cart[cart.length - 1]);
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
            <p>Amount ({currency})</p>
            <select
              onChange={(e) => setCurrency(e.target.value)}
              title="currency-select"
              className="select select-bordered max-w-xs"
            >
              <option disabled selected>
                Choose Currency
              </option>
              {CURRENCIES.map((currency, i) => (
                <option key={i} value={currency.currency}>
                  {currency.currency}
                </option>
              ))}
            </select>
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
            {currency}
            {isLoading && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
