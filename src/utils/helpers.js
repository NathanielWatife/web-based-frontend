export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const validateMatricNo = (matricNo) => {
  const matricRegex = /^[A-Z]{3}\/\d{4}\/\d{3}$/;
  return matricRegex.test(matricNo);
};