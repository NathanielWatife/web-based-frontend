import api from './axiosConfig';

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist/'),
  addToWishlist: (item) => api.post('/wishlist/items/', item),
  removeFromWishlist: (bookId) => api.delete(`/wishlist/items/${bookId}/`),
  clearWishlist: () => api.delete('/wishlist/clear/'),
  moveToCart: (bookId) => api.post(`/wishlist/items/${bookId}/move-to-cart/`),
};