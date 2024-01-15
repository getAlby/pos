import { webln } from '@getalby/sdk';
import { create } from 'zustand';

import { CartItem, Item } from '../types';

interface State {
  readonly provider: webln.NostrWebLNProvider | undefined;
  readonly cart: CartItem[];
  relays: string[];
}

interface Actions {
  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
  addItemToCart(item: Item): void;
  removeItemFromCart(item: Item): void;
  clearCart(): void;
  addRelay(relay: string): void;
  removeRelay(relay: string): void;
}

const useStore = create<State & Actions>((set, get) => ({
  provider: undefined,
  cart: [],
  relays: ['wss://relay.damus.io', 'wss://relay.shitforce.one'],

  setProvider: (provider) => {
    set({ provider });
  },
  addItemToCart: (item) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((existing) => existing.name === item.name);
    if (existingItem) {
      const existingItemIndex = currentCart.indexOf(existingItem);
      set({
        cart: [
          ...currentCart.slice(0, existingItemIndex),
          { ...existingItem, quantity: existingItem.quantity + 1 },
          ...currentCart.slice(existingItemIndex + 1),
        ],
      });
    } else {
      set({
        cart: [...currentCart, { ...item, quantity: 1 }],
      });
    }
  },
  removeItemFromCart: (item) => {
    const currentCart = get().cart;
    const existingItem = currentCart.find((existing) => existing.name === item.name);
    if (!existingItem) {
      return;
    }
    if (existingItem.quantity > 1) {
      const existingItemIndex = currentCart.indexOf(existingItem);
      set({
        cart: [
          ...currentCart.slice(0, existingItemIndex),
          { ...existingItem, quantity: existingItem.quantity - 1 },
          ...currentCart.slice(existingItemIndex + 1),
        ],
      });
    } else {
      set({
        cart: currentCart.filter((item) => item !== existingItem),
      });
    }
  },
  clearCart: () => {
    set({
      cart: [],
    });
  },
  addRelay: (relay) => {
    const relays = get().relays;

    if (relays.includes(relay)) {
      return;
    }

    set({
      relays: [...relays, relay],
    });
  },
  removeRelay: (relay) => {
    set({
      relays: get().relays.filter((r) => r != relay),
    });
  },
}));

export default useStore;
