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

  createBook: (bookData) => {
    const isForm = typeof FormData !== 'undefined' && bookData instanceof FormData;
    return api.post('/books', bookData, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  },

  updateBook: (id, bookData) => {
    const isForm = typeof FormData !== 'undefined' && bookData instanceof FormData;
    return api.put(`/books/${id}`, bookData, isForm ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
  },

  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};