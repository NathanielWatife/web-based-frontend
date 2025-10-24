import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';
import '../styles/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await bookService.getBook(id);
        setBook(res.data?.data || res.data);
      } catch (err) {
        console.error('Failed to load book', err);
        setError('Book not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner size="large" />;
  if (error) return <div className="page-container"><p>{error}</p><p><Link to="/books">Back to catalog</Link></p></div>;
  if (!book) return null;

  return (
    <div className="book-details page-container">
      <div className="book-details-grid">
        <div className="book-image-large">
          <img src={book.imageUrl || book.image || '/placeholder-book.jpg'} alt={book.title} />
        </div>
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="book-meta">Category: {book.category} | ISBN: {book.isbn}</p>
          <p className="book-price">{formatCurrency(book.price)}</p>
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/books" className="btn btn-outline">Back to catalog</Link>
      </div>
    </div>
  );
};

export default BookDetails;
