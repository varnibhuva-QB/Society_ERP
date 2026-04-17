# 🔐 Password Management & 🏢 Amenities Guide

## New Features Implemented

### 1. Password Management System

#### A. First-Time Login Password Change (Required for Security)

When an admin/chairman creates a new member account, that new member **must change their password on first login** for security purposes.

**How It Works:**
1. Admin creates a new member with temporary password (default: `Society@123`)
2. New member logs in with their credentials
3. **Forced Password Change Modal** appears with message: "For security, you must change your password on your first login."
4. User must enter:
   - Current password (temporary password they received)
   - New password (min 6 characters)
   - Confirm new password
5. After successful change, modal closes and they can access the dashboard
6. The `password_change_required` flag is set to `false` in the database

**Database Field:**
```
password_change_required: Boolean @default(false)
```
- `false` = Normal user, no mandatory change required
- `true` = Must change password on next login

---

#### B. Password Change in Settings

All users (members, chairman, admin) can change their password anytime from the Settings page.

**Steps:**
1. Click **Settings** in the sidebar OR dashboard shortcut
2. Scroll down to **Account Info** section
3. Click button **🔐 Change Password**
4. A modal appears with three fields:
   - **Current Password** - Their existing password
   - **New Password** - New password (min 6 characters)
   - **Confirm Password** - Re-enter new password to confirm
5. Click "Change Password" button
6. System validates:
   - Current password matches their account
   - New passwords match each other
   - New password is at least 6 characters long
7. Success message: "Password changed successfully"

**Security Validations:**
- ✅ Current password must match the stored hash
- ✅ New passwords must match exactly
- ✅ Minimum 6 characters required
- ✅ Password changes are logged in the database

---

### 2. Amenities Management System

Amenities are now fully persistent in the database with complete CRUD operations.

#### Database Model - Amenity Table

```
Amenity {
  amenity_id      Int      @id @default(autoincrement())
  name            String   @db.NVarChar(100)     // "Community Garden", "Tennis Court", etc.
  type            String   @db.NVarChar(50)      // "garden", "terrace", "parking", "gym", "pool"
  rent_amount     Decimal  @db.Decimal(10, 2)    // Hourly rate: 50, 100, 75, etc.
  description     String?  @db.NVarChar(300)     // "Beautiful community space for members..."
  is_active       Boolean  @default(true)        // Soft delete (deactivate instead of delete)
  created_at      DateTime @default(now())       // Track creation time
  updated_at      DateTime @updatedAt            // Auto-updated on changes
}
```

**API Endpoints:**
- `GET /api/amenities` - Fetch all active amenities
- `POST /api/amenities` - Create new amenity (admin/chairman only)
- `PUT /api/amenities/:id` - Update amenity (admin/chairman only)
- `DELETE /api/amenities/:id` - Delete/deactivate amenity (soft delete, admin/chairman only)

---

#### Amenities Page - User Interface

**For Members (View Only):**
- See all available amenities in a beautiful card grid
- Each card shows:
  - 📍 Amenity icon (based on type)
  - 📝 Amenity name
  - 📖 Description
  - 💰 Hourly rent price (₹50, ₹100, etc.)
- Can click to read full details
- Cannot edit or delete (read-only access)

**For Admin/Chairman (Full Management):**

##### View Amenities
- See all amenities with premium card design
- Each card includes edit and delete buttons
- Icons for visual identification

##### Add New Amenity
1. Click **+ Add Amenity** button
2. Modal form appears with fields:
   - **Amenity Name** - e.g., "Community Garden", "Tennis Court", "Rooftop Lounge"
   - **Type** - Dropdown: garden, terrace, parking, gym, pool (or custom)
   - **Rent (₹/hour)** - Hourly rate: 50, 75, 100, 150, 200, etc.
   - **Description** - e.g., "Beautiful garden with seating area and plants"
3. Click "Add Amenity" button
4. ✅ Amenity is immediately saved to database and appears in list

