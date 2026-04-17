import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const API = axios.create({ baseURL: 'https://society-erp.onrender.com/api' });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// -- AUTH PROVIDER ------------------------------------------
function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.member));
    setUser(data.member);
    return data;
  };

  const updateUser = (updatedMember) => {
    localStorage.setItem('user', JSON.stringify(updatedMember));
    setUser(updatedMember);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('notificationAudio');
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, login, logout, updateUser }}>{children}</AuthCtx.Provider>;
}

// -- COMPONENTS ----------------------------------------------
function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth();
  const [logoutModal, setLogoutModal] = useState(false);
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'family-members', label: 'Family Members', icon: '👨‍👩‍👧‍👦' },
    { id: 'notices', label: 'Notices', icon: '🔔' },
    { id: 'bookings', label: 'Amenity Booking', icon: '📅' },
    { id: 'contacts', label: 'Important Contacts', icon: '📞' },
    { id: 'amenities', label: 'Amenities', icon: '🏢' },
    { id: 'vehicles', label: 'All Vehicles', icon: '🚗' },
    { id: 'complaints', label: 'Complaints', icon: '📢' },
    // Visitor Approval for all members
    { id: 'visitor-approval', label: 'Visitor Approvals', icon: '👤' },
  ];
  
  // Maintenance Bills & Payments - Admin/Chairman only
  const showFinanceMenu = ['admin', 'chairman'].includes(user?.role);
  
  if (showFinanceMenu) {
    items.push({ id: 'billing', label: 'Maintenance Bills', icon: '📋' });
    items.push({ id: 'payments', label: 'Payments', icon: '💳' });
  }
  
  // Security-only items (Create Visitor Request & Security Monitor)
  const isSecurityUser = ['admin', 'chairman', 'security'].includes(user?.role);
  
  if (isSecurityUser) {
    items.push({ id: 'visitor-request', label: 'Create Visitor Request', icon: '📝' });
    items.push({ id: 'security-panel', label: 'Security Monitor', icon: '🛡️' });
  }
  
  // Chairman/Admin items
  if (showFinanceMenu) {
    items.push({ id: 'funds', label: 'Society Funds', icon: '💰' });
    items.push({ id: 'treasurer', label: 'Treasurer Panel', icon: '📊' });
  }
  
  // Settings - Always last for all users
  items.push({ id: 'settings', label: 'Settings', icon: '⚙️' });
  
  return (
    <>
      <aside style={{ width: 220, background: '#1a2744', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>SocietyPro ERP</div>
          <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>SERP · SQL Server</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {items.map(item => (
            <div key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                borderRadius: 8, cursor: 'pointer', marginBottom: 2, fontSize: 13,
                color: active === item.id ? '#fff' : '#94a3b8',
                background: active === item.id ? '#2563eb' : 'transparent',
                transition: 'all .15s'
              }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,.1)', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {user?.name?.split(' ').map(x => x[0]).join('').slice(0, 2)}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{user?.role} · {user?.flat_no}</div>
            </div>
          </div>
          <button onClick={() => setLogoutModal(true)} title="Logout" style={{ background: '#ef4444', border: 'none', borderRadius: 8, width: 40, height: 40, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,.2)' }} onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.transform = 'scale(1)'; }}>🚪</button>
        </div>
      </aside>

      <Modal open={logoutModal} onClose={() => setLogoutModal(false)} title="🚪 Confirm Logout">
        <div style={{ width: 400 }}>
          <p style={{ color: '#64748b', marginBottom: 20, fontSize: 13 }}>Are you sure you want to logout from SocietyPro ERP? You will need to login again to access your account.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="outline" onClick={() => setLogoutModal(false)}>Cancel</Btn>
            <Btn onClick={() => { logout(); setLogoutModal(false); }} style={{ background: '#ef4444', color: '#fff', border: 'none' }}>
              🚪 Logout
            </Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}

function StatCard({ label, value, sub, color }) {
  const colors = { blue: '#3b82f6', green: '#10b981', orange: '#f59e0b', red: '#ef4444' };
  const bgGradients = {
    blue: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    green: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    orange: 'linear-gradient(135deg, #fef9e7 0%, #fef3c7 100%)',
    red: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
  };
  return (
    <div style={{ 
      background: bgGradients[color],
      borderRadius: 16, 
      padding: 20, 
      border: `1.5px solid ${colors[color]}20`,
      borderTop: `4px solid ${colors[color]}`,
      boxShadow: `0 4px 15px ${colors[color]}15`,
      transition: 'all .3s'
    }}>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: colors[color], marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

function Card({ title, children, action }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function Pill({ status }) {
  const map = {
    paid: { bg: '#dcfce7', color: '#15803d' }, unpaid: { bg: '#fee2e2', color: '#b91c1c' },
    pending: { bg: '#fef9c3', color: '#a16207' }, confirmed: { bg: '#dbeafe', color: '#1d4ed8' },
    cancelled: { bg: '#f1f5f9', color: '#64748b' }, admin: { bg: '#f3e8ff', color: '#7e22ce' },
    chairman: { bg: '#fef3c7', color: '#d97706' }, member: { bg: '#ecfdf5', color: '#065f46' },
    high: { bg: '#fee2e2', color: '#b91c1c' }, normal: { bg: '#eff6ff', color: '#1d4ed8' },
    completed: { bg: '#dcfce7', color: '#15803d' },
  };
  const s = map[status?.toLowerCase()] || map.normal;
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{status}</span>;
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 480, maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 600, marginBottom: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{label}</label>}
      <input style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} {...props} />
    </div>
  );
}

function PasswordInput({ label, value, onChange, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input 
          type={showPassword ? 'text' : 'password'} 
          value={value} 
          onChange={onChange}
          style={{ width: '100%', padding: '9px 12px', paddingRight: 40, border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} 
          {...props}
        />
        <button 
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#64748b' }}
        >
          {showPassword ? '👁️' : '🔒'}
        </button>
      </div>
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>{label}</label>}
      <select style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }} {...props}>
        {options?.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = 'primary', sm, onClick, style }) {
  const styles = {
    primary: { background: '#1a2744', color: '#fff', border: 'none' },
    outline: { background: '#fff', color: '#374151', border: '1.5px solid #e2e8f0' },
    success: { background: '#dcfce7', color: '#15803d', border: 'none' },
    danger: { background: '#fee2e2', color: '#b91c1c', border: 'none' },
  };
  return (
    <button onClick={onClick} style={{
      padding: sm ? '5px 12px' : '8px 18px', borderRadius: 8,
      fontSize: sm ? 12 : 13, fontWeight: 500, cursor: 'pointer',
      ...styles[variant], ...style
    }}>{children}</button>
  );
}

// -- PAGES --------------------------------------------------
function Dashboard({ setActive }) {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [noticeModal, setNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [pwdModal, setPwdModal] = useState(user?.password_change_required || false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  const [pwdError, setPwdError] = useState('');

  useEffect(() => { API.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  // Sync password modal with user state changes
  useEffect(() => {
    setPwdModal(user?.password_change_required || false);
  }, [user?.password_change_required]);

  const changePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.newPasswordConfirm) {
      setPwdError('Passwords do not match');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    try {
      const { data } = await API.post('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      updateUser(data.member);
      setPwdForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
      setPwdError('');
      alert('Password changed successfully');
    } catch (e) {
      setPwdError(e.response?.data?.error || 'Error changing password');
    }
  };

  const shortcuts = [
    { icon: '🔔', label: 'Notices', action: 'notices' },
    { icon: '📅', label: 'Book Amenity', action: 'bookings' },
    { icon: '📞', label: 'Contacts', action: 'contacts' },
    { icon: '🚗', label: 'Vehicles', action: 'vehicles' },
    { icon: '📢', label: 'Complaints', action: 'complaints' },
    { icon: '⚙️', label: 'Settings', action: 'settings' },
  ];

  // Finance only for admin/chairman
  if (['admin', 'chairman'].includes(user?.role)) {
    shortcuts.push({ icon: '📋', label: 'Bills', action: 'billing' });
    shortcuts.push({ icon: '💳', label: 'Payments', action: 'payments' });
    shortcuts.push({ icon: '💰', label: 'Funds', action: 'funds' });
    shortcuts.push({ icon: '📊', label: 'Treasurer', action: 'treasurer' });
  }

  // Security-specific shortcuts (for admin, chairman, and security role)
  const isSecurityUser = ['admin', 'chairman', 'security'].includes(user?.role);
  if (isSecurityUser) {
    shortcuts.push({ icon: '📝', label: 'Visitor Request', action: 'visitor-request' });
    shortcuts.push({ icon: '🛡️', label: 'Security Monitor', action: 'security-panel' });
  }

  // Filter shortcuts based on user preferences from localStorage
  const shortcutsConfig = (() => {
    try {
      return JSON.parse(localStorage.getItem('dashboardShortcuts') || '{}');
    } catch {
      return {};
    }
  })();

  const filteredShortcuts = shortcuts.filter(s => shortcutsConfig[s.action] !== false);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Members" value={stats?.totalMembers ?? '—'} sub="+2 this month" color="blue" />
        {['admin', 'chairman'].includes(user?.role) && (
          <>
            <StatCard label="Collected (Month)" value={stats?.collectedAmount ? `₹${Number(stats.collectedAmount).toLocaleString()}` : '—'} color="green" />
            <StatCard label="Pending Amount" value={stats?.pendingAmount ? `₹${Number(stats.pendingAmount).toLocaleString()}` : '—'} sub={`${stats?.pendingBills ?? 0} bills`} color="orange" />
          </>
        )}
        <StatCard label="Active Notices" value={stats?.totalNotices ?? '—'} color="red" />
      </div>

      <Card title="Quick Shortcuts">
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {filteredShortcuts.map(s => (
            <div key={s.action} onClick={() => setActive(s.action)} style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 12,
              padding: 18,
              textAlign: 'center',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 600,
              transition: 'all .3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(0)'
            }} onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
            }} onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <Card title="📝 Recent Notices">
          <div style={{ padding: 16 }}>
            {stats?.recentNotices?.slice(0, 4).map(n => (
              <div 
                key={n.notice_id} 
                onClick={() => { setSelectedNotice(n); setNoticeModal(true); }}
                style={{ 
                  padding: '12px 14px', 
                  background: n.priority === 'high' ? 'linear-gradient(135deg,#fef2f2,#ffe0e0)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)',
                  borderRadius: 10, 
                  borderLeft: `4px solid ${n.priority === 'high' ? '#ef4444' : '#3b82f6'}`, 
                  marginBottom: 10,
                  cursor: 'pointer',
                  transition: 'all .2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,.05)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.05)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: n.priority === 'high' ? '#991b1b' : '#1d4ed8', letterSpacing: '0.5px' }}>{n.priority?.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>👤 {n.author?.name} · 📅 {new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="📅 Upcoming Bookings">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600 }}>Member</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600 }}>Amenity</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600 }}>Date</th>
            </tr></thead>
            <tbody>
              {stats?.upcomingBookings?.map(b => (
                <tr key={b.booking_id} style={{ borderTop: '1px solid #f1f5f9', transition: 'background .2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '11px 14px', fontWeight: 500 }}>{b.member?.name}</td>
                  <td style={{ padding: '11px 14px' }}>{b.amenity_type === 'garden' ? '🌳' : b.amenity_type === 'terrace' ? '🏠' : '🏢'} {b.amenity_type}</td>
                  <td style={{ padding: '11px 14px', color: '#64748b' }}>{new Date(b.booking_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal open={noticeModal} onClose={() => setNoticeModal(false)} title={selectedNotice?.title}>
        {selectedNotice && (
          <div style={{ width: 500 }}>
            <div style={{ marginBottom: 16 }}>
              <Pill status={selectedNotice.priority} />
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                📅 {new Date(selectedNotice.created_at).toLocaleDateString()} · 👤 {selectedNotice.author?.name}
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginBottom: 16, padding: 16, background: '#f8fafc', borderRadius: 8 }}>
              {selectedNotice.description}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={pwdModal} onClose={() => {}} title="🔐 Change Your Password">
        <div style={{ width: 400 }}>
          <div style={{ background: '#fef3c7', color: '#92400e', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
            ⚠️ For security, you must change your password on your first login.
          </div>
          <PasswordInput label="Current Password" value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} placeholder="Enter current password" />
          <PasswordInput label="New Password" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} placeholder="Enter new password (min 6 chars)" />
          <PasswordInput label="Confirm Password" value={pwdForm.newPasswordConfirm} onChange={e => setPwdForm({ ...pwdForm, newPasswordConfirm: e.target.value })} placeholder="Confirm new password" />
          {pwdError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 10, borderRadius: 6, fontSize: 12, marginBottom: 12 }}>{pwdError}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn onClick={changePassword}>Change Password</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Members({ setActive }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', contact_number: '', flat_no: '', blood_group: '', role: 'member', is_security: false, photo_url: '' });
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const canAdd = ['admin', 'chairman'].includes(user?.role);
  const canDelete = ['admin', 'chairman'].includes(user?.role);

  const load = () => API.get('/members').then(r => setMembers(r.data.members || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        alert('? Photo size must be less than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm({ ...form, photo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const save = async () => {
    setLoading(true);
    setSuccess('');
    try { 
      await API.post('/members', form); 
      setSuccess(`Member ${form.name} added! Default password: App@123 (must change on first login)`);
      setForm({ name: '', email: '', contact_number: '', flat_no: '', blood_group: '', role: 'member', is_security: false, photo_url: '' });
      setPhotoPreview('');
      setTimeout(() => { setSuccess(''); setModal(false); load(); }, 2000);
    } catch (e) { alert(e.response?.data?.error || 'Error'); }
    finally { setLoading(false); }
  };

  const deleteMember = async (memberId, memberName) => {
    if (!confirm(`Are you sure you want to delete ${memberName}?`)) return;
    try {
      await API.delete(`/members/${memberId}`);
      alert('Member deleted successfully');
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Error deleting member');
    }
  };

  const filtered = members.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.flat_no.includes(search));

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or flat..." style={{ flex: 1, padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }} />
        {canAdd && <Btn onClick={() => setModal(true)}>+ Add Member</Btn>}
      </div>
      <Card title={`All Members (${filtered.length})`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Member', 'Flat', 'Contact', 'Blood Group', 'Role', ...(canDelete ? ['Action'] : [])].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.member_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '11px 16px' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.photo_url ? 'transparent' : '#e2e8f0', backgroundImage: m.photo_url ? `url(${m.photo_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#64748b', flexShrink: 0 }}>
                      {!m.photo_url && m.name?.split(' ').map(x => x[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '11px 16px' }}>{m.flat_no}</td>
                <td style={{ padding: '11px 16px' }}>{m.contact_number}</td>
                <td style={{ padding: '11px 16px' }}>{m.blood_group || '—'}</td>
                <td style={{ padding: '11px 16px' }}><Pill status={m.role} /></td>
                {canDelete && <td style={{ padding: '11px 16px' }}>
                  <button onClick={() => deleteMember(m.member_id, m.name)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {canAdd && <Modal open={modal} onClose={() => setModal(false)} title="Add New Member">
        {success && <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12 }}>✅ {success}</div>}
        <div style={{ background: '#eff6ff', color: '#1e40af', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12 }}>ℹ️ Default password: App@123 (member must change on first login)</div>
        
        {/* Photo Upload Section */}
        <div style={{ marginBottom: 16, padding: 14, background: '#f8fafc', borderRadius: 8, border: '2px dashed #e2e8f0' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 8, color: '#374151' }}>📷 Profile Photo</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <label style={{ flex: 1, padding: '12px 16px', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#3b82f6', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#3b82f6'; }} onMouseLeave={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#e2e8f0'; }}>
              Click to upload
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
            {photoPreview && <div style={{ width: 60, height: 60, borderRadius: 8, backgroundImage: `url(${photoPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1.5px solid #e2e8f0' }} />}
          </div>
          {photoPreview && <button onClick={() => { setPhotoPreview(''); setForm({ ...form, photo_url: '' }); }} style={{ marginTop: 8, fontSize: 11, color: '#ef4444', background: 'none', border: '1px solid #fed7d7', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>✕ Remove photo</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Flat No." value={form.flat_no} onChange={e => setForm({ ...form, flat_no: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Contact" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
          <Select label="Blood Group" value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })} options={['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
          <Select label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value, is_security: e.target.value === 'security' })} options={['member', 'security', 'chairman', 'admin']} />
        </div>
        {form.role === 'security' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: 12, background: '#fef3c7', borderRadius: 8, borderLeft: '4px solid #f59e0b' }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Security Role Enabled</div>
              <div style={{ fontSize: 11, color: '#78350f', marginTop: 2 }}>Full access to visitor management, approval tracking, and security features</div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => { setModal(false); setPhotoPreview(''); }}>Cancel</Btn>
          <Btn onClick={save} disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</Btn>
        </div>
      </Modal>}
    </div>
  );
}

function Notices({ setActive }) {
  setActive = setActive || (() => {});
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', priority: 'normal' });
  const canPost = ['admin', 'chairman'].includes(user?.role);

  const load = () => API.get('/notices').then(r => setNotices(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try { await API.post('/notices', form); setModal(false); load(); setForm({ title: '', description: '', priority: 'normal' }); } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const deleteNotice = async (noticeId) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await API.delete(`/notices/${noticeId}`);
      setDetailModal(false);
      load();
    } catch (e) { alert('Failed to delete: ' + e.response?.data?.error); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        {canPost && <Btn onClick={() => setModal(true)}>+ Post Notice</Btn>}
      </div>
      <div style={{ display: 'grid', gap: 14 }}>
        {notices.map(n => (
          <div 
            key={n.notice_id} 
            onClick={() => { setSelectedNotice(n); setDetailModal(true); }}
            style={{ 
              background: '#fff', 
              borderRadius: 12, 
              border: '1px solid #e2e8f0', 
              padding: 18, 
              borderLeft: `4px solid ${n.priority === 'high' ? '#ef4444' : '#3b82f6'}`,
              cursor: 'pointer',
              transition: 'all .2s',
              boxShadow: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 6 }}>
              <h4 style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</h4>
              <Pill status={n.priority} />
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {n.description}
            </p>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>📅 {new Date(n.created_at).toLocaleDateString()} · 👤 {n.author?.name} · Click to view full details</div>
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Post New Notice">
        <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={[{ value: 'normal', label: 'Normal' }, { value: 'high', label: 'High Priority' }]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#374151' }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={6} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>Post Notice</Btn>
        </div>
      </Modal>
      <Modal open={detailModal} onClose={() => setDetailModal(false)} title={selectedNotice?.title}>
        {selectedNotice && (
          <div style={{ width: 500 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <Pill status={selectedNotice.priority} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>📅 {new Date(selectedNotice.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8, marginBottom: 16 }}>
              {selectedNotice.description}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 12, color: '#64748b', marginBottom: 16 }}>
              <strong>Posted by:</strong> {selectedNotice.author?.name}
            </div>
            {canPost && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Btn variant="danger" onClick={() => deleteNotice(selectedNotice.notice_id)}>🗑️ Delete Notice</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Billing({ setActive }) {
  setActive = setActive || (() => {});
  const [bills, setBills] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ amount: 2500, due_date: '', month_year: '', description: '' });
  const { user } = useAuth();
  const canManage = ['admin', 'chairman'].includes(user?.role);

  const load = () => API.get('/billing').then(r => setBills(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markPaid = async (bill_id) => {
    try { await API.patch(`/billing/${bill_id}/pay`, { payment_method: 'cash' }); load(); } catch (e) { alert('Error marking paid'); }
  };

  const generate = async () => {
    try { await API.post('/billing/generate', form); setModal(false); load(); } catch (e) { alert(e.response?.data?.error || 'Error'); }
  };

  const paid = bills.filter(b => b.status === 'paid').reduce((a, b) => a + Number(b.amount), 0);
  const unpaid = bills.filter(b => b.status === 'unpaid').reduce((a, b) => a + Number(b.amount), 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr) auto', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Collected</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>?{paid.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Pending</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>?{unpaid.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>Total Bills</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{bills.length}</div>
        </div>
        {canManage && <Btn onClick={() => setModal(true)}>Generate Bills</Btn>}
      </div>
      <Card title="Maintenance Bills">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Member', 'Flat', 'Month', 'Amount', 'Due Date', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.bill_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '11px 16px' }}>{b.member?.name}</td>
                <td style={{ padding: '11px 16px' }}>{b.member?.flat_no}</td>
                <td style={{ padding: '11px 16px' }}>{b.month_year}</td>
                <td style={{ padding: '11px 16px' }}>?{Number(b.amount).toLocaleString()}</td>
                <td style={{ padding: '11px 16px' }}>{new Date(b.due_date).toLocaleDateString()}</td>
                <td style={{ padding: '11px 16px' }}><Pill status={b.status} /></td>
                <td style={{ padding: '11px 16px' }}>
                  {b.status === 'unpaid' && canManage
                    ? <Btn variant="success" sm onClick={() => markPaid(b.bill_id)}>Mark Paid</Btn>
                    : <Btn variant="outline" sm>Receipt</Btn>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Generate Monthly Bills">
        <div style={{ background: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#1d4ed8' }}>
          Bills will be generated for all active members.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Month-Year (e.g. May-2025)" value={form.month_year} onChange={e => setForm({ ...form, month_year: e.target.value })} />
          <Input label="Amount (?)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <Input label="Due Date" type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={generate}>Generate Bills</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Bookings({ setActive }) {
  setActive = setActive || (() => {});
  const [bookings, setBookings] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ amenity_type: 'garden', booking_date: '', start_time: '08:00', end_time: '10:00', amount: 100 });

  const load = () => {
    API.get('/bookings').then(r => setBookings(r.data)).catch(() => {});
    API.get('/amenities').then(r => setAmenities(r.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const calculateHours = () => {
    if (!form.start_time || !form.end_time) return '1:00';
    const [startH, startM] = form.start_time.split(':').map(Number);
    const [endH, endM] = form.end_time.split(':').map(Number);
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    if (endMins <= startMins) endMins += 24 * 60; // Handle overnight bookings
    const diffMins = endMins - startMins;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateAmount = () => {
    if (!form.start_time || !form.end_time) return 0;
    const [startH, startM] = form.start_time.split(':').map(Number);
    const [endH, endM] = form.end_time.split(':').map(Number);
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    if (endMins <= startMins) endMins += 24 * 60;
    const hoursDecimal = (endMins - startMins) / 60;
    if (!amenities.length) return 0;
    const amenity = amenities.find(a => a.type === form.amenity_type);
    return Math.round(hoursDecimal * (amenity?.rent_amount || 50));
  };

  const save = async () => {
    try { 
      const payload = { ...form, amount: calculateAmount() };
      await API.post('/bookings', payload); 
      setModal(false); 
      setForm({ amenity_type: form.amenity_type, booking_date: '', start_time: '08:00', end_time: '10:00', amount: 100 });
      load(); 
    } catch (e) { alert(e.response?.data?.error || 'Booking failed!'); }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await API.delete(`/bookings/${bookingId}`);
      load();
    } catch (e) { alert(e.response?.data?.error || 'Failed to delete booking'); }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 24 }}>
        {amenities.length > 0 ? amenities.map(a => (
          <div key={a.amenity_id} onClick={() => setForm({ ...form, amenity_type: a.type })} style={{ background: form.amenity_type === a.type ? 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: 16, border: `2.5px solid ${form.amenity_type === a.type ? '#0ea5e9' : '#e2e8f0'}`, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: form.amenity_type === a.type ? '0 10px 30px rgba(14,165,233,0.3)' : '0 2px 8px rgba(0,0,0,.04)' }}>
            <div style={{ fontSize: 48, marginBottom: 10, transform: form.amenity_type === a.type ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.3s' }}>
              {a.type === 'garden' ? '🌳' : a.type === 'terrace' ? '🏠' : a.type === 'parking' ? '🅿️' : a.type === 'gym' ? '💪' : a.type === 'pool' ? '🏊' : '🏢'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: form.amenity_type === a.type ? '#ffffff' : '#0f172a' }}>{a.name}</div>
            <div style={{ fontSize: 13, color: form.amenity_type === a.type ? '#f0f9ff' : '#64748b', marginTop: 4, fontWeight: 600 }}>₹{a.rent_amount}<span style={{fontSize: 11}}>/hr</span></div>
          </div>
        )) : <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: 24 }}>Loading amenities...</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn onClick={() => setModal(true)}>+ Book Slot</Btn>
      </div>
      <Card title="All Bookings">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Member', 'Flat', 'Amenity', 'Date', 'Time', 'Amount', 'Payment', 'Status', 'Action'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.booking_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '11px 16px' }}>{b.member?.name}</td>
                <td style={{ padding: '11px 16px' }}>{b.member?.flat_no}</td>
                <td style={{ padding: '11px 16px' }}>{b.amenity_type}</td>
                <td style={{ padding: '11px 16px' }}>{new Date(b.booking_date).toLocaleDateString()}</td>
                <td style={{ padding: '11px 16px' }}>{b.start_time} - {b.end_time}</td>
                <td style={{ padding: '11px 16px' }}>₹{b.amount}</td>
                <td style={{ padding: '11px 16px' }}><Pill status={b.payment_status} /></td>
                <td style={{ padding: '11px 16px' }}><Pill status={b.status} /></td>
                <td style={{ padding: '11px 16px' }}>
                  <button onClick={() => deleteBooking(b.booking_id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title="✨ Book Premium Amenity">
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', padding: 16, borderRadius: 12, marginBottom: 16 }}>
          <Select label="Amenity" value={form.amenity_type} onChange={e => setForm({ ...form, amenity_type: e.target.value })} options={amenities.map(a => a.type)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', padding: 14, borderRadius: 12 }}>
            <Input label="Start Date" type="date" value={form.booking_date} onChange={e => setForm({ ...form, booking_date: e.target.value })} />
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', padding: 14, borderRadius: 12 }}>
            <Input label="End Date" type="date" value={form.booking_date} onChange={e => setForm({ ...form, booking_date: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)', padding: 14, borderRadius: 12 }}>
            <Input label="Start Time" type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)', padding: 14, borderRadius: 12 }}>
            <Input label="End Time" type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16, padding: 18, background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)', borderRadius: 14, border: '2px solid #0ea5e9' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⏱️ Duration</label>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0ea5e9' }}>{calculateHours()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, marginBottom: 6, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💰 Total Amount</label>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0ea5e9' }}>₹{calculateAmount()}</div>
          </div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)', borderRadius: 12, padding: 14, fontSize: 13, color: '#15803d', marginTop: 16, border: '1.5px solid #86efac', display: 'flex', gap: 10, alignItems: 'center' }}><span style={{fontSize: 16}}>🔒</span> Payment via Razorpay required to confirm booking.</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>Confirm & Pay</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Contacts({ setActive }) {
  setActive = setActive || (() => {});
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', service_type: 'milkman', phone_number: '', description: '', available_time: '' });
  const icons = { milkman: '🥛', laundry: '👕', plumber: '🔧', electrician: '⚡', cab: '🚕', pharmacy: '💊', carpenter: '🔨', security: '👮' };

  const load = () => API.get('/contacts').then(r => setContacts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try { await API.post('/contacts', form); setModal(false); load(); } catch (e) { alert('Error adding contact'); }
  };

  const filtered = contacts.filter(c => !filter || c.service_type === filter);

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>
          <option value="">All Services</option>
          {['milkman', 'laundry', 'plumber', 'electrician', 'cab', 'pharmacy', 'carpenter', 'security'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <Btn onClick={() => setModal(true)}>+ Add Contact</Btn>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {filtered.map(c => (
          <div key={c.contact_id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 16, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icons[c.service_type] || '📞'}</div>
            <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, marginBottom: 2 }}>{c.service_type.toUpperCase()}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{c.name}</div>
            <div style={{ fontSize: 13 }}>📞 {c.phone_number}</div>
            {c.available_time && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>? {c.available_time}</div>}
            {c.description && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{c.description}</div>}
          </div>
        ))}
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Add Important Contact">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Select label="Service Type" value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} options={['milkman', 'laundry', 'plumber', 'electrician', 'cab', 'pharmacy', 'carpenter', 'security']} />
          <Input label="Phone" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} />
          <Input label="Available Time" value={form.available_time} onChange={e => setForm({ ...form, available_time: e.target.value })} />
        </div>
        <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>Add Contact</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Vehicles({ setActive }) {
  setActive = setActive || (() => {});
  const [myVehicles, setMyVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ vehicle_type: 'Car', vehicle_number: '' });

  const load = () => {
    API.get('/vehicles/my').then(r => setMyVehicles(r.data)).catch(() => {});
    API.get('/vehicles/all').then(r => setAllVehicles(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try { 
      await API.post('/vehicles', form); 
      setModal(false); 
      setForm({ vehicle_type: 'Car', vehicle_number: '' });
      load();
    } catch (e) { alert('Error'); }
  };

  const deleteVehicle = async (id) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        await API.delete(`/vehicles/${id}`);
        load();
      } catch (e) {
        alert('Error deleting vehicle');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Btn onClick={() => setModal(true)}>+ Register Vehicle</Btn>
      </div>
      <Card title="🚗 My Registered Vehicles">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Type', 'Vehicle Number', 'Registered', 'Action'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {myVehicles.map(v => (
              <tr key={v.vehicle_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '11px 16px' }}>{v.vehicle_type === 'Car' ? '🚗' : '🏍️'} {v.vehicle_type}</td>
                <td style={{ padding: '11px 16px', fontWeight: 500 }}>{v.vehicle_number}</td>
                <td style={{ padding: '11px 16px', color: '#64748b' }}>{new Date(v.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '11px 16px' }}>
                  <Btn variant="danger" sm onClick={() => deleteVehicle(v.vehicle_id)}>Remove</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myVehicles.length === 0 && <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>No vehicles registered yet</div>}
      </Card>

      <Card title={`🚗 All Society Vehicles (${allVehicles.length})`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Member', 'Flat', 'Type', 'Vehicle Number', 'Registered'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {allVehicles.map(v => (
              <tr key={v.vehicle_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '11px 16px', fontWeight: 500 }}>{v.member?.name}</td>
                <td style={{ padding: '11px 16px' }}>{v.member?.flat_no}</td>
                <td style={{ padding: '11px 16px' }}>{v.vehicle_type === 'Car' ? '🚗' : '🏍️'} {v.vehicle_type}</td>
                <td style={{ padding: '11px 16px', fontWeight: 500 }}>{v.vehicle_number}</td>
                <td style={{ padding: '11px 16px', color: '#64748b' }}>{new Date(v.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Register Vehicle">
        <Select label="Vehicle Type" value={form.vehicle_type} onChange={e => setForm({ ...form, vehicle_type: e.target.value })} options={['Car', 'Bike', 'Scooter', 'Cycle', 'Auto']} />
        <Input label="Vehicle Number" value={form.vehicle_number} onChange={e => setForm({ ...form, vehicle_number: e.target.value.toUpperCase() })} placeholder="GJ01AB1234" />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>Register</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Payments({ setActive }) {
  setActive = setActive || (() => {});
  const [payments, setPayments] = useState([]);
  useEffect(() => { API.get('/payments').then(r => setPayments(r.data)).catch(() => {}); }, []);
  return (
    <Card title="Payment History">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead><tr style={{ background: '#f8fafc' }}>
          {['Date', 'Member', 'Amount', 'Method', 'Transaction ID', 'Status'].map(h => <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontSize: 12 }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.payment_id} style={{ borderTop: '1px solid #f1f5f9' }}>
              <td style={{ padding: '11px 16px' }}>{new Date(p.created_at).toLocaleDateString()}</td>
              <td style={{ padding: '11px 16px' }}>{p.member?.name} · {p.member?.flat_no}</td>
              <td style={{ padding: '11px 16px', fontWeight: 600 }}>?{Number(p.amount).toLocaleString()}</td>
              <td style={{ padding: '11px 16px' }}>{p.payment_method}</td>
              <td style={{ padding: '11px 16px', fontSize: 11, color: '#64748b' }}>{p.transaction_id || '—'}</td>
              <td style={{ padding: '11px 16px' }}><Pill status={p.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function Settings({ setActive }) {
  setActive = setActive || (() => {});
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [pwdModal, setPwdModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [shortcutsConfig, setShortcutsConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dashboardShortcuts') || '{}');
    } catch {
      return {};
    }
  });

  const availableShortcuts = [
    { id: 'notices', label: '🔔 Notices', enabled: true },
    { id: 'bookings', label: '📅 Book Amenity', enabled: true },
    { id: 'contacts', label: '📞 Contacts', enabled: true },
    { id: 'vehicles', label: '🚗 Vehicles', enabled: true },
    { id: 'complaints', label: '📢 Complaints', enabled: true },
    { id: 'settings', label: '⚙️ Settings', enabled: true },
    { id: 'billing', label: '📋 Bills', enabled: ['admin', 'chairman'].includes(user?.role) },
    { id: 'payments', label: '💳 Payments', enabled: ['admin', 'chairman'].includes(user?.role) },
    { id: 'funds', label: '💰 Funds', enabled: ['admin', 'chairman'].includes(user?.role) },
    { id: 'treasurer', label: '📊 Treasurer', enabled: ['admin', 'chairman'].includes(user?.role) },
    { id: 'visitor-request', label: '📝 Visitor Request', enabled: ['admin', 'chairman', 'security'].includes(user?.role) },
    { id: 'security-panel', label: '🛡️ Security Monitor', enabled: ['admin', 'chairman', 'security'].includes(user?.role) },
  ];

  const toggleShortcut = (id) => {
    const updated = { ...shortcutsConfig, [id]: !shortcutsConfig[id] };
    setShortcutsConfig(updated);
    localStorage.setItem('dashboardShortcuts', JSON.stringify(updated));
  };

  const resetShortcuts = () => {
    localStorage.removeItem('dashboardShortcuts');
    setShortcutsConfig({});
    alert('Dashboard shortcuts reset to default');
  };

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, contact_number: user.contact_number, blood_group: user.blood_group || '' });
    }
  }, [user]);

  const save = async () => {
    setLoading(true);
    setSuccess('');
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data.member);
      setSuccess('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      alert(e.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.newPasswordConfirm) {
      setPwdError('Passwords do not match');
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdError('Password must be at least 6 characters');
      return;
    }
    setPwdLoading(true);
    setPwdError('');
    try {
      const { data } = await API.post('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      updateUser(data.member);
      setPwdModal(false);
      setPwdForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
      alert('Password changed successfully');
    } catch (e) {
      setPwdError(e.response?.data?.error || 'Error changing password');
    } finally {
      setPwdLoading(false);
    }
  };

  const deleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/members/${user.member_id}`);
      alert('Account deleted successfully');
      logout();
    } catch (e) {
      alert(e.response?.data?.error || 'Error deleting account');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 500 }}>
      {success && <div style={{ background: '#dcfce7', color: '#15803d', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>? {success}</div>}
      <Card title="Personal Settings">
        <div style={{ padding: 20 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Contact Number" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} />
          <Select label="Blood Group" value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })} options={['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn onClick={save} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Btn>
          </div>
        </div>
      </Card>
      <Card title="Account Info">
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Email</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.email}</div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Flat No.</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}>{user?.flat_no}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>Role</div>
            <div style={{ fontWeight: 600, marginTop: 2 }}><Pill status={user?.role} /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn variant="outline" onClick={() => setPwdModal(true)} style={{ width: '100%' }}>🔐 Change Password</Btn>
            <Btn variant="outline" onClick={() => setDeleteModal(true)} style={{ width: '100%', color: '#dc2626', borderColor: '#dc2626' }}>🗑️ Delete Account</Btn>
          </div>
        </div>
      </Card>

      <Card title="🎯 Customize Dashboard Shortcuts">
        <div style={{ padding: 20 }}>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Choose which shortcuts appear on your dashboard home screen:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {availableShortcuts.map(s => (
              s.enabled && (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: 8, borderRadius: 6, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 13 }}>
                  <input 
                    type="checkbox" 
                    checked={shortcutsConfig[s.id] !== false}
                    onChange={() => toggleShortcut(s.id)}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <span>{s.label}</span>
                </label>
              )
            ))}
          </div>
          <div style={{ background: '#fef9e7', padding: 10, borderRadius: 8, fontSize: 12, color: '#a16207', marginBottom: 12 }}>
            ℹ️ All shortcuts are shown by default. Uncheck to hide them from your dashboard.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="outline" onClick={resetShortcuts} style={{ flex: 1 }}>🔄 Reset to Default</Btn>
          </div>
        </div>
      </Card>

      <Modal open={pwdModal} onClose={() => { setPwdModal(false); setPwdError(''); }} title="🔐 Change Password">
        <div style={{ width: 400 }}>
          <PasswordInput label="Current Password" value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} placeholder="Enter your current password" />
          <PasswordInput label="New Password" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} placeholder="Enter new password (min 6 chars)" />
          <PasswordInput label="Confirm Password" value={pwdForm.newPasswordConfirm} onChange={e => setPwdForm({ ...pwdForm, newPasswordConfirm: e.target.value })} placeholder="Confirm new password" />
          {pwdError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 10, borderRadius: 6, fontSize: 12, marginBottom: 12 }}>{pwdError}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn variant="outline" onClick={() => { setPwdModal(false); setPwdError(''); }}>Cancel</Btn>
            <Btn onClick={changePassword} disabled={pwdLoading}>{pwdLoading ? 'Changing...' : 'Change Password'}</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="⚠️ Delete Account">
        <div style={{ width: 400 }}>
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            <strong>⚠️ Warning:</strong> This action cannot be undone. Your account and all associated data will be permanently deleted.
          </div>
          <p style={{ color: '#64748b', marginBottom: 16, fontSize: 13 }}>Are you sure you want to delete your account?</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <Btn variant="outline" onClick={() => setDeleteModal(false)}>Cancel</Btn>
            <Btn onClick={deleteAccount} disabled={deleteLoading} style={{ background: '#dc2626', color: '#fff', border: 'none' }}>
              {deleteLoading ? 'Deleting...' : 'Delete Account'}
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FamilyMembers({ setActive }) {
  setActive = setActive || (() => {});
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', relationship: '', contact_number: '' });
  const [loading, setLoading] = useState(false);

  const load = () => {
    if (user?.member_id) {
      API.get(`/family-members?member_id=${user.member_id}`).then(r => setFamilyMembers(r.data || [])).catch(() => setFamilyMembers([]));
    }
  };
  
  useEffect(() => { load(); }, [user?.member_id]);

  const save = async () => {
    if (!form.name || !form.age || !form.relationship) {
      alert('? Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await API.post('/family-members', { ...form, member_id: user.member_id, age: parseInt(form.age) });
      setModal(false);
      setForm({ name: '', age: '', relationship: '', contact_number: '' });
      load();
    } catch (e) { alert(e.response?.data?.error || 'Error adding family member'); }
    finally { setLoading(false); }
  };

  const deleteFamilyMember = async (id) => {
    if (!confirm('Are you sure you want to delete this family member?')) return;
    try {
      await API.delete(`/family-members/${id}`);
      load();
    } catch (e) { alert(e.response?.data?.error || 'Error deleting family member'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>👨‍👩‍👧‍👦 My Family Members ({familyMembers.length})</h2>
        <Btn onClick={() => setModal(true)}>+ Add Family Member</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {familyMembers.map(fm => (
          <div key={fm.family_id} style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #e2e8f0', padding: 20, transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a2744' }}>{fm.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{fm.relationship}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                <div style={{ color: '#64748b', fontSize: 11 }}>Age</div>
                <div style={{ fontWeight: 700, color: '#1a2744', marginTop: 2 }}>{fm.age} years</div>
              </div>
              <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8 }}>
                <div style={{ color: '#64748b', fontSize: 11 }}>Contact</div>
                <div style={{ fontWeight: 700, color: '#1a2744', marginTop: 2 }}>{fm.contact_number || '—'}</div>
              </div>
            </div>
            <button onClick={() => deleteFamilyMember(fm.family_id)} style={{ marginTop: 12, width: '100%', padding: '8px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🗑️ Delete</button>
          </div>
        ))}
      </div>

      {familyMembers.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, background: '#f8fafc', borderRadius: 12, border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍👩‍👧‍👦</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a2744', marginBottom: 6 }}>No Family Members Added</div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Add your family members to keep their information secure and accessible</div>
          <Btn onClick={() => setModal(true)}>+ Add Family Member</Btn>
        </div>
      )}

      <Modal open={modal} onClose={() => { setModal(false); setForm({ name: '', age: '', relationship: '', contact_number: '' }); }} title="➕ Add Family Member">
        <div style={{ background: '#eff6ff', color: '#1e40af', padding: '12px 14px', borderRadius: 8, marginBottom: 16, fontSize: 12 }}>ℹ️ Keep your family members' information up to date for emergency purposes.</div>
        <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Family member's name" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input label="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" min="0" />
          <Select label="Relationship" value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} options={['', 'Spouse', 'Child', 'Parent', 'Sibling', 'Grandparent', 'Other']} />
        </div>
        <Input label="Contact Number (Optional)" value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} placeholder="Mobile number" />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => { setModal(false); setForm({ name: '', age: '', relationship: '', contact_number: '' }); }}>Cancel</Btn>
          <Btn onClick={save} disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Amenities({ setActive }) {
  setActive = setActive || (() => {});
  const { user } = useAuth();
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'garden', rent_amount: 100, description: '' });
  const canManage = ['admin', 'chairman'].includes(user?.role);

  const loadAmenities = () => {
    API.get('/amenities').then(r => setAmenities(r.data)).catch(() => {});
  };

  useEffect(() => {
    loadAmenities();
  }, []);

  const save = async () => {
    try {
      if (editId) {
        await API.put(`/amenities/${editId}`, form);
      } else {
        await API.post('/amenities', form);
      }
      setModal(false);
      setEditId(null);
      setForm({ name: '', type: 'garden', rent_amount: 100, description: '' });
      loadAmenities();
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    }
  };

  const handleEdit = (a) => {
    setForm({ name: a.name, type: a.type, rent_amount: a.rent_amount, description: a.description });
    setEditId(a.amenity_id);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this amenity?')) {
      try {
        await API.delete(`/amenities/${id}`);
        loadAmenities();
      } catch (e) {
        alert('Error deleting amenity');
      }
    }
  };

  const amenityIcons = { garden: '🌳', terrace: '🏠', parking: '🅿️', gym: '💪', pool: '🏊' };

  return (
    <div>
      {canManage && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Btn onClick={() => { setEditId(null); setForm({ name: '', type: 'garden', rent_amount: 100, description: '' }); setModal(true); }}>+ Add Amenity</Btn>
        </div>
      )}
      <Card title={`🏢 Premium Amenities (${amenities.length})`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, padding: 28 }}>
          {amenities.map(a => (
            <div key={a.amenity_id} style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 24,
              padding: 28,
              border: '2px solid #e2e8f0',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 25px rgba(0,0,0,.08)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }} onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,.15)';
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
              e.currentTarget.style.borderColor = '#0ea5e9';
            }} onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,.08)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(14,165,233,0.03) 100%)', borderRadius: '0 24px 0 140px' }}></div>
              <div style={{ fontSize: 56, marginBottom: 16, display: 'block', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.1))' }}>
                {amenityIcons[a.type] || '🏢'}
              </div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 8, color: '#0f172a', letterSpacing: '-0.5px' }}>{a.name}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.6, height: 36 }}>{a.description}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, fontWeight: 800, color: '#0ea5e9', marginBottom: 16, fontSize: 28 }}><span style={{fontSize: 20}}>₹</span>{a.rent_amount}<span style={{fontSize: 12, fontWeight: 600, color: '#64748b', marginLeft: 4}}>/hour</span></div>
              {canManage && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn variant="outline" sm onClick={() => handleEdit(a)}>Edit</Btn>
                  <Btn variant="danger" sm onClick={() => handleDelete(a.amenity_id)}>Delete</Btn>
                </div>
              )}
            </div>
          ))}
        </div>
        {amenities.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No amenities available yet</div>}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Amenity' : 'Add New Amenity'}>
        <Input label="Amenity Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Community Garden" />
        <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={['garden', 'terrace', 'parking', 'gym', 'pool']} />
        <Input label="Rent (₹/hour)" type="number" value={form.rent_amount} onChange={e => setForm({ ...form, rent_amount: parseInt(e.target.value) })} />
        <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save}>{editId ? 'Update' : 'Add'} Amenity</Btn>
        </div>
      </Modal>
    </div>
  );
}

function SocietyFunds({ setActive }) {
  setActive = setActive || (() => {});
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [memberModal, setMemberModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const canManage = ['admin', 'chairman'].includes(user?.role);

  useEffect(() => {
    API.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
    if (memberModal) {
      API.get('/members').then(r => setMembers(r.data.members || [])).catch(() => {});
    }
  }, [memberModal]);

  const removeMember = async () => {
    if (!selectedMember || !window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await API.delete(`/members/${selectedMember}`);
      setMemberModal(false);
      setSelectedMember('');
      API.get('/members').then(r => setMembers(r.data.members || [])).catch(() => {});
    } catch (e) {
      alert(e.response?.data?.error || 'Error removing member');
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginBottom: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>💰 Total Collected (This Month)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>?{stats?.collectedAmount ? Number(stats.collectedAmount).toLocaleString() : '0'}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>? Pending Amount</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>?{stats?.pendingAmount ? Number(stats.pendingAmount).toLocaleString() : '0'}</div>
        </div>
      </div>
      {canManage && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <Btn onClick={() => setMemberModal(true)}>🗑️ Remove Member</Btn>
        </div>
      )}
      <Card title="Financial Summary">
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Members</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats?.totalMembers || 0}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Paid Bills</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats?.totalNotices || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Pending Bills</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{stats?.pendingBills || 0}</div>
          </div>
        </div>
      </Card>
      <Modal open={memberModal} onClose={() => setMemberModal(false)} title="Remove Member">
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
          ⚠️ This action cannot be undone. The member will lose all access to the system.
        </div>
        <Select label="Select Member to Remove" value={selectedMember} onChange={e => setSelectedMember(e.target.value)} options={[{ value: '', label: 'Choose a member...' }, ...members.map(m => ({ value: m.member_id, label: `${m.name} (${m.flat_no})` }))]} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => setMemberModal(false)}>Cancel</Btn>
          <Btn variant="danger" onClick={removeMember} disabled={!selectedMember}>Remove Member</Btn>
        </div>
      </Modal>
    </div>
  );
}

// -- VISITOR APPROVAL (For Members) ------------------------------
function VisitorApproval({ setActive }) {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('pending');
  const [reason, setReason] = useState('');
  const [rejectModal, setRejectModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [pendRes, histRes] = await Promise.all([
        API.get(`/visitors/pending/${user.member_id}`),
        API.get(`/visitors/history/${user.member_id}`)
      ]);
      const pendData = pendRes.data?.visitors || pendRes.data || [];
      const histData = histRes.data?.visitors || histRes.data || [];
      setPending(Array.isArray(pendData) ? pendData : []);
      setHistory(Array.isArray(histData) ? histData : []);
    } catch (e) { 
      console.error(e);
      setPending([]);
      setHistory([]);
    }
  };

  const approveVisitor = async (visitorId) => {
    try {
      await API.patch(`/visitors/${visitorId}/approve`);
      await loadData();
    } catch (e) { alert('Failed to approve: ' + e.response?.data?.error); }
  };

  const rejectVisitor = async () => {
    try {
      await API.patch(`/visitors/${rejectModal}/reject`, { reason });
      setRejectModal(null);
      setReason('');
      await loadData();
    } catch (e) { alert('Failed to reject: ' + e.response?.data?.error); }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('pending')} style={{ padding: '8px 16px', background: tab === 'pending' ? '#2563eb' : '#e2e8f0', color: tab === 'pending' ? '#fff' : '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          👤 Pending Approvals ({pending.length})
        </button>
        <button onClick={() => setTab('history')} style={{ padding: '8px 16px', background: tab === 'history' ? '#2563eb' : '#e2e8f0', color: tab === 'history' ? '#fff' : '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          ? Approval History ({history.length})
        </button>
      </div>

      {tab === 'pending' && (
        <div>
          {pending.length === 0 ? (
            <Card><div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No pending visitor approvals</div></Card>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {pending.map(v => (
                <Card key={v.visitor_id} style={{ padding: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Visitor Name</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{v.visitor_name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>📞 {v.visitor_mobile}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Requested By</div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{v.security_guard?.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Security Guard</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <Btn variant="success" onClick={() => approveVisitor(v.visitor_id)}>? Approve</Btn>
                      <Btn variant="danger" onClick={() => setRejectModal(v.visitor_id)}>? Reject</Btn>
                    </div>
                  </div>
                  {v.visitor_photo && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                      <img src={v.visitor_photo} alt="Visitor" style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8 }} />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <Card title="📄 Approval History">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Visitor</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Mobile</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map(v => (
                <tr key={v.visitor_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>{v.visitor_name}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{v.visitor_mobile}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <Pill color={v.status === 'approved' ? 'green' : 'red'}>{v.status}</Pill>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 12 }}>{new Date(v.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={rejectModal !== null} onClose={() => setRejectModal(null)} title="Reject Visitor">
        <Input label="Reason (optional)" placeholder="Why are you rejecting this visitor?" value={reason} onChange={e => setReason(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <Btn variant="outline" onClick={() => setRejectModal(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={rejectVisitor}>Reject Visitor</Btn>
        </div>
      </Modal>
    </div>
  );
}

// -- VISITOR REQUEST (For Security Guard) ------------------------
function VisitorRequest({ setActive }) {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ visitor_name: '', visitor_mobile: '', member_id: '', visitor_photo: '' });
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [cameraMode, setCameraMode] = useState(false);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await API.get('/members');
        const data = res.data ? (Array.isArray(res.data) ? res.data : res.data.members || []) : [];
        setMembers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load members:', e);
        setMembers([]);
      }
    };
    loadMembers();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraMode(true);
      }
    } catch (e) {
      alert('? Camera access denied: ' + e.message);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 320, 240);
      const photoData = canvasRef.current.toDataURL('image/jpeg', 0.7);
      setPhotoPreview(photoData);
      setForm({ ...form, visitor_photo: photoData });
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraMode(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 300000) {
        alert('? Photo size must be less than 300KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm({ ...form, visitor_photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitRequest = async () => {
    if (!form.visitor_name || !form.visitor_mobile || !form.member_id) {
      alert('? Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        visitor_name: form.visitor_name,
        visitor_mobile: form.visitor_mobile,
        member_id: parseInt(form.member_id),
        visitor_photo: form.visitor_photo || null
      };
      const res = await API.post('/visitors', payload);
      alert('? Visitor entry request sent successfully!');
      setForm({ visitor_name: '', visitor_mobile: '', member_id: '', visitor_photo: '' });
      setPhotoPreview('');
    } catch (e) {
      console.error('Error:', e);
      alert('? Failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const hasSecurityRole = ['security', 'admin', 'chairman'].includes(user?.role);

  if (!hasSecurityRole) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Access Restricted</div>
          <div style={{ color: '#94a3b8', fontSize: 14 }}>This page is only available to Security Personnel</div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '20px' }}>
      {/* Premium Security Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', borderRadius: 16, padding: 24, color: '#fff', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 12, fontSize: 28 }}>???</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Visitor Entry Request</h2>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Secure visitor check-in system</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', height: 1, margin: '12px 0' }}></div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>👤 {user?.name} • Security Guard • {new Date().toLocaleDateString()}</div>
      </div>

      <Card style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>👤 Visitor Information</label>
          <Input label="Full Name" placeholder="Visitor's name" value={form.visitor_name} onChange={e => setForm({ ...form, visitor_name: e.target.value })} />
          <Input label="Mobile Number" placeholder="10-digit phone number" type="tel" value={form.visitor_mobile} onChange={e => setForm({ ...form, visitor_mobile: e.target.value })} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'block' }}>👤 Visiting Member</label>
          <Select label="" value={form.member_id} onChange={e => setForm({ ...form, member_id: e.target.value })} options={[{ value: '', label: 'Select member...' }, ...(Array.isArray(members) ? members.map(m => ({ value: String(m.member_id), label: `${m.name} (Flat ${m.flat_no})` })) : [])]} />
        </div>

        {/* Camera/Photo Capture Section */}
        <div style={{ marginBottom: 20, borderTop: '2px solid #e2e8f0', paddingTop: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'block' }}>📷 Visitor Photo (Optional)</label>
          
          {!cameraMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button onClick={startCamera} style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = '#0284c7'} onMouseOut={e => e.target.style.background = '#0ea5e9'}>
                📷 Take Photo
              </button>
              <label style={{ background: '#6366f1', color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }} onMouseOver={e => e.target.style.background = '#4f46e5'} onMouseOut={e => e.target.style.background = '#6366f1'}>
                📁 Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} hidden />
              </label>
            </div>
          ) : (
            <div style={{ background: '#f1f5f9', borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <video ref={videoRef} autoPlay style={{ width: '100%', borderRadius: 8, maxHeight: 300, background: '#000', marginBottom: 12 }} />
              <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={capturePhoto} style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: 10, borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                  ? Capture
                </button>
                <button onClick={stopCamera} style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: 10, borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                  ? Cancel
                </button>
              </div>
            </div>
          )}

          {photoPreview && (
            <div style={{ marginTop: 12, padding: 12, background: '#f0f9ff', borderRadius: 8, border: '2px solid #0ea5e9' }}>
              <img src={photoPreview} alt="Visitor Photo" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 6, display: 'block', margin: '0 auto 10px auto' }} />
              <button onClick={() => { setPhotoPreview(''); setForm({ ...form, visitor_photo: '' }); }} style={{ width: '100%', background: '#fee2e2', color: '#b91c1c', border: 'none', padding: 8, borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                🗑️ Remove Photo
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button onClick={submitRequest} disabled={loading} style={{ width: '100%', padding: 14, background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }} onMouseOver={e => !loading && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 10px 20px rgba(14,165,233,0.3)')} onMouseOut={e => !loading && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}>
          {loading ? '⏳ Submitting...' : '✅ Send Approval Request'}
        </button>

        <div style={{ marginTop: 16, fontSize: 12, color: '#64748b', lineHeight: 1.6, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
          ℹ️ The member will receive an approval notification. Only approved visitors will be allowed entry.
        </div>
      </Card>
    </div>
  );
}

// -- COMPLAINTS PAGE ----------------------------------------
function Complaints({ setActive }) {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'normal' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const res = await API.get('/complaints');
      const data = res.data ? (Array.isArray(res.data) ? res.data : res.data.complaints || []) : [];
      setComplaints(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setComplaints([]);
    }
  };

  const addComplaint = async () => {
    if (!form.title || !form.description) {
      alert('Please fill in title and description');
      return;
    }
    setLoading(true);
    try {
      await API.post('/complaints', form);
      setModal(false);
      setForm({ title: '', description: '', priority: 'normal' });
      loadComplaints();
    } catch (e) {
      alert('Failed: ' + e.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    if (!confirm('Delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      loadComplaints();
    } catch (e) {
      alert('Failed: ' + e.response?.data?.error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Btn onClick={() => setModal(true)}>+ Add Complaint</Btn>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {complaints.length === 0 ? (
          <Card><div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No complaints yet</div></Card>
        ) : (
          complaints.map(c => (
            <Card key={c.complaint_id} style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.title}</h3>
                  <Pill color={c.status === 'pending' ? 'yellow' : c.status === 'resolved' ? 'green' : 'blue'}>{c.status}</Pill>
                </div>
                {(user?.member_id === c.member_id || ['admin', 'chairman'].includes(user?.role)) && (
                  <button onClick={() => deleteComplaint(c.complaint_id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10, lineHeight: 1.6 }}>{c.description}</p>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>👤 By: {c.member.name} ({c.member.flat_no}) • 📅 {new Date(c.created_at).toLocaleDateString()}</div>
            </Card>
          ))
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="📢 Add New Complaint">
        <Input label="Title" placeholder="Subject of complaint" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={[{ value: 'normal', label: 'Normal' }, { value: 'high', label: 'High Priority' }, { value: 'urgent', label: 'Urgent' }]} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your complaint in detail..." rows={6} style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={addComplaint} disabled={loading}>{loading ? 'Submitting...' : 'Submit Complaint'}</Btn>
        </div>
      </Modal>
    </div>
  );
}

// -- SECURITY GUARD PANEL -----------------------------------
function SecurityGuardPanel({ setActive }) {
  const { user } = useAuth();
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    try {
      const [pendRes, appRes] = await Promise.all([
        API.get('/visitors/all/pending'),
        API.get('/visitors/history/0')
      ]);
      const pendData = pendRes.data?.visitors || pendRes.data || [];
      const appData = appRes.data?.visitors || appRes.data || [];
      setPending(Array.isArray(pendData) ? pendData : []);
      setApproved(Array.isArray(appData) ? appData : []);
    } catch (e) {
      console.error(e);
      setPending([]);
      setApproved([]);
    }
  };

  const hasSecurityRole = ['security', 'admin', 'chairman'].includes(user?.role);

  if (!hasSecurityRole) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <div style={{ color: '#dc2626', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Security Access Only</div>
          <div style={{ color: '#94a3b8', fontSize: 14 }}>This dashboard is restricted to security personnel and administrators</div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Premium Security Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', borderRadius: 16, padding: 24, color: '#fff', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 12, fontSize: 28 }}>👁️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Security Monitor</h2>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>Real-time visitor management & approval tracking</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', height: 1, margin: '12px 0' }}></div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>👤 {user?.name} • {user?.role === 'security' ? 'Security Guard' : 'Administrator'} • {new Date().toLocaleDateString()}</div>
      </div>

      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => setTab('pending')} 
          style={{
            padding: '12px 20px',
            background: tab === 'pending' ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' : '#f3f4f6',
            color: tab === 'pending' ? '#fff' : '#6b7280',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseOver={e => tab === 'pending' && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 10px 20px rgba(245,158,11,0.3)')}
          onMouseOut={e => tab === 'pending' && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
        >
          👤 Pending Approvals <span style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{pending.length}</span>
        </button>
        <button 
          onClick={() => setTab('approved')} 
          style={{
            padding: '12px 20px',
            background: tab === 'approved' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
            color: tab === 'approved' ? '#fff' : '#6b7280',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s'
          }}
          onMouseOver={e => tab === 'approved' && (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 10px 20px rgba(16,185,129,0.3)')}
          onMouseOut={e => tab === 'approved' && (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = 'none')}
        >
          ? Approved Entries <span style={{ background: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{approved.length}</span>
        </button>
      </div>

      {tab === 'pending' && (
        <div style={{ display: 'grid', gap: 14 }}>
          {pending.length === 0 ? (
            <Card style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ color: '#16a34a', fontWeight: 700, fontSize: 16 }}>All Clear!</div>
              <div style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>No pending visitor approval requests</div>
            </Card>
          ) : (
            pending.map(v => (
              <Card key={v.visitor_id} style={{ padding: 16, borderLeft: '4px solid #f59e0b' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>👤 Visitor Name</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{v.visitor_name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>📞 Mobile</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{v.visitor_mobile}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>🏘️ Member</div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{v.member?.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Flat {v.member?.flat_no}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Pill color="yellow" style={{ background: '#fef3c7', color: '#92400e', fontWeight: 600, padding: '6px 12px' }}>⏳ Awaiting Approval</Pill>
                  </div>
                </div>
                {v.visitor_photo && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>📸 Visitor Photo</div>
                    <img src={v.visitor_photo} alt="Visitor" style={{ maxWidth: 100, maxHeight: 100, borderRadius: 8, border: '2px solid #0ea5e9' }} />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}

      {tab === 'approved' && (
        <div>
          {approved.length === 0 ? (
            <Card style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ color: '#0284c7', fontWeight: 700, fontSize: 16 }}>No Approvals Yet</div>
              <div style={{ color: '#6b7280', marginTop: 8, fontSize: 14 }}>Approved visitor entries will appear here</div>
            </Card>
          ) : (
            <Card style={{ padding: 20, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>? Approved Visitor Entries</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700 }}>?? Visitor</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700 }}>?? Mobile</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700 }}>?? Member</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontWeight: 700 }}>?? Approved Date</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((v, idx) => (
                    <tr key={v.visitor_id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#f8fafc' : '#fff' }}>
                      <td style={{ padding: '12px 14px' }}><span style={{ fontWeight: 600 }}>{v.visitor_name}</span></td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>{v.visitor_mobile}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>{v.member?.name} ({v.member?.flat_no})</td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: 12 }}>
                        {v.approval_date ? new Date(v.approval_date).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function TreasurerPanel({ setActive }) {
  setActive = setActive || (() => {});
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Promise.all([
      API.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {}),
      API.get('/payments').then(r => setTransactions(Array.isArray(r.data) ? r.data : r.data.payments || [])).catch(() => {})
    ]);
  }, []);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, padding: 20, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>💰 Total Collected</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>₹{stats?.collectedAmount ? Number(stats.collectedAmount).toLocaleString() : '0'}</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>This month</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 12, padding: 20, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>⏳ Pending Amount</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>₹{stats?.pendingAmount ? Number(stats.pendingAmount).toLocaleString() : '0'}</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>{stats?.pendingBills || 0} pending bills</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 12, padding: 20, color: '#fff' }}>
          <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>👥 Total Members</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{stats?.totalMembers || 0}</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>Active members</div>
        </div>
      </div>

      <Card title="📄 Transaction History">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Date</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Member</th>
              <th style={{ padding: '12px 14px', textAlign: 'left', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Bill Info</th>
              <th style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Amount</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Method</th>
              <th style={{ padding: '12px 14px', textAlign: 'center', color: '#64748b', fontSize: 12, fontWeight: 700 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 20).map(t => (
              <tr key={t.payment_id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background .2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '12px 14px', fontSize: 12 }}>{new Date(t.created_at).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '12px 14px', fontWeight: 600 }}>{t.member?.name || 'Unknown'}</td>
                <td style={{ padding: '12px 14px', color: '#64748b', fontSize: 12 }}>{t.bill?.month_year || t.bill?.description || 'Maintenance Bill'}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>₹{Number(t.amount || 0).toLocaleString()}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center', fontSize: 12, color: '#64748b' }}>{t.payment_method || 'Cash'}</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                    {t.status === 'completed' ? 'Paid' : (t.status || 'Pending')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No transactions yet</div>}
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card title="📊 Financial Overview">
          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>💰 Income This Month</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>₹{stats?.collectedAmount ? Number(stats.collectedAmount).toLocaleString() : '0'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>📈 +5% from last month</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>⚠️ Pending Dues</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>₹{stats?.pendingAmount ? Number(stats.pendingAmount).toLocaleString() : '0'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>From {stats?.pendingBills || 0} members</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// -- LOGIN PAGE ---------------------------------------------
function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true); setError('');
    try { await login(form.email, form.password); }
    catch (e) { setError(e.response?.data?.error || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(135deg,#1a2744,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 40, width: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', fontSize: 11, padding: '3px 10px', borderRadius: 20, marginBottom: 8 }}>Society Management ERP</div>
          <h1 style={{ fontWeight: 700, fontSize: 22 }}>SocietyPro</h1>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Server: SERP · ADMIN\SQLEXPRESS</p>
        </div>
        {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}
        <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" />
        <PasswordInput label="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
        <button onClick={handleLogin} disabled={loading} style={{ width: '100%', padding: 12, background: '#1a2744', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

// -- MAIN APP -----------------------------------------------
const pageMap = { dashboard: Dashboard, members: Members, notices: Notices, billing: Billing, payments: Payments, bookings: Bookings, contacts: Contacts, vehicles: Vehicles, settings: Settings, amenities: Amenities, complaints: Complaints, funds: SocietyFunds, treasurer: TreasurerPanel, 'visitor-approval': VisitorApproval, 'visitor-request': VisitorRequest, 'security-panel': SecurityGuardPanel, 'family-members': FamilyMembers };
const pageTitles = { dashboard: 'Dashboard', members: 'Member Management', notices: 'Notice Board', billing: 'Maintenance Billing', payments: 'Payment History', bookings: 'Amenity Booking', contacts: 'Important Contacts', vehicles: 'Vehicle Registry', settings: 'Settings', amenities: 'Amenities Management', complaints: 'Complaints & Feedback', funds: 'Society Funds', treasurer: 'Treasurer Panel', 'visitor-approval': 'Visitor Approvals', 'visitor-request': 'Visitor Entry Request', 'security-panel': 'Security Monitor Dashboard', 'family-members': 'Family Members' };

function AppInner() {
  const { user } = useAuth();
  const [active, setActive] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [audioRef] = useState(new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj=='));
  const notifIntervalRef = React.useRef(null);

  // Poll for visitor request notifications
  useEffect(() => {
    const pollNotifications = async () => {
      try {
        const res = await API.get(`/visitors?member_id=${user?.member_id}`);
        const pending = res.data?.filter(v => v.status === 'pending') || [];
        if (pending.length > unreadCount) {
          // New notification arrived
          audioRef.play().catch(() => {});
          setNotifications(pending);
          setUnreadCount(pending.length);
        } else {
          setNotifications(pending);
          setUnreadCount(pending.length);
        }
      } catch (e) {
        // Silent fail
      }
    };

    if (user?.member_id && active !== 'visitor-approval') {
      pollNotifications(); // Check immediately
      notifIntervalRef.current = setInterval(pollNotifications, 3000); // Check every 3 seconds
    }

    return () => {
      if (notifIntervalRef.current) clearInterval(notifIntervalRef.current);
    };
  }, [user?.member_id, active, unreadCount]);

  const Page = pageMap[active];

  if (!user) return <Login />;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar active={active} setActive={setActive} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h1 style={{ fontSize: 17, fontWeight: 600 }}>{pageTitles[active]}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {unreadCount > 0 && (
              <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActive('visitor-approval')}>
                <span style={{ fontSize: 20 }}>🔔</span>
                <div style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{unreadCount}</div>
              </div>
            )}
            <div style={{ fontSize: 12, color: '#64748b' }}>SERP · {user.name} · {user.flat_no}</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#f1f5f9' }}>
          <Page setActive={setActive} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}

