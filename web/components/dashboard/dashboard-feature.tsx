'use client';

import { IconLayoutDashboard } from '@tabler/icons-react';
import Link from 'next/link';

export default function DashboardFeature() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-4">
            <IconLayoutDashboard size={40} className="text-primary mr-2" />
            <h1 className="text-4xl font-bold text-primary">
              A Radically Better News Platform
            </h1>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            Stay informed with the latest articles from our community. Your one-stop destination for trusted news.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ready to dive into the latest news?
          </h2>
          <p className="text-gray-600">
            Explore our curated articles, created and vetted by our trusted contributors.
          </p>
          <Link href="/articles">
            <button className="btn btn-primary mt-4">Explore Articles</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
