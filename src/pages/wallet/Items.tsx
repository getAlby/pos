import { NDKEvent } from "@nostr-dev-kit/ndk";
import { FormEvent, useState } from "react";

import { Backbar } from "../../components/Backbar";
import { appCustomDataTag, appCustomDataValues } from "../../constants";
import { useItems } from "../../hooks/useItems";
import useStore from "../../state/store";
import { Item } from "../../types";

export function Items() {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [isSaving, setSaving] = useState(false);

  const { cart, addItemToCart, removeItemFromCart, clearCart, ndk } = useStore();

  const itemsData = useItems();

  const isLoading = itemsData.isLoading;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    (async () => {
      try {
        setSaving(true);

        const item: Item = {
          name: itemName,
          price: parseInt(itemPrice),
        };

        if (isNaN(item.price) || item.price < 1) {
          throw new Error("Invalid item price");
        }

        const event = new NDKEvent(ndk);
        event.created_at = Math.floor(Date.now() / 1000);
        event.kind = 30078;
        event.content = JSON.stringify(item);
        event.tags = [
          [appCustomDataTag, appCustomDataValues.item],
          ["d", "BuzzPay item - " + item.name],
        ];

        const publishedRelays = await event.publish();
        console.log("Published to relays", publishedRelays);
      } catch (error) {
        console.error(error);

        alert("Failed to update profile: " + error);
      } finally {
        setSaving(false);
      }
    })();
  };

  if (isLoading) {
    return <p>Loading items...</p>;
  }

  return (
    <>
      <Backbar />
      <div className="flex flex-1 flex-col w-full h-full justify-center items-center gap-4">
        <h1 className="text-lg">Cart</h1>
        {cart.map((item) => (
          <div key={item.name} className="flex justify-center items-center gap-2">
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
            {cart.find((cartItem) => cartItem.name === item.name)?.quantity || 0})
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
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
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
