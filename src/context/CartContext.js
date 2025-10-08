import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('yabatech_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yabatech_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === book.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if(newQuantity > book.stock_quantity){
            toast.error(`Only ${book.stock_quantity} copies of "${book.title}" available`);
            return prevItems;
        }
        const updatedItems = prevItems.map(item =>
          item.id === book.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        toast.success(`Updated ${book.title} quantity in cart`);
        return updatedItems;
      } else {
        if (quantity > book.stock_quantity){
            toast.error(`Only ${book.stock_quantity} copies of "${book.title}" available`);
            return prevItems;
        }
        const newItem = {
          id: book.id,
          title: book.title,
          author: book.author,
          price: parseFloat(book.price),
          image: book.image,
          quantity,
          stock_quantity: book.stock_quantity
        };
        toast.success(`Added ${book.title} to cart`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === bookId);
      const updatedItems = prevItems.filter(item => item.id !== bookId);
      if (item) {
        toast.success(`Removed ${item.title} from cart`);
      }
      return updatedItems;
    });
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(bookId);
      return;
    }

    setCartItems(prevItems => {
        const item = prevItems.find(item => item.id === bookId);
        if (item && newQuantity > item.stock_quantity) {
            toast.error(`Only ${item.stock_quantity} copies available`);
            return prevItems;
        }
        
        return prevItems.map(item =>
          item.id === bookId
            ? { ...item, quantity: newQuantity }
            : item
        );
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};