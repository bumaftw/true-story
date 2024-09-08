'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountChecker } from '../account/account-ui';
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';
import { TOKEN_STORAGE_KEY } from '@/constants';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();
  const { wallet } = useWallet();

  useEffect(() => {
    if (!wallet || !wallet.adapter) return;

    const handleDisconnect = () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    };

    wallet.adapter.on('disconnect', handleDisconnect);

    return () => {
      wallet.adapter.off('disconnect', handleDisconnect);
    };
  }, [wallet]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="navbar bg-gray-300 text-black flex-col md:flex-row py-4 space-y-2 md:space-y-0 px-4">
        <div className="flex-1 flex items-center">
          <Link className="btn btn-ghost normal-case text-xl" href="/">
            <img className="h-8 md:h-12" alt="Logo" src="/logo.png" />
          </Link>
          <ul className="menu menu-horizontal px-1 space-x-4">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link className={`btn btn-sm ${pathname.startsWith(path) ? 'btn-primary' : ''}`} href={path}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-none space-x-4 flex items-center">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </header>

      {/* Main Content */}
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      <main className="flex-grow container mx-auto px-4 lg:px-12">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        <Toaster position="bottom-right" />
      </main>

      {/* Fixed Footer */}
      <footer className="footer footer-center p-4 bg-gray-300 text-gray-600 fixed bottom-0 w-full">
        <aside>
          <p>Building a radically better news platform</p>
        </aside>
      </footer>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="text-center my-32">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show, dialogRef]);

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-4">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit && (
              <button
                className="btn btn-primary btn-xs lg:btn-md"
                onClick={submit}
                disabled={submitDisabled}
              >
                {submitLabel || 'Save'}
              </button>
            )}
            <button onClick={hide} className="btn btn-outline">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-20">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-5xl font-bold text-primary">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6 text-lg text-gray-600">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className="text-center">
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink
          path={`tx/${signature}`}
          label={'View Transaction'}
          className="btn btn-xs btn-primary"
        />
      </div>
    );
  };
}
