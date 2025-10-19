import React from 'react';
import BookList from '../components/books/BookList';

const Books = () => {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Book Catalog</h1>
          <p>Browse our extensive collection of academic books and materials</p>
        </div>
      </div>
      <BookList />
    </div>
  );
};

export default Books;