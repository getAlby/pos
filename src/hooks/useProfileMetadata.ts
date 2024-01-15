import { NDKUserProfile } from '@nostr-dev-kit/ndk';
import { useEffect, useState } from 'react';

import useStore from '../state/store';

export function useProfileMetadata(pubkey: string | undefined) {
  const [metadata, setMetadata] = useState<NDKUserProfile | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const ndk = useStore((store) => store.ndk);

  useEffect(() => {
    if (!pubkey) {
      return;
    }

    ndk
      .getUser({ pubkey })
      .fetchProfile()
      .then((profile) => {
        if (profile) {
          setMetadata(profile);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [ndk, pubkey, setMetadata]);

  // console.log("Profile metadata", metadata, eose, events);

  return { metadata, isLoading };
}
