export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const generateMatricNo = (faculty, programme, admissionYear, studentNumber) => {
  const facultyCode = faculty.charAt(0).toUpperCase();
  const programmeCode = programme === 'National Diploma' ? 'ND' : 'HND';
  const yearCode = admissionYear.slice(-2);
  return `${facultyCode}/${programmeCode}/${yearCode}/${studentNumber}`;
};

export const validateMatricNo = (matricNo) => {
  const pattern = /^[A-Z]\/[A-Z]{2}\/\d{2}\/\d+$/;
  return pattern.test(matricNo);
};