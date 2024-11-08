import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { Heart } from 'lucide-react';
import { products } from '../data/products';

export default function ProductList() {
  const { category } = useParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const categoryProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-3xl font-light text-white mb-12 tracking-wide uppercase">
        {category === 'all' ? 'All Collections' : category}
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {categoryProducts.map((product) => (
          <div key={product.id} className="relative group">
            <Link to={`/product/${product.id}`}>
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </Link>
            <button
              onClick={() =>
                isInWishlist(product.id)
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white transition-colors rounded-full z-10"
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist(product.id) ? 'fill-black' : ''
                }`}
              />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-lg font-light tracking-wide text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-white/70 mt-1">{product.material}</p>
                <p className="text-lg mt-2 font-light text-white">₹{product.price.toLocaleString()}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add padding at the bottom for mobile navigation */}
      <div className="h-20 md:hidden" />
    </div>
  );
}