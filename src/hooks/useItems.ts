import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { useEffect, useMemo, useState } from 'react';

import { appCustomDataTag, appCustomDataValues } from '../constants';
import useStore from '../state/store';
import { Item } from '../types';

export function useItems() {
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [eose, setEose] = useState<boolean>(false);

  const ndk = useStore((store) => store.ndk);
  const walletPubkey = useStore((store) => store.provider)?.publicKey;

  useEffect(() => {
    if (!walletPubkey || !ndk) {
      return;
    }

    const filters: NDKFilter[] = [
      {
        authors: [walletPubkey],
        kinds: [30078],
        limit: 100,
        // custom hashtag filter support is not supported by all relays?
        // [`#${appCustomDataTag}`]: [appCustomDataValues.item],
      },
    ];

    setEose(false);

    const subscription = ndk.subscribe(filters);

    subscription.on('event', (event) => {
      setEvents((prevEvents) =>
        prevEvents.some((existingEvent) => existingEvent.id === event.id)
          ? prevEvents
          : [...prevEvents, event]
      );
    });

    subscription.on('eose', () => {
      setEose(true);
    });
  }, [ndk, walletPubkey, setEvents]);

  const items = useMemo(
    () =>
      // TODO: remove filter when above relay filter works
      events
        .filter((event) =>
          event.tags.some((t) => t[0] === appCustomDataTag && t[1] === appCustomDataValues.item)
        )
        .map((event) => JSON.parse(event.content) as Item),
    [events]
  );

  const isLoading = !eose && events.length == 0;
  // console.log(items, events);

  return { items, isLoading };
}
