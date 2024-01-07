import { useSubscribe } from "nostr-hooks";
import React from "react";
import { RELAYS, appCustomDataTag, appCustomDataValues } from "../constants";
import { nip19 } from "nostr-tools";

export function useProfilePubkey(walletPubkey?: string) {
  const { events, invalidate, eose } = useSubscribe({
    relays: RELAYS,
    filters: walletPubkey
      ? [
          {
            authors: [walletPubkey],
            kinds: [30078],
            // custom hashtag filter support is not supported by all relays?
            //[`#${appCustomDataTag}`]: [appCustomDataValues.profilePubkey],
            //limit: 1,
          },
        ]
      : [],
    options: {
      enabled: !!walletPubkey,
    },
  });

  const profilePubkey: string | undefined = React.useMemo(
    () =>
      // TODO: remove filter when above relay filter works
      events.filter((event) =>
        event.tags.some(
          (t) =>
            t[0] === appCustomDataTag &&
            t[1] === appCustomDataValues.profilePubkey
        )
      )[0]?.content,
    [events]
  );

  const isLoading = !eose && !events.length;
  const npub = profilePubkey ? nip19.npubEncode(profilePubkey) : undefined;

  return { profilePubkey, npub, invalidate, isLoading };
}
