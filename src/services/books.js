import api from './api';

export const booksAPI = {
  getAllBooks: async (params = {}) => {
    const response = await api.get('/books/', { params });
    return response.data;
  },

  getBook: async (id) => {
    const response = await api.get(`/books/${id}/`);
    return response.data;
  },

  searchBooks: async (query, params = {}) => {
    const response = await api.get('/books/search/', {
      params: { search: query, ...params }
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/books/categories/');
    return response.data;
  },

  createBook: async (bookData) => {
    const response = await api.post('/books/', bookData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}/`, bookData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}/`);
    return response.data;
  }
};