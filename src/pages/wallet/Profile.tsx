import { NDKEvent } from '@nostr-dev-kit/ndk';
import { nip19 } from 'nostr-tools';
import { FormEvent, useEffect, useState } from 'react';

import { Backbar } from '../../components/Backbar';
import { appCustomDataTag, appCustomDataValues } from '../../constants';
import { useProfileMetadata } from '../../hooks/useProfileMetadata';
import { useProfilePubkey } from '../../hooks/useProfilePubkey';
import useStore from '../../state/store';

export function Profile() {
  const [npub, setNpub] = useState('');
  const [isSaving, setSaving] = useState(false);

  const ndk = useStore((store) => store.ndk);

  const profileData = useProfilePubkey();
  const { metadata } = useProfileMetadata(profileData.profilePubkey);

  const isLoading = profileData.isLoading;
  const relays = ndk?.explicitRelayUrls || [];

  useEffect(() => {
    if (npub || !profileData.npub) {
      return;
    }

    setNpub(profileData.npub);
  }, [profileData, npub]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    (async () => {
      try {
        setSaving(true);

        const event = new NDKEvent(ndk);
        event.created_at = Math.floor(Date.now() / 1000);
        event.kind = 30078;
        event.content = nip19.decode(npub).data as string;
        event.tags = [
          [appCustomDataTag, appCustomDataValues.profilePubkey],
          ['d', 'BuzzPay profile pubkey'],
        ];

        const publishedRelays = await event.publish();
        console.log('Published to relays', event, publishedRelays);
      } catch (error) {
        console.error(error);

        alert('Failed to update profile: ' + error);
      } finally {
        setSaving(false);
      }
    })();
  };

  return (
    <>
      <Backbar />
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div className="flex flex-1 flex-col w-full h-full justify-center items-center">
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center w-full h-full"
          >
            <div className="flex flex-col justify-center items-center grow max-w-full gap-5">
              <p>Nostr npub</p>
              <input
                className="input input-bordered max-w-full"
                value={npub}
                onChange={(e) => setNpub(e.target.value)}
              ></input>
              {profileData.profilePubkey && (
                <>
                  {metadata ? (
                    <>
                      <p>{metadata.name || 'No name set'}</p>
                      <img src={metadata.image} className="w-16 h-16" />
                    </>
                  ) : (
                    `No profile metadata found in ${relays.join(', ')}`
                  )}
                </>
              )}
            </div>
            <button
              className="btn btn-primary w-full"
              type="submit"
              disabled={isSaving || !npub || npub === profileData.npub}
            >
              Update
              {isSaving && <span className="loading loading-spinner"></span>}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
