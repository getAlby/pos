import React, { FormEvent } from 'react';
import { Backbar } from '../../components/Backbar';
import { usePublish } from 'nostr-hooks';
import { RELAYS, appCustomDataTag, appCustomDataValues } from '../../constants';
import { useProfilePubkey } from '../../hooks/useProfilePubkey';
import { useProfileMetadata } from '../../hooks/useProfileMetadata';
import { nip19 } from 'nostr-tools';
import useStore from '../../state/store';

export function Profile() {
  const [npub, setNpub] = React.useState('');
  const [isSaving, setSaving] = React.useState(false);
  const provider = useStore((store) => store.provider);

  const publish = usePublish(RELAYS, provider?.secret);

  console.log('NWC wallet pubkey', provider?.publicKey);
  const profileData = useProfilePubkey(provider?.publicKey);
  const { metadata } = useProfileMetadata(profileData.profilePubkey);

  React.useEffect(() => {
    if (npub || !profileData.npub) {
      return;
    }
    setNpub(profileData.npub);
  }, [profileData, npub]);

  const isLoading = profileData.isLoading;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);

      const result = await publish({
        kind: 30078,
        content: nip19.decode(npub).data as string,
        tags: [
          [appCustomDataTag, appCustomDataValues.profilePubkey],
          ['d', 'BuzzPay profile pubkey'],
        ],
      });
      console.log('Published', result);
      profileData.invalidate();
    } catch (error) {
      console.error(error);
      alert('Failed to update profile: ' + error);
    } finally {
      setSaving(false);
    }
  }

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
                      <img src={metadata.picture} className="w-16 h-16" />
                    </>
                  ) : (
                    `No profile metadata found in ${RELAYS.join(', ')}`
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
