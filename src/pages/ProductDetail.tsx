import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    // Vibrate for 200ms if vibration is supported
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      material: product.material
    });
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="bg-white min-h-screen relative pb-[120px] md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] md:aspect-square relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Thumbnail Images - Hide on mobile */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square ${
                    selectedImage === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Mobile Image Indicators */}
            <div className="flex justify-center space-x-2 md:hidden">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full ${
                    selectedImage === index ? 'bg-black' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-light mb-2">{product.name}</h1>
              <p className="text-xl md:text-2xl">₹{product.price.toLocaleString()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Material</h3>
                <p className="text-gray-600">{product.material}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-200 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-200 hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex flex-col space-y-4 pt-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 text-sm tracking-wider hover:bg-black/90 transition-colors"
              >
                ADD TO CART
              </button>
              <button
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                className="w-full border border-black py-4 text-sm tracking-wider hover:bg-black/5 transition-colors flex items-center justify-center space-x-2"
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-black' : ''}`} />
                <span>{isInWishlist(product.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40">
        <div className="flex space-x-4">
          <button
            onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
            className="flex-1 border border-black py-3 flex items-center justify-center space-x-2"
          >
            <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-black' : ''}`} />
            <span className="text-sm tracking-wider">WISHLIST</span>
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-3 text-sm tracking-wider hover:bg-black/90 transition-colors"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}