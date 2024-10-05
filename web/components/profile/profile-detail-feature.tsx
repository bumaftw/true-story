'use client';

import { useState, useEffect, useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { ProfileCard, ProfileData } from './profile-ui';
import { useAuth } from '@/hooks/useAuth';
import { getProfile } from '@/services/getProfile';
import ArticleListFeature from '@/components/article/article-list-feature';

export default function ProfileDetailFeature() {
  const params = useParams();
  const { getToken } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    publicKey: '',
    username: null,
    avatar: null,
    xLink: null,
  });
  const [loading, setLoading] = useState(true);

  const address = useMemo(() => {
    if (!params.address) {
      return null;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log('Invalid public key', e);
      return null;
    }
  }, [params]);

  useEffect(() => {
    async function fetchProfile() {
      if (address) {
        try {
          const token = await getToken();
          const profile = await getProfile({
            token,
            publicKey: address.toString(),
          });
          setProfileData({
            publicKey: profile.publicKey,
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

  if (!address) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {loading ? (
          <div className="text-center text-gray-600">Loading profile...</div>
        ) : (
          <>
            <ProfileCard
              publicKey={profileData.publicKey}
              username={profileData.username}
              avatar={profileData.avatar}
              xLink={profileData.xLink}
            />

            <h2 className="text-xl font-semibold text-center">
              Articles by {profileData.username || 'this author'}
            </h2>

            <ArticleListFeature publicKey={address.toString()} />
          </>
        )}
      </div>
    </div>
  );
}
