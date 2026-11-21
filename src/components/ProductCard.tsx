"use client";

import Link from 'next/link';
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import HoverImageCarousel from './HoverImageCarousel';

interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  basePrice?: number;
  salePrice?: number;
  imageUrl: string;
  images?: string[];
  categorySlug: string;
  isCustomizable?: boolean;
  style?: string | null;
  neckStyle?: string | null;
  keyWords?: string | null;
  avgRating?: number | string | null;
  numReviews?: number | string | null;
  totalStock?: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const basePrice = product.basePrice ?? product.price ?? 0;
  const salePrice = product.salePrice ?? product.price ?? 0;
  
  // Active price to display
  const activePrice = salePrice > 0 && salePrice < basePrice ? salePrice : basePrice;
  const originalPrice = basePrice;
  
  // Calculate discount percentage automatically
  const discount = originalPrice > 0 && activePrice < originalPrice
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100)
    : 0;

  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  // Find if this product is already in the cart
  const matchedCartItem = cartItems.find((item) => item.productId === Number(product.id));
  const quantityInCart = matchedCartItem ? matchedCartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `prod_${product.id}_Standard`,
      productId: Number(product.id),
      name: product.name,
      price: activePrice,
      image: product.imageUrl || "/images/placeholder.png",
      quantity: 1,
      size: "Standard",
      color: "default",
      customizations: null,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (matchedCartItem) {
      updateQuantity(matchedCartItem.id, 1);
    } else {
      handleAdd(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (matchedCartItem) {
      if (matchedCartItem.quantity <= 1) {
        removeItem(matchedCartItem.id);
      } else {
        updateQuantity(matchedCartItem.id, -1);
      }
    }
  };

  const isSoldOut = product.totalStock !== undefined && product.totalStock <= 0;

  return (
    <Link 
      href={`/product/${product.id}`} 
      className="group flex flex-col w-full bg-white rounded-2xl p-2 sm:p-2.5 border border-[#3B82C4]/15 shadow-xs hover:shadow-md hover:border-[#3B82C4]/40 transition-all duration-300 overflow-hidden"
    >
      {/* Top Image Section */}
      <div className="relative w-full aspect-square overflow-hidden bg-brand-light/50 rounded-xl border border-black/5">
        <HoverImageCarousel 
          images={product.images || []}
          defaultImage={product.imageUrl || "/images/placeholder.png"}
          alt={product.name}
          className="transform group-hover:scale-105 transition-transform duration-700" 
        />

        {/* Right Badge (Sold out takes priority) */}
        {isSoldOut ? (
          <div className="absolute top-2.5 right-2.5 z-30 bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
            Sold out
          </div>
        ) : (
          discount > 0 && (
            <div className="absolute top-2.5 right-2.5 z-30 bg-[#E5A93C] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
              -{discount}% OFF
            </div>
          )
        )}
      </div>
      
      {/* Bottom Content Section */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col flex-1 items-start w-full">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-[#1E242B] group-hover:text-[#3B82C4] transition-colors text-left line-clamp-2 mb-1 w-full leading-snug">
          {product.name}
        </h3>
        
        {/* Pricing Block */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xs sm:text-sm font-bold text-[#1E242B]">
            ₹{activePrice.toFixed(0)}
          </span>
          {discount > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              ₹{originalPrice.toFixed(0)}
            </span>
          )}
        </div>

        {/* Instant Add-to-Cart & Quantity Controller on Card */}
        <div className="w-full mt-2.5">
          {quantityInCart > 0 ? (
            <div 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-full flex items-center justify-between bg-[#3B82C4] text-white rounded-xl p-1 shadow-xs"
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-xs font-mono px-2">
                {quantityInCart} added
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSoldOut}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#3B82C4] text-[#3B82C4] hover:text-white border border-[#3B82C4]/35 hover:border-[#3B82C4] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group/btn"
            >
              <Plus size={13} className="group-hover/btn:rotate-90 transition-transform" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
