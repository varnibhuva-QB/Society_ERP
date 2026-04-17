import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../components/ui.jsx';
import {
  StatCard,
  NoticeCard,
  WelcomeCard,
  QuickActionCard,
  BookingCard,
} from '../components/cards.jsx';
import {
  Users,
  FileText,
  DollarSign,
  Calendar,
  Bell,
  ArrowRight,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

export const Dashboard = () => {
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Dummy data
  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: '148',
      trend: 5,
      color: 'indigo',
    },
    {
      icon: DollarSign,
      label: 'Pending Payments',
      value: '₹45,230',
      trend: -3,
      color: 'orange',
    },
    {
      icon: Calendar,
      label: 'Active Bookings',
      value: '12',
      trend: 8,
      color: 'green',
    },
    {
      icon: FileText,
      label: 'Active Notices',
      value: '5',
      trend: 2,
      color: 'blue',
    },
  ];

  const notices = [
    {
      id: 1,
      title: 'Water Tank Maintenance on 15th April',
      description: 'Scheduled maintenance of main water tank. Water supply will be interrupted.',
      author: 'Admin',
      date: '2 days ago',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Community Event - Annual Sports Day',
      description: 'Join us for the annual sports day. Register by 20th April.',
      author: 'Management',
      date: '5 days ago',
      priority: 'normal',
    },
    {
      id: 3,
      title: 'Maintenance Bill Payment Due',
      description: 'Monthly maintenance bill payment is due by 30th April.',
      author: 'Finance',
      date: '1 week ago',
      priority: 'normal',
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      amenity: 'Community Hall',
      date: '2024-04-20',
      timeSlot: '6:00 PM - 9:00 PM',
      status: 'confirmed',
    },
    {
      id: 2,
      amenity: 'Badminton Court',
      date: '2024-04-18',
      timeSlot: '5:00 PM - 6:00 PM',
      status: 'pending',
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: 'Pay Bill',
      value: '₹3,500',
      color: 'orange',
    },
    {
      icon: Calendar,
      label: 'Book Amenity',
      value: 'Available',
      color: 'green',
    },
    {
      icon: Users,
      label: 'Members',
      value: '148',
      color: 'indigo',
    },
    {
      icon: Bell,
      label: 'Notices',
      value: '5 New',
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <WelcomeCard userName="Raj Kumar" flatNo="A-301" role="Member" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <QuickActionCard key={idx} {...action} />
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notices */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Latest Notices</h2>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
              View All <ArrowRight size={16} />
            </a>
          </div>

          <div className="space-y-3">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                {...notice}
                onRead={() => {
                  setSelectedNotice(notice);
                  setShowNoticeModal(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  {...booking}
                  onCancel={() => alert(`Cancelled booking for ${booking.amenity}`)}
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600">No upcoming bookings</p>
              </Card>
            )}
            <Button className="w-full" variant="primary">
              📅 Book Now
            </Button>
          </div>
        </div>
      </div>

      {/* Notice Modal */}
      <Modal
        open={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        title={selectedNotice?.title}
        size="lg"
      >
        {selectedNotice && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={selectedNotice.priority === 'high' ? 'error' : 'primary'}>
                {selectedNotice.priority.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">Posted {selectedNotice.date}</span>
            </div>
            <p className="text-gray-700">{selectedNotice.description}</p>
            <p className="text-sm text-gray-600">By {selectedNotice.author}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
