import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug } from '../services/api';

interface Blog {
  title: string;
  content: string;
  image: {
    url: string;
  };
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBlog = async () => {
    if (!slug) return;
    
    setLoading(true);
    const { data, error } = await fetchBlogBySlug(slug);
    
    if (error) {
      setError(error);
    } else if (data) {
      setBlog(data);
      setError('');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="h-[500px] bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={loadBlog}
                className="bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-black/90 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/blog"
                className="inline-block bg-gray-100 text-gray-800 px-6 py-3 text-sm tracking-wider hover:bg-gray-200 transition-colors"
              >
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white py-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-4">
            {new Date(blog.createdAt).toLocaleDateString()} • {blog.category}
          </div>
          <h1 className="text-4xl font-light mb-6">{blog.title}</h1>
          <div className="flex items-center text-gray-600">
            <span>By {blog.author}</span>
          </div>
        </div>

        <div className="mb-12">
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-[500px] object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1584307833174-a3bbb76ab367?q=80&w=2070';
            }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-sm bg-gray-100 px-3 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}