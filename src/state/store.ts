import { webln } from '@getalby/sdk';
import NDK, { NDKConstructorParams, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { create } from 'zustand';

import { CartItem, Item } from '../types';

interface State {
  readonly provider: webln.NostrWebLNProvider | undefined;
  readonly cart: CartItem[];
  ndk: NDK;
}

interface Actions {
  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
  addItemToCart(item: Item): void;
  removeItemFromCart(item: Item): void;
  clearCart(): void;
  addRelay(relay: string): void;
  removeRelay(relay: string): void;
}

const initialRelays = ['wss://relay.damus.io', 'wss://relay.shitforce.one'];
const initialSigner = undefined;

const initialNdkConstructorParams: NDKConstructorParams = {
  cacheAdapter: new NDKCacheAdapterDexie({ dbName: 'ndk-cache' }),
  explicitRelayUrls: initialRelays,
  signer: initialSigner,
  autoConnectUserRelays: false,
  autoFetchUserMutelist: false,
};

const useStore = create<State & Actions>((set, get) => ({
  provider: undefined,
  cart: [],
  ndk: new NDK(initialNdkConstructorParams),

  setProvider: (provider) => {
    set((state) => ({
      provider,
      ndk: new NDK({
        ...state.ndk,
        signer: new NDKPrivateKeySigner(provider?.secret),
      }),
    }));
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
    set((state) => {
      const currentRelays = state.ndk.explicitRelayUrls || [];

      if (currentRelays.includes(relay)) {
        return state;
      }

      return {
        ndk: new NDK({
          ...state.ndk,
          explicitRelayUrls: [...currentRelays, relay],
        }),
      };
    });
  },

  removeRelay: (relay) => {
    set((state) => {
      const currentRelays = state.ndk.explicitRelayUrls || [];

      if (!currentRelays.includes(relay)) {
        return state;
      }

      return {
        ndk: new NDK({
          ...state.ndk,
          explicitRelayUrls: currentRelays.filter((r) => r != relay),
        }),
      };
    });
  },
}));

export default useStore;
