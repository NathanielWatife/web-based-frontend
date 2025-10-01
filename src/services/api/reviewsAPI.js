import api from './axiosConfig';

export const reviewsAPI = {
  getBookReviews: (bookId) => api.get(`/books/${bookId}/reviews/`),
  addReview: (bookId, reviewData) => api.post(`/books/${bookId}/reviews/`, reviewData),
  updateReview: (reviewId, reviewData) => api.patch(`/reviews/${reviewId}/`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}/`),
  markHelpful: (reviewId) => api.post(`/reviews/${reviewId}/helpful/`),
  getReviewStats: (bookId) => api.get(`/books/${bookId}/review-stats/`),
  getUserReviews: () => api.get('/user/reviews/'),
};