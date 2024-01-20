import { webln } from "@getalby/sdk";
import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { create } from "zustand";

import { CartItem, Item } from "../types";

interface State {
  readonly provider: webln.NostrWebLNProvider | undefined;
  readonly cart: CartItem[];
  ndk: NDK | undefined;
}

interface Actions {
  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
  addItemToCart(item: Item): void;
  removeItemFromCart(item: Item): void;
  clearCart(): void;
}

const initialRelays = ["wss://relay.damus.io", "wss://relay.shitforce.one"];

const useStore = create<State & Actions>((set, get) => ({
  provider: undefined,
  ndk: undefined,
  cart: [],

  setProvider: (provider) => {
    let ndk: NDK | undefined;
    if (provider) {
      ndk = new NDK({
        cacheAdapter: new NDKCacheAdapterDexie({ dbName: "ndk-cache" }),
        explicitRelayUrls: initialRelays,
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
        signer: new NDKPrivateKeySigner(provider.secret),
      });
      ndk.connect();
    } else {
      // TODO: properly clean up ndk - is there a disconnect function?
    }

    set({
      provider,
      ndk,
    });
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
}));

export default useStore;
