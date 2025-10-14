import api from './api';

export const bookService = {
  async getAllBooks(params = {}) {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async searchBooks(query) {
    const response = await api.get('/books', { params: { search: query } });
    return response.data;
  },

  async getBooksByCategory(category) {
    const response = await api.get('/books', { params: { category } });
    return response.data;
  },

  async createBook(bookData) {
    const response = await api.post('/admin/books', bookData);
    return response.data;
  },

  async updateBook(id, bookData) {
    const response = await api.put(`/admin/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id) {
    const response = await api.delete(`/admin/books/${id}`);
    return response.data;
  }
};