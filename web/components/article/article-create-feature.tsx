'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { createArticle } from '@/services/createArticle';
import { toast } from 'react-hot-toast';

export default function CreateArticleFeature() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState(0.2);
  const [loading, setLoading] = useState(false);

  const { mutateAsync } = useMutation({
    mutationKey: ['create-article'],
    mutationFn: async (input: { title: string; content: string; imageUrl?: string; price: number }) => {
      setLoading(true);

      const token = await getToken();
      const response = await createArticle({
        token,
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageUrl,
          price: input.price,
        },
      });

      return response;
    },
    onSuccess: () => {
      toast.success('Article created successfully!');
      setTitle('');
      setContent('');
      setImageUrl('');
      setPrice(0.2);
      setLoading(false);
    },
    onError: (error: Error) => {
      setLoading(false);
      toast.error(`Failed to create article: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      await mutateAsync({ title, content, imageUrl, price });
    } else {
      toast.error('Please fill out the required fields');
    }
  };

  return (
    <div className="pt-6 pb-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center py-2">
            <h1 className="text-3xl font-bold text-primary">Create an Article</h1>
          </div>
          <p className="text-gray-500">
            Share your latest insights and news with the world
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Article Title"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                placeholder="Write your article content here..."
                className="textarea textarea-bordered w-full"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Price Slider */}
            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Price (Tokens)</span>
              </label>
              <input
                type="range"
                min={0}
                max={2}
                value={price}
                step={0.1}
                className="range"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <div className="text-center text-gray-500 mt-2">
                {price} Tokens
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-between mt-4">
              {/* Back Button */}
              <button
                type="button"
                className="btn btn-outline btn-secondary input-bordered"
                onClick={() => router.back()}
              >
                ← Back to Articles
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
