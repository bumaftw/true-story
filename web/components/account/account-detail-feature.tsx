'use client';

import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

import { useParams } from 'next/navigation';

import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify } from '../ui/ui-layout';
import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
  ProfileCard,
} from './account-ui';

const mockUserData = {
  username: null,
  avatarUrl: null,
  xLink: null,
};

export default function AccountDetailFeature() {
  const params = useParams();
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

  const handleProfileSave = (data: {
    username: string | null;
    avatarUrl: string | null;
    xLink: string | null;
  }) => {
    console.log('Profile updated:', data);
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
        <ProfileCard
          username={mockUserData.username}
          avatarUrl={mockUserData.avatarUrl}
          xLink={mockUserData.xLink}
          onSave={handleProfileSave}
        />
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  );
}
