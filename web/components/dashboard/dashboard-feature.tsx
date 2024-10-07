'use client';

import Link from 'next/link';

export default function DashboardFeature() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="pt-6 pb-2 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold text-primary">
              How to use the TrueStory Demo
            </h1>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Get started with TrueStory by following this simple guide.
          </p>
        </div>
      </div>

      {/* Guide Section */}
      <div className="max-w-2xl mx-auto py-4 sm:px-6 lg:px-8 text-left">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Step-by-Step Guide:
          </h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Install Phantom Wallet:</strong> Download the Phantom wallet extension from the{' '}
              <a
                href="https://phantom.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                official website
              </a>{' '}
              and add it to your browser.
            </li>
            <li>
              <strong>Follow the onboarding process:</strong> After installation, either create a new wallet or select an existing wallet to get started.
            </li>
            <li>
              <strong>Set it up for Devnet:</strong> After setting up your wallet, click on your account -&gt; go to Settings -&gt; Developer Settings -&gt; turn on Testnet Mode -&gt; select the Solana Devnet network.
            </li>
            <li>
              <strong>Top up your wallet:</strong> Use{' '}
              <a
                href="https://spl-token-faucet.com/?token-name=USDC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                this faucet
              </a>{' '}
              to get both SOL (for transaction fees) and USDC tokens to pay for articles.
            </li>
            <li>
              <strong>Explore articles:</strong> Browse the latest stories and unlock paid content by making a one-time payment in USDC tokens.
            </li>
          </ol>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-xl mx-auto py-2 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ready to explore TrueStory?
          </h2>
          <p className="text-gray-600">
            Start browsing and unlocking exclusive content today.
          </p>
          <Link href="/articles">
            <button className="btn btn-primary mt-4">READ ARTICLES</button>
          </Link>
        </div>
      </div>

      {/* Follow us on Twitter */}
      <div className="max-w-xl mx-auto py-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600">
          Follow us on{' '}
          <a
            href="https://x.com/truestoryen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Twitter
          </a>{' '}
          for updates and more!
        </p>
      </div>
    </div>
  );
}
