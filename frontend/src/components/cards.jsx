import React from 'react';
import { Card, Badge, Button } from './ui.jsx';
import { MapPin, Phone, Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

// Stat Card
export const StatCard = ({ icon: Icon, label, value, trend, color = 'indigo' }) => {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between p-6">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={16} className={trend > 0 ? 'text-green-600' : 'text-red-600'} />
              <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`bg-gradient-to-br ${colors[color]} w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg`}>
            <Icon size={32} />
          </div>
        )}
      </div>
    </Card>
  );
};

// Notice Card
export const NoticeCard = ({ title, description, author, date, priority = 'normal', onRead }) => {
  return (
    <Card className="p-5 cursor-pointer hover:border-indigo-300" onClick={onRead}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={priority === 'high' ? 'error' : 'primary'} size="sm">
              {priority.toUpperCase()}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>By {author}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Card>
  );
};

// Member Card
export const MemberCard = ({ name, flatNo, contact, role, photo, onSelect }) => {
  return (
    <Card className="p-4 cursor-pointer hover:border-indigo-300" onClick={onSelect}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600 mb-1">Flat {flatNo}</p>
          <p className="text-sm text-indigo-600 flex items-center gap-1">
            <Phone size={14} />
            {contact}
          </p>
        </div>
        {role && <Badge variant="primary" size="sm">{role}</Badge>}
      </div>
    </Card>
  );
};

// Bill Card
export const BillCard = ({ billId, amount, dueDate, status, description, onPayNow }) => {
  const statusConfig = {
    paid: { variant: 'success', label: '✓ Paid' },
    pending: { variant: 'warning', label: '⏳ Pending' },
    overdue: { variant: 'error', label: '⚠ Overdue' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const isOverdue = new Date(dueDate) < new Date() && status !== 'paid';

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{description}</h3>
            <Badge variant={config.variant} size="sm">{config.label}</Badge>
          </div>
          <p className="text-sm text-gray-600">Bill ID: {billId}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">₹{amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Due: {new Date(dueDate).toLocaleDateString()}</p>
        </div>
      </div>
      {isOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2 mb-4">
          <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">This bill is overdue. Please pay immediately.</p>
        </div>
      )}
      {status !== 'paid' && (
        <Button size="sm" onClick={onPayNow} className="w-full">
          💳 Pay Now
        </Button>
      )}
    </Card>
  );
};

// Amenity Card
export const AmenityCard = ({ name, image, available, onBooking }) => {
  return (
    <Card className="overflow-hidden cursor-pointer hover:border-indigo-300 hover:shadow-lg" onClick={onBooking}>
      <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 relative overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
        {!available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Not Available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
        <Button
          size="sm"
          variant={available ? 'primary' : 'secondary'}
          className="w-full"
          disabled={!available}
        >
          {available ? '📅 Book Now' : 'Not Available'}
        </Button>
      </div>
    </Card>
  );
};

// Contact Card
export const ContactCard = ({ name, category, phone, availability, role, onCall }) => {
  const categoryIcons = {
    milkman: '🥛',
    laundry: '👕',
    electrician: '⚡',
    plumber: '🔧',
    security: '🛡️',
    management: '👔',
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-3xl">{categoryIcons[category] || '👤'}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600 capitalize mb-1">{category}</p>
            <p className="text-sm text-indigo-600 font-medium mb-2">{phone}</p>
            {availability && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <Clock size={14} />
                {availability}
              </div>
            )}
          </div>
        </div>
        <Button
          size="icon"
          onClick={onCall}
          className="bg-green-600 hover:bg-green-700 flex-shrink-0"
        >
          <Phone size={20} />
        </Button>
      </div>
    </Card>
  );
};

// Booking Card
export const BookingCard = ({ amenity, date, timeSlot, status, onCancel }) => {
  const statusConfig = {
    confirmed: { color: 'bg-green-50 border-green-200 text-green-900' },
    pending: { color: 'bg-yellow-50 border-yellow-200 text-yellow-900' },
    cancelled: { color: 'bg-red-50 border-red-200 text-red-900' },
  };

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{amenity}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Calendar size={16} />
            {new Date(date).toLocaleDateString()} • {timeSlot}
          </div>
        </div>
        <Badge variant={status === 'confirmed' ? 'success' : status === 'pending' ? 'warning' : 'error'}>
          {status.toUpperCase()}
        </Badge>
      </div>
      {status !== 'cancelled' && (
        <Button size="sm" variant="outline" onClick={onCancel} className="w-full">
          ✕ Cancel Booking
        </Button>
      )}
    </Card>
  );
};

// Welcome Card
export const WelcomeCard = ({ userName, flatNo, role }) => {
  return (
    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-indigo-100 mb-2">Welcome back</p>
          <h1 className="text-4xl font-bold mb-2">{userName}</h1>
          <p className="text-indigo-100 flex items-center gap-2">
            <MapPin size={18} />
            Flat {flatNo} • {role.toUpperCase()}
          </p>
        </div>
        <div className="text-6xl opacity-20">🏢</div>
      </div>
    </Card>
  );
};

// Quick Action Card
export const QuickActionCard = ({ icon: Icon, label, value, color = 'indigo', onClick }) => {
  const colors = {
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600',
    green: 'from-green-50 to-green-100 border-green-200 text-green-600',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colors[color]} cursor-pointer p-5 text-center border`}
      onClick={onClick}
    >
      <Icon size={28} className="mx-auto mb-3" />
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
};
