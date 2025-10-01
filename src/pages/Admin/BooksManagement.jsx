import React, { useState, useEffect } from 'react';
import { booksAPI } from '../../services/api/booksAPI';
import LoadingSpinner from '../../components/common/LoadingSpinner/LoadingSpinner';
import BookModal from '../../components/admin/BookModal/BookModal';
import './BooksManagement.css';

const BooksManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockBooks = generateMockBooks();
      setBooks(mockBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const mockCategories = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Mathematics' },
        { id: 3, name: 'Engineering' },
        { id: 4, name: 'Business' },
        { id: 5, name: 'Science' },
        { id: 6, name: 'Literature' }
      ];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateMockBooks = () => {
    return [
      {
        id: 1,
        title: 'Introduction to Computer Science',
        author: 'John Smith',
        isbn: '978-0123456789',
        price: 7500,
        stock_quantity: 25,
        category: { id: 1, name: 'Computer Science' },
        description: 'Comprehensive introduction to computer science concepts.',
        cover_image: '',
        publisher: 'Tech Publishers',
        publication_year: 2023,
        edition: '1st'
      },
      {
        id: 2,
        title: 'Advanced Calculus',
        author: 'Dr. Jane Wilson',
        isbn: '978-0123456790',
        price: 8200,
        stock_quantity: 3,
        category: { id: 2, name: 'Mathematics' },
        description: 'Advanced calculus for engineering students.',
        cover_image: '',
        publisher: 'Math Press',
        publication_year: 2022,
        edition: '3rd'
      },
      // Add more mock books as needed
    ];
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        // Simulate API call
        setBooks(books.filter(book => book.id !== bookId));
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        // Update existing book
        setBooks(books.map(book => 
          book.id === editingBook.id ? { ...book, ...bookData } : book
        ));
      } else {
        // Add new book
        const newBook = {
          ...bookData,
          id: Math.max(...books.map(b => b.id)) + 1
        };
        setBooks([...books, newBook]);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = !selectedCategory || book.category.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (quantity <= 5) return { label: 'Low Stock', class: 'low-stock' };
    return { label: 'In Stock', class: 'in-stock' };
  };

  return (
    <div className="books-management">
      <div className="management-header">
        <div className="header-content">
          <h1>Book Management</h1>
          <p>Manage your book catalog and inventory</p>
        </div>
        <button className="btn btn-primary btn-large" onClick={handleAddBook}>
          + Add New Book
        </button>
      </div>

      {/* Filters and Search */}
      <div className="management-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="stats-summary">
          <span className="stat">Total: {books.length}</span>
          <span className="stat">Low Stock: {books.filter(b => b.stock_quantity <= 5).length}</span>
          <span className="stat">Out of Stock: {books.filter(b => b.stock_quantity === 0).length}</span>
        </div>
      </div>

      {/* Books Table */}
      {loading ? (
        <LoadingSpinner text="Loading books..." />
      ) : (
        <div className="books-table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th>Book Information</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>ISBN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => {
                const stockStatus = getStockStatus(book.stock_quantity);
                return (
                  <tr key={book.id}>
                    <td>
                      <div className="book-info">
                        <div className="book-image">
                          {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} />
                          ) : (
                            <div className="image-placeholder">📚</div>
                          )}
                        </div>
                        <div className="book-details">
                          <h4>{book.title}</h4>
                          <p className="book-author">by {book.author}</p>
                          <p className="book-meta">
                            {book.publisher} • {book.publication_year} • {book.edition}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{book.category.name}</span>
                    </td>
                    <td className="price-cell">
                      ₦{book.price.toLocaleString()}
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className={`stock-badge ${stockStatus.class}`}>
                          {stockStatus.label}
                        </span>
                        <span className="stock-quantity">({book.stock_quantity})</span>
                      </div>
                    </td>
                    <td className="isbn-cell">
                      {book.isbn}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action edit"
                          onClick={() => handleEditBook(book)}
                          title="Edit Book"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action delete"
                          onClick={() => handleDeleteBook(book.id)}
                          title="Delete Book"
                        >
                          🗑️
                        </button>
                        <button
                          className="btn-action view"
                          title="View Details"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredBooks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No books found</h3>
              <p>Try adjusting your search criteria or add a new book.</p>
              <button className="btn btn-primary" onClick={handleAddBook}>
                Add Your First Book
              </button>
            </div>
          )}
        </div>
      )}

      {/* Book Modal */}
      {showModal && (
        <BookModal
          book={editingBook}
          categories={categories}
          onSave={handleSaveBook}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BooksManagement;