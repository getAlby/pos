import { webln } from "@getalby/sdk";
import { create } from "zustand";

interface Store {
  readonly provider: webln.NostrWebLNProvider | undefined;

  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
}

const useStore = create<Store>((set) => ({
  provider: undefined,
  setProvider: (provider) => {
    set({ provider });
  },
}));

export default useStore;
