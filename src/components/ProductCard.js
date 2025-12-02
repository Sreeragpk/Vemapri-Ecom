import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent Link navigation when clicking button

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product);
    toast.success('Added to cart!');
  };

  const displayPrice = product.discountPrice || product.price;
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const hasRatings = product.ratings?.average && product.ratings?.count > 0;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
    : null;

  return (
    <Link to={`/products/${product._id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-lg">
        {/* Image */}
        <div className="relative bg-emerald-50/60">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {product.images && product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isOutOfStock ? 'opacity-60' : ''
                }`}
              />
            )}
          </div>

          {/* Top badges */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {product.category && (
              <span className="inline-flex items-center rounded-full bg-emerald-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-50 shadow-sm backdrop-blur">
                {product.category}
              </span>
            )}

            {product.isOrganic && (
              <span className="inline-flex items-center rounded-full bg-emerald-50/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100 backdrop-blur">
                100% Organic
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            {hasDiscount && !isOutOfStock && (
              <div className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                {discountPercent}% OFF
              </div>
            )}

            {product.isBestSeller && !isOutOfStock && (
              <div className="rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Best Seller
              </div>
            )}

            {isLowStock && !isOutOfStock && (
              <div className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                Only {product.stock} left
              </div>
            )}

            {isOutOfStock && (
              <div className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                Sold Out
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Name */}
          <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900">
            {product.name}
          </h3>

          {/* Meta (brand / weight) */}
          {(product.brand || product.weight || product.unit) && (
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
              {product.brand && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5">
                  {product.brand}
                </span>
              )}
              {(product.weight || product.unit) && (
                <span className="rounded-full bg-slate-50 px-2 py-0.5">
                  {product.weight} {product.unit}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="mb-3 line-clamp-2 text-xs text-slate-600">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="mb-3 flex items-center">
            {hasRatings ? (
              <>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(product.ratings.average)
                          ? 'text-amber-400 fill-current'
                          : 'text-slate-200'
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-[11px] text-slate-500">
                  {product.ratings.average.toFixed(1)} ·{' '}
                  {product.ratings.count} review
                  {product.ratings.count > 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <span className="text-[11px] text-slate-400">
                No ratings yet
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="mb-3">
            {isOutOfStock ? (
              <p className="text-[12px] font-semibold text-red-600">
                Out of stock
              </p>
            ) : isLowStock ? (
              <p className="text-[12px] font-semibold text-orange-600">
                Only {product.stock} items left – order soon!
              </p>
            ) : (
              <p className="text-[12px] font-semibold text-emerald-600">
                In stock · {product.stock} available
              </p>
            )}
          </div>

          {/* Price row */}
          <div className="mb-4 flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-emerald-700">
                ₹{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-xs text-slate-400 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}

              {(product.weight || product.unit) && (
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {product.weight && product.unit
                    ? `₹${(displayPrice / product.weight).toFixed(2)} / ${
                        product.unit
                      }`
                    : null}
                </div>
              )}
            </div>

            {hasDiscount && (
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                You save ₹
                {(product.price - product.discountPrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              isOutOfStock
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-sm hover:shadow-md hover:from-emerald-700 hover:via-emerald-600 hover:to-lime-500'
            }`}
          >
            <ShoppingCart size={18} className="mr-2" />
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
