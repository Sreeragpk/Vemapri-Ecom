// import React, { createContext, useState, useContext, useEffect } from 'react';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCartItems(JSON.parse(savedCart));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (product, quantity = 1) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item.product._id === product._id);
      
//       if (existingItem) {
//         return prevItems.map(item =>
//           item.product._id === product._id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }
      
//       return [...prevItems, { product, quantity }];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item.product._id === productId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const getCartTotal = () => {
//     return cartItems.reduce((total, item) => {
//       const price = item.product.discountPrice || item.product.price;
//       return total + (price * item.quantity);
//     }, 0);
//   };

//   const getCartCount = () => {
//     return cartItems.reduce((count, item) => count + item.quantity, 0);
//   };

//   const value = {
//     cartItems,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartCount
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };
// src/context/CartContext.js
// src/context/CartContext.js
// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast'; // optional: used to show user-friendly toasts when items can't be added

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Helpers
 */
function safeNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toId(objOrId) {
  if (!objOrId && objOrId !== 0) return null;
  if (typeof objOrId === 'string' || typeof objOrId === 'number') return String(objOrId);
  return String(objOrId._id || objOrId.id || '');
}

/**
 * Returns a friendly product name for toasts/UI even if product is only an id.
 */
function productLabel(product) {
  if (!product) return 'Unknown product';
  if (typeof product === 'string' || typeof product === 'number') return String(product);
  return product.name || product.title || String(product._id || product.id || 'Unknown');
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount (tolerant)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
    } catch (err) {
      console.warn('Failed to read cart from localStorage, starting empty.', err);
      setCartItems([]);
    }
  }, []);

  // Persist cart to localStorage whenever it changes (tolerant of quota)
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      // QuotaExceededError or other storage issue - warn but keep app usable.
      console.warn('Failed to persist cart to localStorage.', err);
    }
  }, [cartItems]);

  // normalize quantity into integer >= 1
  const normalizeQuantity = (q) => {
    const n = Number(q) || 0;
    return Math.max(1, Math.floor(n));
  };

  // itemMatches: decides if a cart item matches productId + variantId semantics
  // - productId can be product object or id
  // - variantId null => match item entries that also have no variant (product-level)
  const itemMatches = (item, productId, variantId) => {
    if (!item || !item.product) return false;

    const pid = toId(item.product);
    const wantPid = toId(productId);
    if (String(pid) !== String(wantPid)) return false;

    // If variantId argument is null/undefined ⇒ caller intends product-level item
    if (variantId == null) {
      // treat both null and empty string as "no variant"
      return item.variantId == null || item.variantId === '';
    }

    return String(item.variantId) === String(variantId);
  };

  /**
   * addToCart(product, variantOrQuantity?, maybeQuantity?)
   *
   * Supported call patterns:
   *  - addToCart(product)
   *  - addToCart(product, 2)
   *  - addToCart(product, variant)
   *  - addToCart(product, variant, 3)
   *
   * product may be a full object or just an id string (we tolerate both).
   */
  const addToCart = (product, variantOrQuantity, maybeQuantity) => {
    if (!product) return;

    let variant = null;
    let quantity = 1;

    if (typeof variantOrQuantity === 'number' && (maybeQuantity === undefined || maybeQuantity === null)) {
      quantity = normalizeQuantity(variantOrQuantity);
    } else {
      variant = variantOrQuantity || null;
      quantity = maybeQuantity !== undefined && maybeQuantity !== null ? normalizeQuantity(maybeQuantity) : 1;
    }

    quantity = normalizeQuantity(quantity);

    const variantId = variant?._id ?? variant?.id ?? null;
    const productId = product._id ?? product.id ?? product;

    setCartItems((prevItems) => {
      // find existing item matching product + variant semantics
      const existingIndex = prevItems.findIndex((it) => itemMatches(it, productId, variantId));

      // Determine available stock (variant.stock > product.stock > undefined) using safeNumber
      const variantStock = variant ? safeNumber(variant.stock) : undefined;
      const prodStock = product ? safeNumber(product.stock) : undefined;
      const availableStock = variantStock != null ? variantStock : prodStock != null ? prodStock : undefined;

      if (existingIndex !== -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = (Number(existing.quantity) || 0) + quantity;

        // clamp if stock available
        const finalQty = availableStock != null ? Math.min(newQty, availableStock) : newQty;

        updated[existingIndex] = { ...existing, quantity: finalQty };
        // If we clamped to 0 (shouldn't happen because normalizeQuantity >=1) just remove item
        if (finalQty <= 0) {
          updated.splice(existingIndex, 1);
        }
        return updated;
      }

      // new entry
      const entryQty = availableStock != null ? Math.min(quantity, availableStock) : quantity;

      // If computed entryQty is 0 (availableStock == 0), do not add the item and notify user
      if (entryQty <= 0) {
        const label = productLabel(product);
        // show a gentle toast and console warning
        try {
          toast.error(`"${label}" is currently out of stock.`);
        } catch (e) {
          // toast may not be available in some contexts; still log
          console.warn(`Tried to toast out-of-stock for ${label}`, e);
        }
        console.warn(`addToCart: attempted to add out-of-stock product: ${label}`, { productId: toId(product), variantId });
        return prevItems;
      }

      return [
        ...prevItems,
        {
          product,
          // store variantId explicitly for easy matching; store variant object if provided
          variantId,
          variant: variant || null,
          quantity: entryQty,
        },
      ];
    });
  };

  /**
   * removeFromCart(productId, variantId?)
   * - If variantId provided -> remove only that variant entry
   * - If variantId not provided -> remove all entries for that product (all variants + product-level)
   */
  const removeFromCart = (productId, variantId = null) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        const pid = toId(item.product);
        if (String(pid) !== String(toId(productId))) {
          // unrelated product -> keep
          return true;
        }
        // same productId => decide whether to keep based on variantId argument
        if (variantId == null) {
          // no variantId provided: remove all items for this product
          return false;
        }
        // variantId provided: keep items that do not match variantId
        return String(item.variantId) !== String(variantId);
      })
    );
  };

  /**
   * updateQuantity(productId, quantity, variantId?)
   * - If quantity <= 0 -> remove item
   * - If product has stock information in the item/variant -> clamp to that stock
   */
  const updateQuantity = (productId, quantity, variantId = null) => {
    const q = normalizeQuantity(quantity);

    if (q <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          const pid = toId(item.product);
          if (String(pid) !== String(toId(productId))) return item;

          const sameVariant =
            variantId != null ? String(item.variantId) === String(variantId) : item.variantId == null || item.variantId === '';

          if (!sameVariant) return item;

          // determine available stock and clamp if present using safeNumber
          const itemVariantStock = item.variant ? safeNumber(item.variant.stock) : undefined;
          const itemProdStock = item.product ? safeNumber(item.product.stock) : undefined;
          const availableStock = itemVariantStock != null ? itemVariantStock : itemProdStock != null ? itemProdStock : undefined;

          const finalQty = availableStock != null ? Math.min(q, availableStock) : q;

          // if finalQty <= 0 remove
          return finalQty > 0 ? { ...item, quantity: finalQty } : null;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * getCartTotal: uses variant.discountPrice / variant.price fallback to product.discountPrice / product.price
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const variantPrice =
        item.variant &&
        (item.variant.discountPrice != null ? safeNumber(item.variant.discountPrice) : (item.variant.price != null ? safeNumber(item.variant.price) : undefined));

      const productPrice =
        item.product &&
        (item.product.discountPrice != null ? safeNumber(item.product.discountPrice) : (item.product.price != null ? safeNumber(item.product.price) : undefined));

      const price = variantPrice != null ? variantPrice : productPrice != null ? productPrice : 0;

      return total + price * (Number(item.quantity) || 0);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

