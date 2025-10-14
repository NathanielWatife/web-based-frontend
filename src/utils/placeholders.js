export const getPlaceholderImage = (width = 400, height = 300, text = 'Book Cover') => {
  return `https://via.placeholder.com/${width}x${height}.png/1976d2/ffffff?text=${encodeURIComponent(text)}`;
};

export const getBookCoverPlaceholder = (title = 'Book Cover') => {
  return `https://via.placeholder.com/200x300.png/1976d2/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`;
};

export const getHeroImage = () => {
  return `https://via.placeholder.com/1200x600.png/1976d2/ffffff?text=YabaTech+Bookstore`;
};