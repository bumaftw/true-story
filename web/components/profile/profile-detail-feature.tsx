'use client';

import { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ExplorerLink } from '../cluster/cluster-ui';
import { ProfileCard, ProfileData } from './profile-ui';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/services/getProfile';
import { updateProfile } from '@/services/updateProfile';
import ArticleListFeature from '@/components/article/article-list-feature';

export default function ProfileDetailFeature() {
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
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      <ExplorerLink path={`account/${address}`} label={address.toString()} />

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
        <h2 className="text-2xl font-bold">Articles by this author</h2>
        <ArticleListFeature publicKey={address.toString()} />
      </div>
    </div>
  );
}
