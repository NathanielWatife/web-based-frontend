import api from './api';

export const bookService = {
  getAllBooks: (params = {}) => {
    return api.get('/books', { params });
  },

  getBook: (id) => {
    return api.get(`/books/${id}`);
  },

  getCategories: () => {
    return api.get('/books/categories');
  },

  getRecommended: (params = {}) => {
    return api.get('/books/recommended', { params });
  },

  // bookData can be JSON or FormData. Optional config is forwarded to axios (useful for onUploadProgress).
  createBook: (bookData, config = {}) => {
    const isForm = typeof FormData !== 'undefined' && bookData instanceof FormData;
    const finalConfig = { ...config };
    if (isForm) {
      finalConfig.headers = { ...(finalConfig.headers || {}), 'Content-Type': 'multipart/form-data' };
    }
    return api.post('/books', bookData, finalConfig);
  },

  updateBook: (id, bookData, config = {}) => {
    const isForm = typeof FormData !== 'undefined' && bookData instanceof FormData;
    const finalConfig = { ...config };
    if (isForm) {
      finalConfig.headers = { ...(finalConfig.headers || {}), 'Content-Type': 'multipart/form-data' };
    }
    return api.put(`/books/${id}`, bookData, finalConfig);
  },

  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};