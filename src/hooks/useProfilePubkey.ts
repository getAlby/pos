import { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { useEffect, useMemo, useState } from 'react';

import { appCustomDataTag, appCustomDataValues } from '../constants';
import useStore from '../state/store';

export function useProfilePubkey() {
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const [eose, setEose] = useState<boolean>(false);

  const ndk = useStore((store) => store.ndk);
  const walletPubkey = useStore((store) => store.provider)?.publicKey;

  useEffect(() => {
    if (!walletPubkey) {
      return;
    }

    const filters: NDKFilter[] = [
      {
        authors: [walletPubkey],
        kinds: [30078],
        // custom hashtag filter support is not supported by all relays?
        //[`#${appCustomDataTag}`]: [appCustomDataValues.profilePubkey],
        //limit: 1,
      },
    ];

    setEose(false);

    const subscription = ndk.subscribe(filters);

    subscription.on('event', (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    });

    subscription.on('eose', () => {
      setEose(true);
    });
  }, [ndk, walletPubkey, setEvents]);

  const profilePubkey: string | undefined = useMemo(
    () =>
      // TODO: remove filter when above relay filter works
      events.filter((event) =>
        event.tags.some(
          (t) => t[0] === appCustomDataTag && t[1] === appCustomDataValues.profilePubkey
        )
      )[0]?.content || undefined,
    [events]
  );

  const isLoading = !eose && !events.length;
  const npub = profilePubkey ? nip19.npubEncode(profilePubkey) : undefined;

  return { profilePubkey, npub, isLoading };
}
