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
    return api.post('/books', bookData);
  },

  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData);
  },

  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  }
};