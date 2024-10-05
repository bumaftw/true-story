import Link from 'next/link';
import ArticleListFeature from '@/components/article/article-list-feature';

export default function Page() {
  return (
    <div>
      <ArticleListFeature />
      {/* Floating Create Article Button */}
      <Link href="/articles/create">
        <button className="btn btn-primary fixed bottom-20 right-6 rounded-full shadow-lg">
          Create Article
        </button>
      </Link>
    </div>
  );
}
