export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const FACULTIES = [
  'School of Technology',
  'School of Business',
  'School of Arts',
  'School of Engineering',
  'School of Environmental Studies'
];

export const DEPARTMENTS = {
  'School of Technology': [
    'Computer Science',
    'Information Technology',
    'Software Engineering'
  ],
  'School of Business': [
    'Business Administration',
    'Accounting',
    'Marketing'
  ],
  'School of Arts': [
    'Mass Communication',
    'Fine Arts'
  ],
  'School of Engineering': [
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ],
  'School of Environmental Studies': [
    'Architecture',
    'Estate Management',
    'Urban Planning'
  ]
};

export const BOOK_CATEGORIES = [
  'Science & Technology',
  'Business & Economics',
  'Engineering',
  'Arts & Humanities',
  'Social Sciences',
  'Mathematics',
  'Computer Science',
  'Architecture',
  'Environmental Studies'
];

export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#3b82f6' },
  processing: { label: 'Processing', color: '#8b5cf6' },
  'ready-for-pickup': { label: 'Ready for Pickup', color: '#06b6d4' },
  completed: { label: 'Completed', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' }
};