import React from 'react';
import './Pagination.css';

const Pagination = ({ current, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }
    
    // Middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== current) {
      onPageChange(page);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        className={`pagination-btn prev ${current === 1 ? 'disabled' : ''}`}
        onClick={() => handlePageChange(current - 1)}
        disabled={current === 1}
        title="Previous page"
      >
        ← Previous
      </button>

      {/* Page Numbers */}
      <div className="page-numbers">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }
          
          return (
            <button
              key={page}
              className={`pagination-btn page ${page === current ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
              title={`Go to page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        className={`pagination-btn next ${current === totalPages ? 'disabled' : ''}`}
        onClick={() => handlePageChange(current + 1)}
        disabled={current === totalPages}
        title="Next page"
      >
        Next →
      </button>

      {/* Page Info */}
      <div className="page-info">
        Page {current} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;