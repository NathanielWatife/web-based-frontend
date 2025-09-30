import api from './axiosConfig';

export const cartAPI = {
    getCart: () => api.get('/cart/'),
    addToCart: (item) => api.post('/cart/items/', item),
    updateQuantity: (bookId, quantity) => api.patch(`/cart/items/${bookId}/`, { quantity }),
    removeFromCart: (bookId) => api.delete(`/cart/items/${bookId}/`),
    clearCart: () => api.delete('/cart/clear/'),
};