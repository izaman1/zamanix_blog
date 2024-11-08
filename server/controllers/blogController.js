import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import Blog from '../models/Blog.js';

// Get all blog posts
export const getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments();

  res.json({
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Get single blog post
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  
  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  res.json(blog);
});

// Create blog post
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, author, category, tags } = req.body;

  let imageData = {};
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog_images'
    });
    imageData = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  const blog = await Blog.create({
    title,
    content,
    author,
    category,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
    image: imageData
  });

  res.status(201).json(blog);
});

// Update blog post
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  let imageData = blog.image;
  if (req.file) {
    // Delete old image from Cloudinary if exists
    if (blog.image.publicId) {
      await cloudinary.uploader.destroy(blog.image.publicId);
    }
    
    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog_images'
    });
    imageData = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      image: imageData,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : blog.tags
    },
    { new: true }
  );

  res.json(updatedBlog);
});

// Delete blog post
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  // Delete image from Cloudinary if exists
  if (blog.image.publicId) {
    await cloudinary.uploader.destroy(blog.image.publicId);
  }

  await blog.deleteOne();

  res.json({ message: 'Blog post deleted successfully' });
});