'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getArticle } from '@/services/getArticle';
import { updateArticle } from '@/services/updateArticle';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const ARTICLE_QUERY_KEY = 'article_query_key';

export default function EditArticleFeature() {
  const router = useRouter();
  const { id }: { id: string } = useParams();
  const { connected, publicKey } = useWallet();
  const { getToken } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [price, setPrice] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const { data: article, isSuccess } = useQuery({
    queryKey: [ARTICLE_QUERY_KEY, id],
    queryFn: async () => {
      const token = await getToken();
      return await getArticle({ id: parseInt(id), token });
    },
    enabled: !!id && connected,
  });

  useEffect(() => {
    if (isSuccess && article) {
      setTitle(article.title);
      setContent(article.content);
      setPrice(article.price);
      setIsAuthor(article.author?.publicKey === publicKey?.toString());
    }
  }, [isSuccess, article, publicKey]);

  const { mutateAsync } = useMutation({
    mutationKey: ['update-article'],
    mutationFn: async (input: {
      title: string;
      content: string;
      imageFile?: string;
      price: number;
    }) => {
      setLoading(true);

      const token = await getToken();

      const response = await updateArticle({
        id: parseInt(id),
        token,
        data: {
          title: input.title,
          content: input.content,
          imageUrl: input.imageFile,
          price: input.price,
        },
      });

      return response;
    },
    onSuccess: () => {
      toast.success('Article updated successfully!');
      router.push(`/articles/${id}`);
    },
    onError: (error: Error) => {
      setLoading(false);
      toast.error(`Failed to update article: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      let imageBase64 = '';

      // TODO: implement file uploading
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      await mutateAsync({ title, content, imageFile: imageBase64, price });
    } else {
      toast.error('Please fill out the required fields');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    ['link', 'image', 'video'],
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ header: [1, 2, 3, false] }],
    [{ align: [] }],
    ['clean'],
  ];

  if (!connected) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-20">Loading article...</div>;
  }

  if (!isAuthor) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <h1 className="text-2xl font-bold">
            You are not authorized to edit this article
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6 pb-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center py-2">
            <h1 className="text-3xl font-bold text-primary">Edit Article</h1>
          </div>
          <p className="text-gray-500">Update your article details below</p>
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
              <ReactQuill
                modules={{ toolbar: toolbarOptions }}
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Edit your article content..."
              />
            </div>

            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="input input-bordered w-full"
                style={{ paddingTop: '0.5rem' }}
                onChange={handleImageChange}
              />
            </div>

            {/* Price Slider */}
            <div className="form-control mb-3">
              <label className="label">
                <span className="label-text">Price $</span>
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
              <div className="text-center text-gray-500 mt-2">{price} $</div>
            </div>

            {/* Button Section */}
            <div className="flex justify-between mt-4">
              {/* Back Button */}
              <button
                type="button"
                className="btn btn-outline btn-secondary input-bordered"
                onClick={() => router.back()}
              >
                ← Back to Article
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
