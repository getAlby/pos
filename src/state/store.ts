import { webln } from "@getalby/sdk";
import { create } from "zustand";

interface State {
  readonly provider: webln.NostrWebLNProvider | undefined;
}

interface Actions {
  setProvider(provider: webln.NostrWebLNProvider | undefined): void;
}

const useStore = create<State & Actions>((set) => ({
  provider: undefined,
  setProvider: (provider) =>
    set({
      provider,
    }),
}));

export default useStore;
