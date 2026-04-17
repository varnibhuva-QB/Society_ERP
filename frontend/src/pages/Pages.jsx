import React, { useState } from 'react';
import { Input, Button, Badge, Card, Tabs, Modal, EmptyState } from '../components/ui.jsx';
import { MemberCard, BillCard, AmenityCard, ContactCard } from '../components/cards.jsx';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Phone,
  Users as UsersIcon,
  CreditCard,
  Calendar,
  Clock,
  X,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';

// ============= MEMBERS PAGE =============
export const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid'); // grid or list

  const members = [
    { id: 1, name: 'Raj Kumar', flatNo: 'A-301', contact: '+91-9876543210', role: 'Member', photo: '👨' },
    { id: 2, name: 'Priya Singh', flatNo: 'B-405', contact: '+91-9876543211', role: 'Admin', photo: '👩' },
    { id: 3, name: 'Amit Patel', flatNo: 'C-201', contact: '+91-9876543212', role: 'Member', photo: '👨' },
    { id: 4, name: 'Neha Sharma', flatNo: 'A-102', contact: '+91-9876543213', role: 'Chairman', photo: '👩' },
    { id: 5, name: 'Vikram Reddy', flatNo: 'D-501', contact: '+91-9876543214', role: 'Member', photo: '👨' },
    { id: 6, name: 'Ananya Desai', flatNo: 'B-202', contact: '+91-9876543215', role: 'Member', photo: '👩' },
  ];

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.flatNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 text-sm">Manage society members</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Member
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          icon={Search}
          placeholder="Search by name or flat number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline" className="gap-2">
          <Filter size={18} />
          Filter
        </Button>
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2 rounded transition-all ${
              view === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
          >
            ⊞ Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 rounded transition-all ${
              view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'
            }`}
          >
            ≡ List
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              {...member}
              onSelect={() => alert(`Opened ${member.name}`)}
            />
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState icon={UsersIcon} title="No members found" description="Try adjusting your search" />
          </div>
        )}
      </div>
    </div>
  );
};

// ============= NOTICES PAGE =============
export const NoticesPage = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const notices = [
    {
      id: 1,
      title: 'Water Tank Maintenance on 15th April',
      description: 'Scheduled maintenance of main water tank. Water supply will be interrupted from 9 AM to 5 PM.',
      author: 'Admin',
      date: '2024-04-12',
      priority: 'high',
      views: 234,
    },
    {
      id: 2,
      title: 'Community Event - Annual Sports Day',
      description: 'Join us for the annual sports day. Register by 20th April.',
      author: 'Management',
      date: '2024-04-10',
      priority: 'normal',
      views: 156,
    },
    {
      id: 3,
      title: 'Maintenance Bill Payment Due',
      description: 'Monthly maintenance bill payment is due by 30th April.',
      author: 'Finance',
      date: '2024-04-08',
      priority: 'normal',
      views: 89,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-600 text-sm">Society updates and announcements</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus size={18} />
          Post Notice
        </Button>
      </div>

      {/* Notices List */}
      <div className="space-y-3">
        {notices.map((notice) => (
          <Card
            key={notice.id}
            className="p-6 cursor-pointer hover:border-indigo-300 transition-colors"
            onClick={() => setSelectedNotice(notice)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={notice.priority === 'high' ? 'error' : 'primary'}>
                    {notice.priority.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">{notice.views} views</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{notice.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>By {notice.author}</span>
                  <span>•</span>
                  <span>{new Date(notice.date).toLocaleDateString()}</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card>
        ))}
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <Modal
          open={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          title={selectedNotice.title}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={selectedNotice.priority === 'high' ? 'error' : 'primary'}>
                {selectedNotice.priority.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">{selectedNotice.views} views</span>
            </div>
            <div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{selectedNotice.description}</p>
              <p className="text-sm text-gray-600">
                Posted by {selectedNotice.author} on {new Date(selectedNotice.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============= BILLING PAGE =============
export const BillingPage = () => {
  const bills = [
    {
      billId: 'BILL-2024-001',
      amount: 3500,
      dueDate: '2024-04-30',
      status: 'overdue',
      description: 'April Maintenance',
    },
    {
      billId: 'BILL-2024-002',
      amount: 2500,
      dueDate: '2024-05-15',
      status: 'pending',
      description: 'Water & Electricity',
    },
    {
      billId: 'BILL-2024-003',
      amount: 1500,
      dueDate: '2024-03-31',
      status: 'paid',
      description: 'March Maintenance',
    },
    {
      billId: 'BILL-2024-004',
      amount: 2000,
      dueDate: '2024-04-15',
      status: 'pending',
      description: 'Amenity Charges',
    },
  ];

  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBills = filterStatus === 'all' ? bills : bills.filter((b) => b.status === filterStatus);

  const stats = {
    pending: bills.filter((b) => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0),
    paid: bills.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0),
    overdue: bills.filter((b) => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Maintenance Billing</h1>
        <p className="text-gray-600 text-sm">View and manage your bills</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Amount</p>
          <p className="text-2xl font-bold text-orange-600">₹{stats.pending.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Paid This Year</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.paid.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Overdue Amount</p>
          <p className="text-2xl font-bold text-red-600">₹{stats.overdue.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'paid', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {filteredBills.map((bill) => (
          <BillCard
            key={bill.billId}
            {...bill}
            onPayNow={() => alert(`Opening payment for ${bill.billId}`)}
          />
        ))}
      </div>
    </div>
  );
};

// ============= BOOKINGS PAGE =============
export const BookingsPage = () => {
  const [selectedDate, setSelectedDate] = useState('2024-04-20');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const amenities = [
    {
      id: 1,
      name: 'Community Hall',
      image: '🏛️',
      available: true,
      slots: ['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'],
    },
    {
      id: 2,
      name: 'Badminton Court',
      image: '🏸',
      available: true,
      slots: ['5:00 PM - 6:00 PM', '6:00 PM - 7:00 PM'],
    },
    {
      id: 3,
      name: 'Swimming Pool',
      image: '🏊',
      available: false,
      slots: [],
    },
    {
      id: 4,
      name: 'Gym',
      image: '💪',
      available: true,
      slots: ['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '5:00 PM - 6:00 PM'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Amenity Booking</h1>
        <p className="text-gray-600 text-sm">Book society amenities</p>
      </div>

      {/* Date Picker */}
      <Card className="p-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </Card>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            {...amenity}
            onBooking={() => setShowBookingModal(true)}
          />
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="📅 Book Amenity"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Select Time Slot</label>
            <div className="space-y-2">
              {['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM', '8:00 PM - 9:00 PM'].map((slot) => (
                <label key={slot} className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50">
                  <input type="radio" name="slot" value={slot} />
                  <span className="flex-1">{slot}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBookingModal(false)}>Confirm Booking</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ============= CONTACTS PAGE =============
export const ContactsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const contacts = [
    {
      id: 1,
      name: 'Milkman',
      category: 'milkman',
      phone: '+91-9876543210',
      availability: '6:00 AM - 8:00 AM',
    },
    {
      id: 2,
      name: 'Fresh Laundry Service',
      category: 'laundry',
      phone: '+91-9876543211',
      availability: '7:00 AM - 6:00 PM',
    },
    {
      id: 3,
      name: 'Rajesh Electrician',
      category: 'electrician',
      phone: '+91-9876543212',
      availability: '8:00 AM - 8:00 PM',
    },
    {
      id: 4,
      name: 'Plumbing Services',
      category: 'plumber',
      phone: '+91-9876543213',
      availability: '7:00 AM - 9:00 PM',
    },
    {
      id: 5,
      name: 'Security Guard',
      category: 'security',
      phone: '+91-9876543214',
      availability: '24/7',
    },
    {
      id: 6,
      name: 'Management Office',
      category: 'management',
      phone: '+91-9876543215',
      availability: '9:00 AM - 6:00 PM',
    },
  ];

  const categories = ['all', 'milkman', 'laundry', 'electrician', 'plumber', 'security', 'management'];
  const filteredContacts = selectedCategory === 'all' ? contacts : contacts.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Important Contacts</h1>
          <p className="text-gray-600 text-sm">Quick access to essential services</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Contact
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              {...contact}
              onCall={() => alert(`Calling ${contact.phone}`)}
            />
          ))
        ) : (
          <EmptyState
            icon={Phone}
            title="No contacts found"
            description="Add contacts for quick access"
          />
        )}
      </div>
    </div>
  );
};
