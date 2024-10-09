import Link from 'next/link';
import ArticleListFeature from '@/components/article/article-list-feature';
import { IconPlus } from '@tabler/icons-react';

export default function Page() {
  return (
    <div className="relative pt-6 pb-4">
      <ArticleListFeature />
      {/* Floating Create Article Button */}
      <Link href="/articles/create">
        <button className="btn btn-primary fixed bottom-20 right-6 rounded-full shadow-lg flex items-center justify-center md:w-auto md:h-auto">
          <IconPlus className="h-6 w-6" />
          <span className="hidden lg:inline">Create Article</span>
        </button>
      </Link>
    </div>
  );
}
