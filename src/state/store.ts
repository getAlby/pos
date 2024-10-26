import { webln } from "@getalby/sdk";
import NDK, { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import NDKCacheAdapterDexie from "@nostr-dev-kit/ndk-cache-dexie";
import { create } from "zustand";

interface State {
  readonly provider: webln.NostrWebLNProvider | undefined;
}

interface Actions {
  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
}

const useStore = create<State & Actions>(() => ({
  provider: undefined,
  setProvider: (provider) => ({
    provider,
  }),
}));

export default useStore;
