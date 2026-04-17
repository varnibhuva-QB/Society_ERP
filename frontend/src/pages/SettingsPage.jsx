import React, { useState } from 'react';
import { Input, Button, Select, Card, Modal, Toast } from '../components/ui.jsx';
import { Lock, Save, LogOut, Trash2, Bell, Eye, EyeOff } from 'lucide-react';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Raj Kumar',
    email: 'raj.kumar@example.com',
    phone: '+91-9876543210',
    flatNo: 'A-301',
    bloodGroup: 'O+',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [notifications, setNotifications] = useState({
    emails: true,
    sms: false,
    pushNotifications: true,
    billingReminders: true,
    eventUpdates: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setToast({ type: 'success', title: 'Success', message: 'Profile updated successfully!' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setToast({ type: 'error', title: 'Error', message: 'Passwords do not match!' });
      return;
    }
    setToast({ type: 'success', title: 'Success', message: 'Password changed successfully!' });
    setPasswordForm({ current: '', new: '', confirm: '' });
    setShowPasswordFields(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 text-sm">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'profile', label: '👤 Profile' },
          { id: 'password', label: '🔐 Security' },
          { id: 'notifications', label: '🔔 Notifications' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>

          <Input
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleProfileChange}
          />

          <Input
            label="Flat Number"
            name="flatNo"
            value={profile.flatNo}
            disabled
            className="bg-gray-50"
          />

          <Select
            label="Blood Group"
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleProfileChange}
            options={[
              { label: 'Select...', value: '' },
              { label: 'A+', value: 'A+' },
              { label: 'A-', value: 'A-' },
              { label: 'B+', value: 'B+' },
              { label: 'B-', value: 'B-' },
              { label: 'O+', value: 'O+' },
              { label: 'O-', value: 'O-' },
              { label: 'AB+', value: 'AB+' },
              { label: 'AB-', value: 'AB-' },
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save size={18} />
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </Card>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock size={20} />
            Change Password
          </h2>

          <p className="text-gray-600 text-sm">
            Keep your account secure by regularly updating your password.
          </p>

          {!showPasswordFields ? (
            <Button onClick={() => setShowPasswordFields(true)} className="gap-2">
              <Lock size={18} />
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? 'text' : 'password'}
                    name="current"
                    placeholder="Enter current password"
                    value={passwordForm.current}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? 'text' : 'password'}
                    name="new"
                    placeholder="Enter new password"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    name="confirm"
                    placeholder="Confirm new password"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleChangePassword} className="gap-2">
                  <Lock size={18} />
                  Update Password
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordFields(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="gap-2"
            >
              <Trash2 size={18} />
              Delete Account
            </Button>
          </div>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell size={20} />
            Notification Preferences
          </h2>

          <div className="space-y-4">
            {[
              { key: 'emails', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'sms', label: 'SMS Notifications', desc: 'Receive alerts via SMS' },
              {
                key: 'pushNotifications',
                label: 'Push Notifications',
                desc: 'Receive push notifications on your device',
              },
              {
                key: 'billingReminders',
                label: 'Billing Reminders',
                desc: 'Get notified before bills are due',
              },
              {
                key: 'eventUpdates',
                label: 'Event Updates',
                desc: 'Receive updates about community events',
              },
            ].map((setting) => (
              <label
                key={setting.key}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={notifications[setting.key]}
                  onChange={() => handleNotificationChange(setting.key)}
                  className="w-5 h-5 mt-0.5 rounded accent-indigo-600 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{setting.label}</p>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <Button onClick={() => {
            setToast({ type: 'success', title: 'Success', message: 'Notifications saved!' });
            setTimeout(() => setToast(null), 3000);
          }} className="w-full">
            Save Preferences
          </Button>
        </Card>
      )}

      {/* Delete Account Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="⚠️ Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
          <p className="text-gray-700">
            Are you sure you want to delete your account? Please type your email to confirm.
          </p>
          <Input placeholder="raj.kumar@example.com" />
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
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