##### Edit Amenity (Change Rent)
1. On any amenity card, click **Edit** button
2. Modal opens with existing details pre-filled
3. Update any field (especially **Rent** amount)
4. Click "Update Amenity" button
5. ✅ Changes saved to database immediately
6. All current & future bookings reference the updated price

**Important:** When you change rent amount, it affects:
- New bookings made after the change
- Price calculation shows as: `hours × new_rent_amount`

##### Delete Amenity
1. On any amenity card, click **Delete** button
2. Confirmation dialog asks: "Delete this amenity?"
3. Click "Delete" to confirm
4. ✅ Amenity is deactivated (soft delete, not permanently removed)
5. Disappears from the amenities list
6. Historical bookings remain in database for records

---

#### Amenity Booking Integration

When users book an amenity, the system:
1. Loads the current list of amenities
2. Gets the **current rent_amount** from the Amenity table
3. Calculates price as: `selected_hours × amenity_rent_amount`
4. Shows dynamic price update as user changes hours
5. Records booking with amenity name/type and paid amount

**Example Workflow:**
```
1. Chairman adds "Community Garden" amenity at ₹50/hour
2. Member books garden for 3 hours
   → Price = 3 hours × ₹50 = ₹150
3. Chairman later changes garden rent to ₹75/hour
4. Next member books garden for 3 hours
   → Price = 3 hours × ₹75 = ₹225
```

---

### Testing the New Features

#### Test Scenario 1: First-Time Password Change (Forced)

**Prerequisites:** Admin account already logged in

**Steps:**
1. Go to **Dashboard → Members** (or sidebar)
2. Click **+ Add Member** button
3. Fill form with:
   - Name: "Test Member"
   - Email: "testmember@company.com"
   - Password: (leave empty, uses default)
   - Contact: "9876543210"
   - Flat No.: "201"
   - Blood Group: "O+"
   - Role: "member"
4. Click "Add Member"
5. **IMPORTANT:** System shows message: **"They must change password on first login"**
6. Logout from admin account
7. Login with new member credentials:
   - Email: `testmember@company.com`
   - Password: `Society@123` (default)
8. ✅ **Password change modal appears immediately** (cannot bypass)
9. Fill form:
   - Current Password: `Society@123`
   - New Password: `SecurePass@123`
   - Confirm: `SecurePass@123`
10. Click "Change Password"
11. ✅ Modal closes, dashboard loads
12. Member can now access all features
13. Try logging out and logging back in with new password ✅

---

#### Test Scenario 2: Password Change in Settings

