'use client';

import { WalletButton } from '../solana/solana-provider';
import * as React from 'react';
import { IconMenu2, IconBook, IconHelpCircle } from '@tabler/icons-react';
import { ReactNode, Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountChecker } from '../account/account-ui';
import { ClusterChecker, ExplorerLink } from '../cluster/cluster-ui';
import toast, { Toaster } from 'react-hot-toast';

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <header className="navbar bg-gray-300 text-black py-4 px-2 fixed top-0 w-full z-10">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="dropdown md:hidden">
              <label tabIndex={0} className="btn btn-ghost">
                <IconMenu2 className="h-5 w-5" strokeWidth={2} />
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-5 p-2 shadow bg-gray-300 rounded-box w-52 space-y-2"
              >
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`btn btn-sm w-full ${
                        pathname.startsWith(path) ? 'btn-primary' : ''
                      }`}
                      href={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link className="btn btn-ghost normal-case text-xl px-2" href="/">
              <img className="h-8 md:h-12" alt="Logo" src="/logo.png" />
            </Link>
            <div className="hidden md:flex ml-4">
              <ul className="menu menu-horizontal px-1 space-x-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`btn btn-sm ${
                        pathname.startsWith(path) ? 'btn-primary' : ''
                      }`}
                      href={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2">
            <Link href="/">
              <button className="btn btn-outline btn-primary navbar-button">
                <IconHelpCircle
                  className="h-4 w-4 md:h-5 md:w-5"
                  strokeWidth={2}
                />
                <span className="navbar-button-text">How to Use</span>
              </button>
            </Link>
            <Link
              href="https://organic-dew-c9f.notion.site/5acf0f1d33074635bd2d85ae7961b570"
              target="_blank"
            >
              <button className="btn btn-outline btn-primary navbar-button">
                <IconBook className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                <span className="navbar-button-text">Product Wiki</span>
              </button>
            </Link>
            <WalletButton />
            {/* TODO: hide until admin part is not implemented */}
            {/* <ClusterUiSelect /> */}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-grow container mx-auto px-4 lg:px-12 mt-20 mb-16">
        <ClusterChecker>
          <AccountChecker />
        </ClusterChecker>
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        <Toaster position="bottom-right" />
      </main>

      {/* Fixed Footer */}
      <footer className="footer footer-center p-4 bg-gray-300 text-gray-600 fixed bottom-0 w-full">
        <aside className="flex items-center justify-center">
          <p>Powered by</p>
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/solana-sol-logo-horizontal.svg"
              alt="Solana"
              className="h-6"
            />
          </a>
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
            <button onClick={hide} className="btn btn-outline btn-xs lg:btn-md">
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
    <div className="hero pt-10">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? (
            <h1 className="text-3xl font-bold text-primary">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === 'string' ? (
            <p className="py-6 text-gray-600">{subtitle}</p>
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
