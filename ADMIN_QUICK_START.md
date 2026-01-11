# 🎯 Admin Panel - Quick Start Guide

## 5-Minute Setup

### Step 1: Start Your Backend
```bash
cd basho-backend
npm install  # if needed
node server.js
```

Expected output:
```
Server is running on port 5000
Connected to MongoDB
```

### Step 2: Start Your Frontend
In a new terminal:
```bash
cd BASHO-website
npm install  # if needed
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
```

### Step 3: Access Admin Login
Open your browser and go to:
```
http://localhost:5173/admin/login
```

### Step 4: Login with Demo Credentials
```
Email: admin@basho.com
Password: admin123
```

### Step 5: Explore the Admin Panel! 🎉
You should now see:
- Dashboard with stats
- Sidebar navigation
- User management
- Workshop management
- Settings page

---

## 📍 Admin URLs

| Page | URL |
|------|-----|
| Login | `http://localhost:5173/admin/login` |
| Dashboard | `http://localhost:5173/admin/dashboard` |
| Users | `http://localhost:5173/admin/users` |
| Workshops | `http://localhost:5173/admin/workshops` |
| Settings | `http://localhost:5173/admin/settings` |

---

## ⚙️ Configuration (Optional)

### Change Admin Credentials
Edit your `.env` file in `basho-backend/`:
```env
ADMIN_EMAIL=your-email@basho.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
```

Then restart the backend server.

---

## 🎨 Key Features

### 📊 Dashboard
- **User Count**: Total registered users
- **Workshop Count**: Total workshop bookings
- **Product Count**: Total products
- **Revenue**: Total revenue from completed payments
- **Recent Bookings**: Table of latest 5 bookings

### 👥 Users Management
- View all users in a table
- **Search** by name or email
- **Delete** user accounts with confirmation
- See user registration dates
- User count display

### 📚 Workshops Management
- View all workshop bookings
- **Filter** by payment status (All, Pending, Completed, Failed)
- **Search** by workshop name or email
- Delete bookings with confirmation
- View participant details and payment status
- Display booking amount

### ⚙️ Settings
- View account information
- Change admin password securely
- View system information and versions
- Access help & support resources

### 🔐 Security
- JWT-based authentication
- Automatic session persistence
- Protected routes
- Automatic logout button
- Secure password change option

---

## 🚨 Troubleshooting

### Problem: Login page shows error
**Solution**: Make sure backend is running on port 5000

### Problem: Can't see user/workshop data
**Solution**: Check that your MongoDB is connected and has data

### Problem: Getting redirected to login repeatedly
**Solution**: Clear localStorage and login again:
```javascript
// In browser console
localStorage.clear();
window.location.href = '/admin/login';
```

### Problem: "Cannot find module jwt"
**Solution**: Install required packages in backend:
```bash
cd basho-backend
npm install jsonwebtoken
```

---

## 📦 What Was Created

### Frontend Components (10 files)
✅ AdminLogin - Login form with JWT handling
✅ AdminProtectedRoute - Route protection wrapper
✅ Sidebar - Navigation sidebar
✅ AdminHeader - Page header
✅ AdminLayout - Main layout wrapper
✅ AdminDashboard - Dashboard with stats
✅ AdminUsers - Users management
✅ AdminWorkshops - Workshops management
✅ AdminSettings - Settings page
✅ Multiple CSS files for styling

### Backend Updates (1 file)
✅ authRoutes.js - Added `/api/auth/admin-login` endpoint

### App Configuration
✅ App.jsx - Updated with admin routes and protection

---

## 🎯 Next Steps

1. **Explore the Dashboard** - See your site's statistics
2. **Manage Users** - View and delete user accounts
3. **Check Workshops** - Review booking statuses
4. **Update Settings** - Change admin password
5. **Customize** - Modify colors, add more features

---

## 💡 Pro Tips

### Auto-logout
The admin panel doesn't have auto-logout yet. You can add it by:
1. Creating a timer when user logs in
2. Clearing token after X minutes of inactivity
3. Redirecting to login page

### Add More Pages
1. Copy an existing admin page (e.g., AdminUsers.jsx)
2. Modify the component logic
3. Add route in App.jsx
4. Add link in Sidebar.jsx

### View Network Requests
Open DevTools (F12) → Network tab to see API calls and responses

### Local Storage Data
In DevTools → Application → Local Storage, you'll see:
- `admin_token` - Your JWT authentication token
- `admin_email` - Your admin email address

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12 → Console tab)
2. Check backend server logs
3. Verify both frontend and backend are running
4. Clear cache and refresh page
5. Check MongoDB connection status

---

## 🎉 You're All Set!

Your admin panel is ready to use. Enjoy managing your BASHO website! 🚀

**Need help?** Check the `ADMIN_PANEL_GUIDE.md` for detailed documentation.
