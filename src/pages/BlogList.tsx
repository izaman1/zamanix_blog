import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { API_URL } from '../config';

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: {
    url: string;
  };
  author: string;
  category: string;
  tags: string[];
  slug: string;
  createdAt: string;
}

export default function BlogList() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data.blogs);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch blogs');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-light">Blog</h1>
          {user && (
            <Link
              to="/admin/blog"
              className="bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-black/90 transition-colors"
            >
              CREATE POST
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog._id} className="group">
              <Link to={`/blog/${blog.slug}`}>
                <div className="overflow-hidden">
                  <img
                    src={blog.image.url}
                    alt={blog.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    {new Date(blog.createdAt).toLocaleDateString()} • {blog.category}
                  </div>
                  <h2 className="text-xl font-light mb-2 group-hover:text-gray-600 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">
                    {blog.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              {user && (
                <div className="mt-4">
                  <Link
                    to={`/admin/blog/edit/${blog._id}`}
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Edit Post
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}