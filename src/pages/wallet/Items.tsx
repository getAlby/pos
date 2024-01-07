import React, { FormEvent } from "react";
import { Backbar } from "../../components/Backbar";
import { usePublish } from "nostr-hooks";
import { RELAYS, appCustomDataTag, appCustomDataValues } from "../../constants";
import { useItems } from "../../hooks/useItems";
import { Item } from "../../types";
import useStore from "../../state/store";

export function Items() {
  const { cart, addItemToCart, removeItemFromCart, clearCart } = useStore();
  const [itemName, setItemName] = React.useState("");
  const [itemPrice, setItemPrice] = React.useState("");
  const [isSaving, setSaving] = React.useState(false);
  const provider = useStore((store) => store.provider);
  const publish = usePublish(RELAYS, provider?.secret);
  const itemsData = useItems(provider?.publicKey);
  const isLoading = itemsData.isLoading;

  if (isLoading) {
    return <p>Loading items...</p>;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);

      const item: Item = {
        name: itemName,
        price: parseInt(itemPrice),
      };

      if (isNaN(item.price) || item.price < 1) {
        throw new Error("Invalid item price");
      }
      const result = await publish({
        kind: 30078,
        content: JSON.stringify(item),
        tags: [
          [appCustomDataTag, appCustomDataValues.item],
          ["d", "BuzzPay item - " + item.name],
        ],
      });
      console.log("Published", result);
      itemsData.invalidate();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile: " + error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Backbar />
      <div className="flex flex-1 flex-col w-full h-full justify-center items-center gap-4">
        <h1 className="text-lg">Cart</h1>
        {cart.map((item) => (
          <div
            key={item.name}
            className="flex justify-center items-center gap-2"
          >
            <p className="flex-1">
              {item.name} - {item.price} sats ({item.quantity})
            </p>
            <button
              onClick={() => {
                addItemToCart(item);
              }}
              className="btn btn-success"
            >
              +
            </button>
            <button
              onClick={() => {
                removeItemFromCart(item);
              }}
              className="btn btn-error"
            >
              -
            </button>
          </div>
        ))}
        {cart.length > 0 && (
          <button
            onClick={() => {
              clearCart();
            }}
            className="btn btn-error"
          >
            Clear cart
          </button>
        )}
        <h1 className="text-lg">Add Items</h1>
        {itemsData.items.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              addItemToCart(item);
            }}
            className="btn btn-primary"
          >
            {item.name} - {item.price} sats (
            {cart.find((cartItem) => cartItem.name === item.name)?.quantity ||
              0}
            )
          </button>
        ))}

        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-end items-center w-full h-full gap-5"
        >
          <h2 className="text-lg">Create a new item</h2>
          <p>Name</p>
          <input
            className="input input-bordered w-full"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          ></input>
          <p>Price in sats</p>
          <input
            className="input input-bordered w-full"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          ></input>
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isSaving || !itemName || !itemPrice}
          >
            Add Item
            {isSaving && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </>
  );
}
