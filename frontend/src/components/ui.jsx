import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Button Component
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 gap-2';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-400',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-200',
    outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-3.5 text-lg',
    icon: 'p-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', interactive = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 ${
        interactive ? 'hover:shadow-lg hover:border-indigo-200 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default', size = 'md', ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Input Component
export const Input = React.forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg
            text-gray-900 placeholder-gray-400 outline-none
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
});

// Select Component
export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-900">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg
          text-gray-900 outline-none
          focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

// Modal Component
export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3 justify-end rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
};

// Toast Notification
export const Toast = ({ type = 'info', title, message, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-900 border-green-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border shadow-lg flex gap-3 items-start ${colors[type]} z-50 animate-in`}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
      </div>
      <button onClick={onClose} className="text-lg opacity-50 hover:opacity-100">&times;</button>
    </div>
  );
};

// Loading Skeleton
export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => {
  return <div className={`${width} ${height} bg-gray-200 rounded-lg animate-pulse ${className}`} />;
};

// Empty State
export const EmptyState = ({ icon: Icon, title, description, action, children }) => {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="text-gray-300">
            <Icon size={48} />
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>}
      {action && <div className="flex justify-center gap-3">{action}</div>}
      {children}
    </div>
  );
};

// Tabs Component
export const Tabs = ({ tabs, defaultTab = 0, onChange, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div>
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              px-4 py-3 font-medium border-b-2 transition-all duration-200
              ${activeTab === index
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs[activeTab]?.content}</div>
    </div>
  );
};

// Divider Component
export const Divider = ({ className = '' }) => (
  <div className={`h-px bg-gray-200 ${className}`} />
);

// Tag Component
export const Tag = ({ children, onRemove, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    primary: 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200',
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          ×
        </button>
      )}
    </span>
  );
};
