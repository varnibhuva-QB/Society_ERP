import React, { useState } from 'react';
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  Toast,
  Skeleton,
  EmptyState,
  Tabs,
  Divider,
  Tag,
} from './components/ui';

import {
  StatCard,
  NoticeCard,
  MemberCard,
  BillCard,
  AmenityCard,
  ContactCard,
  BookingCard,
  WelcomeCard,
  QuickActionCard,
} from './components/cards';

import {
  Home,
  Settings,
  Users,
  Bell,
  DollarSign,
  Calendar,
  Phone,
  ArrowRight,
} from 'lucide-react';

/**
 * Component Showcase
 * Displays all UI components and their variations
 */
export const ComponentShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent mb-4">
            Premium UI Component Showcase
          </h1>
          <p className="text-gray-600 text-lg">
            Comprehensive library of reusable components for Society Management App
          </p>
        </div>

        {/* ====== BUTTONS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Buttons</h2>
          <Card className="p-8">
            <div className="space-y-6">
              {/* Primary Buttons */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Variant</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Small</Button>
                  <Button size="lg">Large</Button>
                  <Button disabled>Disabled</Button>
                  <Button loading>Loading...</Button>
                </div>
              </div>

              {/* All Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Secondary</h3>
                  <div className="flex gap-2">
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Outline</h3>
                  <div className="flex gap-2">
                    <Button variant="outline">Outline</Button>
                    <Button variant="outline" disabled>Disabled</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Success</h3>
                  <div className="flex gap-2">
                    <Button variant="success">Success</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Danger</h3>
                  <div className="flex gap-2">
                    <Button variant="danger">Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ====== CARDS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
                <p className="text-gray-600">
                  This is a basic card component with simple content.
                </p>
              </div>
            </Card>

            <Card interactive className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Card</h3>
              <p className="text-gray-600">
                Click to interact. This card has hover effects.
              </p>
            </Card>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="Total Members"
              value="148"
              trend={5}
              color="indigo"
            />
            <StatCard
              icon={DollarSign}
              label="Pending Payments"
              value="₹45,230"
              trend={-3}
              color="orange"
            />
            <StatCard
              icon={Calendar}
              label="Active Bookings"
              value="12"
              trend={8}
              color="green"
            />
            <StatCard
              icon={Bell}
              label="Active Notices"
              value="5"
              trend={2}
              color="blue"
            />
          </div>
        </section>

        {/* ====== BADGES ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Badges</h2>
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Status Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success">Paid</Badge>
                  <Badge variant="error">Unpaid</Badge>
                  <Badge variant="warning">Pending</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Role Badges</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Admin</Badge>
                  <Badge variant="primary">Chairman</Badge>
                  <Badge variant="primary">Member</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ====== INPUTS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Form Elements</h2>
          <Card className="p-8">
            <div className="max-w-md space-y-4">
              <Input label="Full Name" placeholder="Enter your name" />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Phone}
              />
              <Input
                label="Error State"
                error="This field is required"
                placeholder="Input with error"
              />
              <Input
                label="With Hint"
                hint="We'll never share your email"
                type="email"
              />
              <Select
                label="Blood Group"
                options={[
                  { label: 'Select...', value: '' },
                  { label: 'A+', value: 'A+' },
                  { label: 'B+', value: 'B+' },
                  { label: 'O+', value: 'O+' },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* ====== SPECIALIZED CARDS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Specialized Cards</h2>

          <div className="space-y-4">
            {/* Notice Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Notice Card</h3>
              <NoticeCard
                title="Water Tank Maintenance on 15th April"
                description="Scheduled maintenance of main water tank. Water supply will be interrupted."
                author="Admin"
                date="2 days ago"
                priority="high"
              />
            </div>

            {/* Member Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Member Card</h3>
              <MemberCard
                name="Raj Kumar"
                flatNo="A-301"
                contact="+91-9876543210"
                role="Member"
              />
            </div>

            {/* Bill Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Bill Card</h3>
              <BillCard
                billId="BILL-2024-001"
                amount={3500}
                dueDate="2024-04-30"
                status="overdue"
                description="April Maintenance"
              />
            </div>

            {/* Amenity Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Amenity Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AmenityCard name="Community Hall" image="🏛️" available={true} />
                <AmenityCard name="Badminton Court" image="🏸" available={true} />
                <AmenityCard name="Swimming Pool" image="🏊" available={false} />
                <AmenityCard name="Gym" image="💪" available={true} />
              </div>
            </div>

            {/* Contact Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Contact Card</h3>
              <ContactCard
                name="Rajesh Electrician"
                category="electrician"
                phone="+91-9876543212"
                availability="8:00 AM - 8:00 PM"
              />
            </div>

            {/* Booking Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Booking Card</h3>
              <BookingCard
                amenity="Community Hall"
                date="2024-04-20"
                timeSlot="6:00 PM - 9:00 PM"
                status="confirmed"
              />
            </div>

            {/* Welcome Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Welcome Card</h3>
              <WelcomeCard userName="Raj Kumar" flatNo="A-301" role="Member" />
            </div>

            {/* Quick Action Card */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Action Cards</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={DollarSign}
                  label="Pay Bill"
                  value="₹3,500"
                  color="orange"
                />
                <QuickActionCard
                  icon={Calendar}
                  label="Book Amenity"
                  value="Available"
                  color="green"
                />
                <QuickActionCard
                  icon={Users}
                  label="Members"
                  value="148"
                  color="indigo"
                />
                <QuickActionCard
                  icon={Bell}
                  label="Notices"
                  value="5 New"
                  color="blue"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ====== MODALS & DIALOGS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Modals & Dialogs</h2>
          <Card className="p-8">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => setShowModal(true)}>Open Modal</Button>
              <Button
                variant="secondary"
                onClick={() => showToast('success', 'Success!', 'Action completed successfully')}
              >
                Show Toast
              </Button>
            </div>
          </Card>

          <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            title="Confirm Action"
            size="md"
            footer={
              <>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowModal(false)}>Confirm</Button>
              </>
            }
          >
            <p className="text-gray-700">
              This is a modal dialog. You can customize the size, title, and footer content.
            </p>
          </Modal>
        </section>

        {/* ====== TABS & LAYOUTS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Tabs</h2>
          <Card className="p-8">
            <Tabs
              tabs={[
                { label: '📋 Tab 1', content: <p>Content for tab 1</p> },
                { label: '📌 Tab 2', content: <p>Content for tab 2</p> },
                { label: '✓ Tab 3', content: <p>Content for tab 3</p> },
              ]}
              onChange={setSelectedTab}
            />
          </Card>
        </section>

        {/* ====== LOADING & EMPTY STATES ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Loading & Empty States</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skeleton */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Skeleton Loading</h3>
              <div className="space-y-3">
                <Skeleton height="h-4" width="w-3/4" />
                <Skeleton height="h-4" width="w-full" />
                <Skeleton height="h-4" width="w-2/3" />
              </div>
            </Card>

            {/* Empty State */}
            <Card className="p-6">
              <EmptyState
                icon={Bell}
                title="No Data"
                description="No items to display"
              />
            </Card>
          </div>
        </section>

        {/* ====== TAGS & DIVIDERS ====== */}
        <section className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Tags & Dividers</h2>
          <Card className="p-8 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Tag onRemove={() => {}}>React</Tag>
                <Tag onRemove={() => {}}>Tailwind</Tag>
                <Tag onRemove={() => {}}>JavaScript</Tag>
              </div>
            </div>

            <Divider />

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Divider Example</h3>
              <p className="text-gray-600">Content before divider</p>
              <Divider className="my-4" />
              <p className="text-gray-600">Content after divider</p>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 pb-4 text-center text-gray-600">
          <p>Premium Society Management UI Design System v1.0</p>
          <p className="text-sm mt-2">Built with React, Tailwind CSS & Lucide Icons</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ComponentShowcase;
