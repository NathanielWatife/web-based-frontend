import React, { useEffect, useState } from 'react';
import { bookService } from '../../services/bookService';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';

const RecommendedBooks = ({ limit = 8, title = 'Recommended for you' }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await bookService.getRecommended({ limit });
        setBooks(Array.isArray(resp.data?.data) ? resp.data.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [limit]);

  if (loading) return <LoadingSpinner size="small" />;
  if (error) return <div className="error-message">{error}</div>;
  if (!books.length) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h2 className="section-title">{title}</h2>
      <div className="books-grid">
        {books.map(b => (
          <BookCard key={b._id} book={b} />)
        )}
      </div>
    </div>
  );
};

export default RecommendedBooks;
