'use client';

import { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify } from '../ui/ui-layout';
import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
  ProfileCard,
} from './account-ui';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/services/getProfile';
import { updateProfile } from '@/services/updateProfile';

type ProfileData = {
  username: string | null;
  avatar: string | null;
  xLink: string | null;
};

export default function AccountDetailFeature() {
  const params = useParams();
  const { getToken } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: null,
    avatar: null,
    xLink: null,
  });
  const [loading, setLoading] = useState(true);

  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);

  useEffect(() => {
    async function fetchProfile() {
      if (address) {
        try {
          const token = await getToken();
          const profile = await getProfile({ token });
          setProfileData({
            username: profile.username,
            avatar: profile.avatar,
            xLink: profile.xLink,
          });
        } catch (error) {
          if (error instanceof Error) {
            toast.error(`Failed to fetch profile: ${error.message}`);
          }
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProfile();
  }, [address]);

  const handleProfileSave = async (data: {
    username: string | null;
    avatar: string | null;
    xLink: string | null;
  }) => {
    try {
      const token = await getToken();
      await updateProfile({
        data,
        token,
      });
      setProfileData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Failed to update profile: ${error.message}`);
      }
    }
  };

  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <div>
      <AppHero
        title={<AccountBalance address={address} />}
        subtitle={
          <div className="my-4">
            <ExplorerLink
              path={`account/${address}`}
              label={ellipsify(address.toString())}
            />
          </div>
        }
      >
        <div className="my-4">
          <AccountButtons address={address} />
        </div>
      </AppHero>

      <div className="space-y-8">
        {loading ? (
          <div>Loading profile...</div>
        ) : (
          <ProfileCard
            username={profileData.username}
            avatar={profileData.avatar}
            xLink={profileData.xLink}
            onSave={handleProfileSave}
          />
        )}
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  );
}
