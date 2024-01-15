import { useSubscribe } from 'nostr-hooks';
import { RELAYS } from '../constants';

export function useProfileMetadata(profilePubkeyHex: string | undefined) {
  // console.log("Profile pubkey hex:", profilePubkeyHex);
  const { events, eose } = useSubscribe({
    relays: RELAYS,
    filters: profilePubkeyHex
      ? [
          {
            authors: [profilePubkeyHex],
            kinds: [0],
            limit: 1,
          },
        ]
      : [],
    options: {
      enabled: !!profilePubkeyHex,
    },
  });

  const isLoading = !eose && !events.length;
  const metadataEvent = events?.[0];
  const metadata = metadataEvent
    ? (JSON.parse(metadataEvent.content) as {
        name?: string;
        picture?: string;
      })
    : undefined;

  // console.log("Profile metadata", metadata, eose, events);

  return { metadata, isLoading };
}
