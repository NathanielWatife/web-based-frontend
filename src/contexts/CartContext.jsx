import React, { createContext, useState, useContext, useEffect } from "react";
import { cartAPI } from '../services/api/cartAPI';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context;
}

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            // load the cart from localStorage for guest users
            const savedCart = localStorage.getItem('guestCart');
            if (savedCart){
                setCartItems(JSON.parse(savedCart));
            }
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await cartAPI.getCart();
            setCartItems(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (bookId, quantity = 1 ) => {
        try {
            if (isAuthenticated) {
                await cartAPI.addToCart({ book_id: bookId, quantity });
                await fetchCart(); // refresh cart
            } else {
                // for geust user, update local storage
                const updatedCart = [...cartItems];
                const existingItem = updateCart.find(item => item.book.id === bookId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    updatedCart.push({
                        book: { id: bookId }, // minimal book data
                        quantity: quantity
                    });
                }
                setCartItems(updatedCart);
                localStorage.setItem('questCart', JSON.stringify(updatedCart));
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add to cart'
            };
        }
    };

    const removeFromCart = async (bookId) => {
        try {
            if (isAuthenticated) {
                await cartAPI.removeFromCart(bookId);
                await fetchCart();
            } else {
                const updatedCart = cartItems.filter(item => item.b.id !== bookId);
                setCartItems(updatedCart);
                localStorage.setItem('questCart', JSON.stringify(updatedCart));
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed tp remove from cart'
            };
        }
    };

    const updateQuantity = async (bookId, quantity) => {
        if (quantity < 1 ) {
            return removeFromCart(bookId);
        }

        try {
            if (isAuthenticated) {
                await cartAPI.updateQuantity(bookId, quantity);
                await fetchCart();
            } else {
                const updatedCart = cartItems.map(item => item.book.id === bookId ? { ...item, quantity } : item);
                setCartItems(updatedCart);
                localStorage.setItem('questCart', JSON.stringify(updatedCart));
            }
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update the quantity'
            };
        }
    };

    const clearCart = async () => {
        try {
            if (isAuthenticated) {
                await cartAPI.clearCart();
            }
            setCartItems([]);
            localStorage.removeItem('guestCart');
            return {  success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to clear cart'
            };
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.book.price * item.quantity);
        }, 0);
    };

    const getCartItemsCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        loading,
        fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};