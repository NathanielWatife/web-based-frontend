import React, { useState, useEffect, useRef } from 'react';
import { bookService } from '../../services/bookService';
import { BOOK_CATEGORIES } from '../../utils/constants';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import '../../styles/AdminManagement.css';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: '',
    category: '',
    courseCode: '',
    faculty: '',
    stockQuantity: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      const data = response.data?.data;
      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
    }
  };

  // Update preview when file or imageUrl changes
  useEffect(() => {
    let url;
    if (imageFile) {
      url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(formData.imageUrl || '');
    }
  }, [imageFile, formData.imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;
      if (imageFile) {
        // Build multipart form data when an image is selected
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) payload.append(key, value);
        });
        payload.append('image', imageFile);
      } else {
        // Fallback to JSON when no image file selected (uses imageUrl if provided)
        payload = { ...formData };
      }

      if (editingBook) {
        await bookService.updateBook(editingBook._id, payload);
      } else {
        await bookService.createBook(payload);
      }
      setShowForm(false);
      setEditingBook(null);
      setFormData({
        title: '', author: '', isbn: '', description: '', price: '',
        category: '', courseCode: '', faculty: '', stockQuantity: '', imageUrl: ''
      });
      setImageFile(null);
      loadBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description || '',
      price: book.price,
      category: book.category,
      courseCode: book.courseCode || '',
      faculty: book.faculty || '',
      stockQuantity: book.stockQuantity,
      imageUrl: book.imageUrl || ''
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        loadBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '', author: '', isbn: '', description: '', price: '',
      category: '', courseCode: '', faculty: '', stockQuantity: '', imageUrl: ''
    });
    setImageFile(null);
  };

  if (loading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="admin-management">
      <div className="management-header">
        <h2>Book Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Add New Book
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={resetForm} className="close-btn">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ISBN *</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {BOOK_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Faculty</label>
                  <input
                    type="text"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Image (preferred)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-input"
                  style={{ display: 'none' }}
                />
                <div
                  className={`dropzone ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDragOver}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                >
                  {previewUrl ? (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  ) : (
                    <div className="dropzone-instructions">
                      <span className="action-icon">📁</span>
                      <p>Drag & drop an image here, or click to select</p>
                      <small>PNG, JPG up to 5MB</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="management-table">
        <div className="table-header">
          <div>Book</div>
          <div>Author</div>
          <div>ISBN</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Category</div>
          <div>Actions</div>
        </div>

        {books.map(book => (
          <div key={book._id} className="table-row">
            <div className="book-info">
              <img 
                src={book.imageUrl || '/placeholder-book.jpg'} 
                alt={book.title}
                className="book-thumbnail"
              />
              <div className="book-details">
                <strong>{book.title}</strong>
                {book.courseCode && <small>{book.courseCode}</small>}
              </div>
            </div>
            <div>{book.author}</div>
            <div className="isbn">{book.isbn}</div>
            <div className="price">{formatCurrency(book.price)}</div>
            <div className={`stock ${book.stockQuantity === 0 ? 'out-of-stock' : ''}`}>
              {book.stockQuantity}
            </div>
            <div className="category">{book.category}</div>
            <div className="actions">
              <button 
                onClick={() => handleEdit(book)}
                className="btn btn-outline"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(book._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookManagement;