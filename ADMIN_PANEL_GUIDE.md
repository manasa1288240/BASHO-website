# BASHO Admin Panel - Setup & Usage Guide

## 📋 Overview

The BASHO admin panel provides a complete management system for your website including:
- **Dashboard**: View statistics and recent bookings
- **Users Management**: View, search, and manage user accounts
- **Workshops Management**: View and manage workshop bookings
- **Settings**: Account settings and security features

## 🔐 Authentication

### Demo Admin Credentials
```
Email: admin@basho.com
Password: admin123
```

> **Note**: These are demo credentials. For production, update them in the `.env` file:
```
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

## 🚀 Getting Started

### 1. Access Admin Login
Navigate to: `http://localhost:5173/admin/login`

### 2. Login with Credentials
Enter your admin email and password. Upon successful login, you'll be redirected to the dashboard.

### 3. JWT Token Storage
Your authentication token is automatically stored in localStorage and persists across page refreshes.

## 📱 Admin Panel Pages

### Dashboard (`/admin/dashboard`)
Displays:
- Total Users count
- Total Workshops count
- Total Products count
- Total Revenue (from completed payments)
- Recent Workshop Bookings table

### Users (`/admin/users`)
Features:
- View all registered users
- Search by name or email
- Delete user accounts
- User registration dates

### Workshops (`/admin/workshops`)
Features:
- View all workshop bookings
- Filter by payment status (All, Pending, Completed, Failed)
- Search by workshop name or email
- View participant details
- Delete bookings
- Display payment amount and status

### Settings (`/admin/settings`)
Features:
- View account information
- Change admin password
- View system information
- Access help & support links

## 🔧 Component Structure

```
src/
├── pages/admin/
│   ├── AdminLogin.jsx          # Login form with JWT handling
│   ├── AdminLogin.css
│   ├── AdminLayout.jsx          # Main admin layout wrapper
│   ├── AdminLayout.css
│   ├── AdminDashboard.jsx       # Dashboard with stats
│   ├── AdminDashboard.css
│   ├── AdminUsers.jsx           # Users management
│   ├── AdminUsers.css
│   ├── AdminWorkshops.jsx       # Workshops management
│   ├── AdminWorkshops.css
│   ├── AdminSettings.jsx        # Admin settings
│   └── AdminSettings.css
├── components/admin/
│   ├── AdminProtectedRoute.jsx  # Route protection component
│   ├── Sidebar.jsx              # Navigation sidebar
│   ├── Sidebar.css
│   ├── AdminHeader.jsx          # Page header component
│   └── AdminHeader.css
```

## 🛡️ Route Protection

All admin routes are protected with `AdminProtectedRoute` component which:
1. Checks for `admin_token` in localStorage
2. Checks for `admin_email` in localStorage
3. Redirects unauthorized users to `/admin/login`

### Protected Routes
- `/admin/dashboard`
- `/admin/users`
- `/admin/workshops`
- `/admin/settings`

## 🔌 API Endpoints

### Admin Authentication
```
POST /api/auth/admin-login
Body: { email: string, password: string }
Response: { token: JWT, email: string, message: string }
```

### Backend Routes Used
- `GET /api/users` - Fetch all users (requires auth token)
- `GET /api/workshops` - Fetch all workshops (requires auth token)
- `GET /api/products` - Fetch all products (requires auth token)
- `DELETE /api/users/:id` - Delete user (requires auth token)
- `DELETE /api/workshops/:id` - Delete workshop (requires auth token)

## 🎨 Design Features

### Color Scheme
- **Primary**: #ffd700 (Gold)
- **Dark**: #1e1e2e (Dark Blue)
- **Background**: #f5f5f5 (Light Gray)
- **Success**: #28a745 (Green)
- **Danger**: #dc3545 (Red)

### Responsive Design
- Fully responsive on mobile devices
- Sidebar hides on screens < 768px
- Tables scroll horizontally on small screens

## 🔄 Session Management

### Login Session
1. User submits credentials
2. Backend validates and generates JWT token
3. Token stored in localStorage as `admin_token`
4. Email stored in localStorage as `admin_email`

### Logout
Click the logout button in sidebar to:
1. Clear `admin_token` from localStorage
2. Clear `admin_email` from localStorage
3. Redirect to login page

## ⚙️ Customization

### Add New Admin Pages
1. Create new page component in `src/pages/admin/`
2. Add corresponding CSS file
3. Import in `App.jsx`
4. Add route in the admin routes section
5. Add link in `Sidebar.jsx`

### Modify Admin Credentials
Update in `.env`:
```
ADMIN_EMAIL=your-email@basho.com
ADMIN_PASSWORD=your-password
JWT_SECRET=your-jwt-secret-key
```

## 🐛 Troubleshooting

### Login Not Working
1. Verify backend is running on `http://localhost:5000`
2. Check console for error messages
3. Ensure credentials match .env values
4. Clear localStorage and try again

### Protected Routes Redirecting to Login
1. Check if token exists in localStorage
2. Verify token hasn't expired
3. Check browser console for specific errors

### API Data Not Loading
1. Verify backend endpoints are returning data
2. Check network tab in browser DevTools
3. Ensure authorization header is sent with requests
4. Verify user role in database

## 📝 Notes

- Admin tokens expire after 24 hours
- All API requests include Bearer token authentication
- Admin panel uses MongoDB for data persistence
- Sidebar shows current page with highlighting
- All forms include error handling and loading states

## 🚀 Future Enhancements

- [ ] Admin user roles and permissions
- [ ] Product management CRUD
- [ ] Sales reports and analytics
- [ ] Email campaign management
- [ ] File upload for product images
- [ ] Two-factor authentication
- [ ] Admin activity logs
- [ ] Database backup functionality
