// Theme and design system configuration
export const theme = {
  colors: {
    primary: '#4F46E5', // Indigo
    primaryLight: '#EEF2FF',
    primaryDark: '#312E81',
    secondary: '#22C55E', // Green
    secondaryLight: '#F0FDF4',
    secondaryDark: '#15803D',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Typography system
export const typography = {
  h1: 'text-4xl font-bold tracking-tight text-gray-900',
  h2: 'text-3xl font-bold tracking-tight text-gray-900',
  h3: 'text-2xl font-bold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-semibold text-gray-900',
  h6: 'text-base font-semibold text-gray-900',
  body: 'text-base text-gray-700',
  small: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
};

// Common Tailwind class combinations
export const commonStyles = {
  card: 'bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100',
  cardInteractive: 'bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer hover:border-indigo-200',
  button: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
  input: 'w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all',
  badge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
};