**Steps:**
1. Login as any user (member, chairman, or admin)
2. Click **Settings** in sidebar or dashboard shortcut
3. Scroll to **Account Info** section
4. Click **🔐 Change Password** button
5. Password change modal opens
6. Fill form:
   - Current Password: (user's current password)
   - New Password: `MyNewPassword@456`
   - Confirm: `MyNewPassword@456`
7. Click "Change Password"
8. ✅ Success message: "Password changed successfully"
9. Logout completely
10. Try logging in with:
    - Old password: ❌ Should fail
    - New password: ✅ Should succeed

**Error Scenarios:**
- Wrong current password → "Current password is incorrect"
- New passwords don't match → "Passwords do not match"
- Password less than 6 chars → "Password must be at least 6 characters"

---

#### Test Scenario 3: Add Amenity (Chairman/Admin)

**Prerequisites:** Logged in as chairman or admin

**Steps:**
1. Go to **Amenities** page (sidebar or dashboard shortcut)
2. Click **+ Add Amenity** button (appears for admin/chairman only)
3. Modal form appears
4. Fill details:
   - **Amenity Name:** "Tennis Court"
   - **Type:** "parking" (dropdown)
   - **Rent:** "200"
   - **Description:** "Professional tennis court with night lights"
5. Click "Add Amenity"
6. ✅ Amenity appears in card grid below
7. Card shows: 🏢 Tennis Court | ₹200/hour | Full description

**Verify in Database:**
User can verify by checking:
- Amenities appear for all users
- Members see them (read-only)
- Chairman/Admin see edit/delete buttons

---

#### Test Scenario 4: Edit Amenity - Change Rent Price

**Prerequisites:** Amenities already exist

**Steps:**
1. Go to **Amenities** page
2. Find "Tennis Court" amenity  card
3. Click **Edit** button on the card
4. Modal opens with current values:
   - Name: "Tennis Court"
   - Type: "parking"
   - Rent: "200"
   - Description: "..."
5. Change **Rent amount** to "250"
6. Click "Update Amenity"
7. ✅ Modal closes
8. Card updates to show: ₹250/hour
9. When members book this amenity next, they'll see new price

---

#### Test Scenario 5: Delete Amenity

**Prerequisites:** Amenities exist

**Steps:**
1. Go to **Amenities** page
2. Find any amenity
3. Click **Delete** button on the card
4. Confirmation appears: "Delete this amenity?"
5. Click "Delete"
6. ✅ Amenity disappears from the list
7. Other users refresh page → amenity gone
8. New bookings cannot be made for deleted amenity

---

#### Test Scenario 6: Amenities in Booking

**Prerequisites:** 
- Logged in as member
- Amenities exist in database

**Steps:**
1. Go to **Book Amenity** page
2. In the form:
   - Select amenity dropdown → shows all active amenities ✅
   - Select "Tennis Court"
3. Select date
4. Select time slot
5. Enter **hours:** "4"
6. Price shows: **4 × ₹250 = ₹1000** ✅
7. Change hours to "2"
8. Price updates: **2 × ₹250 = ₹500** ✅
9. Try booking
10. ✅ Booking recorded with current amenity price

---

### Database Queries (For Verification)

**View all amenities:**
```sql
SELECT * FROM [Amenity] WHERE is_active = 1;
```

**View member password change requirement:**
```sql
SELECT member_id, name, email, password_change_required 
FROM [Member] 
WHERE password_change_required = 1;
```

**View all bookings with amenity prices:**
```sql
SELECT b.booking_id, b.member_id, b.amenity_type, b.amount, a.rent_amount 
FROM [AmenityBooking] b
LEFT JOIN [Amenity] a ON b.amenity_type = a.type;
```

---

### Security Notes

1. **Password Storage:**
   - All passwords hashed with bcryptjs (12 salt rounds)
   - Stored in `password_hash` field
   - Never transmitted in plain text

2. **First-Time Change:**
   - Modal cannot be closed without changing password
   - Prevents weak default passwords remaining in system
   - Mandatory security best practice

3. **Amenity Management:**
   - Only admin/chairman can add/edit/delete
   - Members have read-only access
   - All changes logged with timestamps

4. **Token Expiry:**
   - JWT tokens expire after 7 days
   - Users must re-login for security
   - Password changes don't invalidate current token (session continues)

---

### Troubleshooting

**Issue:** "Current password is incorrect" when changing password
- **Solution:** Verify you're entering the right current password (case-sensitive)

**Issue:** Amenities not appearing even after adding
- **Solution:** 
  - Refresh the page (F5)
  - Check if you're logged in as admin/chairman
  - Verify amenity is `is_active = 1` in database

**Issue:** Can't change password on first login
- **Solution:**
  - Modal is mandatory - cannot be skipped
  - Current password must be `Society@123` (default)
  - New password must be at least 6 characters

**Issue:** Old amenity price still showing in bookings
- **Solution:**
  - Each booking stores the price at time of booking
  - Changing amenity rent only affects NEW bookings
  - This is intentional for accurate billing history

---

## Summary

✅ **Password Management:**
- First-time mandatory password change for new members
- Settings panel password change for all users
- Full validation and error handling
- Secure bcryptjs hashing

✅ **Amenities Management:**
- Complete CRUD operations (Create, Read, Update, Delete)
- Database persistence with Amenity table
- Admin/Chairman only management
- Members can view all amenities
- Dynamic pricing in booking system
- Soft delete (maintain history)

✅ **All Features Tested:**
- Backend API endpoints working
- Frontend UI responsive
- Database migrations successful
- Authentication & authorization in place
- Error handling & validation complete

🎉 **Ready for Production Use!**
