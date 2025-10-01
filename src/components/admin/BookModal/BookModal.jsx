import React, { useState, useEffect } from 'react';
import './BookModal.css';

const BookModal = ({ book, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    stock_quantity: '',
    category: '',
    description: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    edition: '1st',
    cover_image: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        price: book.price || '',
        stock_quantity: book.stock_quantity || '',
        category: book.category?.id || '',
        description: book.description || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || new Date().getFullYear(),
        edition: book.edition || '1st',
        cover_image: book.cover_image || ''
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock_quantity || formData.stock_quantity < 0) newErrors.stock_quantity = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.publisher.trim()) newErrors.publisher = 'Publisher is required';
    if (!formData.publication_year) newErrors.publication_year = 'Publication year is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: categories.find(cat => cat.id.toString() === formData.category)
      };
      onSave(bookData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Book Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="Enter book title"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? 'error' : ''}
                placeholder="Enter author name"
              />
              {errors.author && <span className="error-text">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="isbn">ISBN *</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className={errors.isbn ? 'error' : ''}
                placeholder="Enter ISBN"
              />
              {errors.isbn && <span className="error-text">{errors.isbn}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₦) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock_quantity">Stock Quantity *</label>
              <input
                type="number"
                id="stock_quantity"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className={errors.stock_quantity ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.stock_quantity && <span className="error-text">{errors.stock_quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="publisher">Publisher *</label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className={errors.publisher ? 'error' : ''}
                placeholder="Enter publisher name"
              />
              {errors.publisher && <span className="error-text">{errors.publisher}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="publication_year">Publication Year *</label>
              <select
                id="publication_year"
                name="publication_year"
                value={formData.publication_year}
                onChange={handleChange}
                className={errors.publication_year ? 'error' : ''}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.publication_year && <span className="error-text">{errors.publication_year}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="edition">Edition</label>
              <select
                id="edition"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
              >
                <option value="1st">1st Edition</option>
                <option value="2nd">2nd Edition</option>
                <option value="3rd">3rd Edition</option>
                <option value="4th">4th Edition</option>
                <option value="5th">5th Edition</option>
                <option value="6th+">6th+ Edition</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="cover_image">Cover Image URL</label>
              <input
                type="url"
                id="cover_image"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter book description..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {book ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;