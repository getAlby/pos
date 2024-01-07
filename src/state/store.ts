import { webln } from "@getalby/sdk";
import { create } from "zustand";
import { Item } from "../types";

interface Store {
  readonly provider: webln.NostrWebLNProvider | undefined;
  readonly amount: string;
  readonly cart: Item[];

  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
  setAmount(amount: string): void;
  addItemToCart(item: Item): void;
  startNewPurchase(): void;
  clearCart(): void;
}

const useStore = create<Store>((set, get) => ({
  provider: undefined,
  ...newPurchase(),
  setAmount: (amount) => {
    set({ amount });
  },
  setProvider: (provider) => {
    set({ provider });
  },
  addItemToCart: (item) => {
    set({ cart: [...get().cart, item] });
  },
  clearCart: () => {
    set({
      cart: [],
    });
  },
  startNewPurchase: () => {
    set(newPurchase());
  },
}));

function newPurchase() {
  return {
    amount: "",
    cart: [],
  };
}

export default useStore;
