import { useSubscribe } from "nostr-hooks";
import React from "react";
import { RELAYS, appCustomDataTag, appCustomDataValues } from "../constants";
import { Item } from "../types";

export function useItems(walletPubkey?: string) {
  const { events, invalidate, eose } = useSubscribe({
    relays: RELAYS,
    filters: walletPubkey
      ? [
          {
            authors: [walletPubkey],
            kinds: [30078],
            limit: 100,
            // custom hashtag filter support is not supported by all relays?
            // [`#${appCustomDataTag}`]: [appCustomDataValues.item],
          },
        ]
      : [],
    options: {
      enabled: !!walletPubkey,
    },
  });

  const items = React.useMemo(
    () =>
      // TODO: remove filter when above relay filter works
      events
        .filter((event) =>
          event.tags.some(
            (t) =>
              t[0] === appCustomDataTag && t[1] === appCustomDataValues.item
          )
        )
        .map((event) => JSON.parse(event.content) as Item),
    [events]
  );

  const isLoading = !eose && !events.length;
  // console.log(items, events);

  return { items, invalidate, isLoading };
}
