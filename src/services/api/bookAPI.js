import api from './axiosConfig';

export const booksAPI = {
    getBooks: (params = {}) => api.get('/books/', { params }),
    getBook: (id) => api.get(`/books/${id}/`),
    searchBooks: (query, params = {}) => api.get('/books/search/', { params: { q: query, ...params } }),
    getCategories: () => api.get('/books/categories/'),
    getFeaturedBooks: () => api.get('/books/featured/'),
};