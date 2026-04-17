import re

# Read the file with explicit UTF-8 encoding
with open('d:\\Project\\ERP\\SocietyPro-ERP-FIXED\\society-erp\\frontend\\src\\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the shortcuts section and logic - find from "const shortcuts = [" to the closing of the last if statement
old_pattern = r'  const shortcuts = \[[\s\S]*?if \(\[\'admin\', \'chairman\'\]\.includes\(user\?\.role\)\) \{\s*shortcuts\.push\(\{ icon: \'💰\', label: \'Funds\', action: \'funds\' \}\);\s*shortcuts\.push\(\{ icon: \'⚙️\', label: \'Settings\', action: \'settings\' \}\);\s*shortcuts\.push\(\{ icon: \'📊\', label: \'Treasurer\', action: \'treasurer\' \}\);\s*\}'

new_code = '''  const shortcuts = [
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
  }'''

if re.search(old_pattern, content, flags=re.MULTILINE):
    content = re.sub(old_pattern, new_code, content, flags=re.MULTILINE)
    print("✅ Pattern matched and replaced")
else:
    print("❌ Pattern not found, trying alternative approach...")
    # Try a simpler approach - just replace the array definition
    simpler_pattern = r'const shortcuts = \[.*?\];[\s\S]*?shortcuts\.push\(\{ icon: \'📊\', label: \'Treasurer\', action: \'treasurer\' \}\);\s*\}'
    if re.search(simpler_pattern, content):
        content = re.sub(simpler_pattern, new_code, content)
        print("✅ Alternative pattern matched and replaced")
    else:
        print("❌ Alternative pattern also not found")

# Write back with UTF-8 encoding
with open('d:\\Project\\ERP\\SocietyPro-ERP-FIXED\\society-erp\\frontend\\src\\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ File updated successfully")
