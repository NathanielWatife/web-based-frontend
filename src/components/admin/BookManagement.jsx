import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Image
} from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';
import { bookService } from '../../services/bookService';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [categories, setCategories] = useState([]);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    category: '',
    stockQuantity: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData.books || booksData);
      
      // Extract categories
      const uniqueCategories = [...new Set((booksData.books || booksData).map(book => book.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookForm({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        price: book.price,
        category: book.category,
        stockQuantity: book.stockQuantity,
        description: book.description || '',
        imageUrl: book.imageUrl || ''
      });
    } else {
      setEditingBook(null);
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        price: '',
        category: '',
        stockQuantity: '',
        description: '',
        imageUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBook(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');

      if (editingBook) {
        await bookService.updateBook(editingBook._id, bookForm);
      } else {
        await bookService.createBook(bookForm);
      }

      await fetchBooks();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(bookId);
        await fetchBooks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'error';
    if (quantity < 10) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Book Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add New Book
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {book.imageUrl ? (
                      <Box
                        component="img"
                        src={book.imageUrl}
                        alt={book.title}
                        sx={{ width: 40, height: 50, objectFit: 'cover' }}
                      />
                    ) : (
                      <Image sx={{ width: 40, height: 50, color: 'text.secondary' }} />
                    )}
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {book.title}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>
                  <Chip label={book.category} size="small" />
                </TableCell>
                <TableCell align="right">
                  {formatPrice(book.price)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={book.stockQuantity}
                    color={getStockColor(book.stockQuantity)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(book)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(book._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Book Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={bookForm.title}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Author"
                  name="author"
                  value={bookForm.author}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ISBN"
                  name="isbn"
                  value={bookForm.isbn}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (₦)"
                  name="price"
                  type="number"
                  value={bookForm.price}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={bookForm.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stockQuantity"
                  type="number"
                  value={bookForm.stockQuantity}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={bookForm.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={bookForm.imageUrl}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="https://example.com/book-cover.jpg"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingBook ? 'Update Book' : 'Add Book'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BookManagement;