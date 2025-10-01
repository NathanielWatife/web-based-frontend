import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { booksAPI } from '../../services/api/booksAPI';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import BookCard from '../../components/books/BookCard/BookCard';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getBook(id);
      setBook(response.data);
      
      // Fetch related books
      if (response.data.category) {
        const relatedResponse = await booksAPI.getBooks({
          category: response.data.category.id,
          exclude: id,
          page_size: 4
        });
        setRelatedBooks(relatedResponse.data.results);
      }
    } catch (error) {
      setError('Book not found');
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/books/${id}` } });
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addToCart(book.id, quantity);
      
      if (result.success) {
        // Show success message (you can add a toast here later)
        alert('Book added to cart successfully!');
      } else {
        alert(result.message || 'Failed to add book to cart');
      }
    } catch (error) {
      alert('An error occurred while adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (book?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <LoadingSpinner text="Loading book details..." />
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>{error || 'Book not found'}</h2>
            <p>The book you're looking for doesn't exist or has been removed.</p>
            <Link to="/books" className="btn btn-primary">
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/books">Books</Link>
          <span>/</span>
          <span>{book.title}</span>
        </nav>

        {/* Book Details */}
        <div className="book-detail-content">
          <div className="book-image-section">
            <div className="book-image-large">
              {book.cover_image ? (
                <img src={book.cover_image} alt={book.title} />
              ) : (
                <div className="book-image-placeholder-large">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          <div className="book-info-section">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by {book.author}</p>
            
            <div className="book-price-section">
              <span className="book-price">{formatPrice(book.price)}</span>
              {book.stock_quantity > 0 ? (
                <span className="stock-available">In Stock ({book.stock_quantity} available)</span>
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            <div className="book-meta">
              {book.isbn && (
                <div className="meta-item">
                  <strong>ISBN:</strong> {book.isbn}
                </div>
              )}
              {book.category && (
                <div className="meta-item">
                  <strong>Category:</strong> {book.category.name}
                </div>
              )}
              {book.publisher && (
                <div className="meta-item">
                  <strong>Publisher:</strong> {book.publisher}
                </div>
              )}
              {book.publication_year && (
                <div className="meta-item">
                  <strong>Publication Year:</strong> {book.publication_year}
                </div>
              )}
              {book.edition && (
                <div className="meta-item">
                  <strong>Edition:</strong> {book.edition}
                </div>
              )}
            </div>

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            {/* Add to Cart Section */}
            {book.stock_quantity > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max={book.stock_quantity}
                      className="quantity-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= book.stock_quantity}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || quantity > book.stock_quantity}
                  className="btn btn-primary btn-large add-to-cart-btn"
                >
                  {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || quantity > book.stock_quantity}
                  className="btn btn-secondary btn-large buy-now-btn"
                >
                  Buy Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="related-books-section">
            <h2>Related Books</h2>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;