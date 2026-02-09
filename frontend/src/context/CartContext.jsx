/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useEffect, useState } from 'react';

export const CartContext = createContext();

const getInitialCart = () => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse cart from local storage", e);
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
  total: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload)
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i).filter(i => i.qty > 0)
      };
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    setIsDrawerOpen(true); // Auto-open drawer on add
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQty = (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
  };

  const total = state.items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{
      items: state.items || [],
      addItem,
      removeItem,
      updateQty,
      clearCart,
      total,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToCart: addItem // Alias for compatibility
    }}>
      {children}
    </CartContext.Provider>
  );
}
