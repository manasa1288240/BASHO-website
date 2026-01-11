# 🎉 Admin Panel Phase 2 - Complete Setup Guide

## Overview
Your admin panel has been expanded with comprehensive management features for all backend requirements. All new pages, routes, models, and API endpoints are ready to use!

---

## ✅ What's Been Created

### Frontend Pages (7 New Components)
1. **AdminProducts.jsx** - Product management (add/edit/delete/search)
2. **AdminOrders.jsx** - Order management with status tracking
3. **AdminPayments.jsx** - Payment & revenue tracking dashboard
4. **AdminCustomers.jsx** - Customer database with CRUD operations
5. **AdminEvents.jsx** - Event & exhibition management
6. **AdminGallery.jsx** - Gallery image management with featured items
7. **AdminTestimonials.jsx** - Testimonial approval & management

### CSS Files (7 Responsive Stylesheets)
- All components have full responsive design (mobile, tablet, desktop)
- Consistent gold (#ffd700) and dark blue (#1e1e2e) theme
- Cards, tables, forms, and filters with smooth animations

### Backend Models (5 New Database Schemas)
1. **Order.js** - Order with customer info, items, status, amount
2. **Payment.js** - Payment records with Razorpay integration details
3. **Gallery.js** - Gallery items with category and featured flag
4. **Event.js** - Events with date, location, capacity, registrations
5. **Testimonial.js** - Testimonials with status (pending/approved/rejected) and featured flag

### Backend Routes (5 New Route Files)
1. **orderRoutes.js** - CRUD for orders with status updates
2. **paymentAdminRoutes.js** - Payment viewing and statistics
3. **galleryRoutes.js** - Full gallery management with categories
4. **eventRoutes.js** - Already existed, routes ready
5. **testimonialRoutes.js** - Full testimonial workflow (approve/reject/feature)

### Middleware
- **authMiddleware.js** - JWT token verification for protected routes

### Updated Files
1. **App.jsx** - All new routes registered
2. **Sidebar.jsx** - Navigation links for all 7 new pages with emoji icons
3. **server.js** - All new routes registered in backend

---

## 🚀 Quick Start

### 1. Verify Backend is Running
```bash
cd basho-backend
npm install  # Make sure all packages installed
npm start
```

You should see: `Server running on http://localhost:5000`

### 2. Access Admin Panel
- Login URL: http://localhost:5173/admin/login
- Email: `admin@basho.com` (from .env)
- Password: Your ADMIN_PASSWORD from .env

### 3. Navigate the Admin Panel
Once logged in, sidebar shows:
```
📊 Dashboard
👥 Users
📚 Workshops
📦 Products
🛒 Orders
💳 Payments
🧑 Customers
🎭 Events
🖼️ Gallery
⭐ Testimonials
⚙️ Settings
```

---

## 📋 Feature Details

### Products Page
- **Features**: Add/edit/delete products, search, product grid
- **Form Fields**: Name, description, price, category, image URL, stock
- **API**: `/api/products` (GET, POST, PUT, DELETE)
- **Search**: By product name

### Orders Page
- **Features**: View orders, filter by status, update status, see customer details
- **Status Types**: Pending, Processing, Shipped, Delivered, Cancelled
- **Displays**: Customer info, items, total amount, shipping address
- **Stats**: Total orders, status breakdowns

### Payments Page
- **Features**: Revenue tracking, payment method breakdown, transaction details
- **Stats**: Total revenue, transaction count, successful payments
- **Filter**: By payment method (Razorpay, Card, UPI, Wallet, COD)
- **Details**: Expandable modal with full payment info

### Customers Page
- **Features**: Customer database, edit customer info, delete customers
- **Edit Mode**: Inline editing of name, email, phone, address
- **Search**: By name, email, or phone
- **Filter**: All users or by role

### Events Page
- **Features**: Create/edit/delete events, manage event details
- **Form Fields**: Title, date, location, capacity, image, status, description
- **Status Types**: Upcoming, Ongoing, Completed
- **Display**: Event cards with image, date, location, capacity

### Gallery Page
- **Features**: Add/edit/delete images, categorize, mark as featured
- **Categories**: Products, Workshops, Events, About Us
- **Featured System**: Star button to mark showcase images
- **Search**: By image title
- **Filter**: By category

### Testimonials Page
- **Features**: Approve/reject testimonials, mark as featured, delete
- **Status**: Pending Review → Approve/Reject workflow
- **Rating System**: 1-5 star ratings
- **Featured Testimonials**: Displayed on homepage
- **Stats**: Total, pending, approved, featured, rejected counts

---

## 🔌 API Endpoints Reference

### Orders
```
GET  /api/orders          - Get all orders
GET  /api/orders/:id      - Get single order
POST /api/orders          - Create order (admin only)
PUT  /api/orders/:id      - Update order status (admin only)
DELETE /api/orders/:id    - Delete order (admin only)
```

### Payments
```
GET /api/payments         - Get all payments (admin only)
GET /api/payments/stats/overview - Revenue stats
GET /api/payments/:id     - Get single payment
```

### Gallery
```
GET /api/gallery          - Get all items
GET /api/gallery/featured - Get featured items
GET /api/gallery/category/:category - Get by category
POST /api/gallery         - Add image (admin only)
PUT /api/gallery/:id      - Update image (admin only)
DELETE /api/gallery/:id   - Delete image (admin only)
```

### Events
```
GET /api/events           - Get all events
GET /api/events/upcoming  - Get upcoming events
GET /api/events/:id       - Get single event
POST /api/events          - Create event (admin only)
PUT /api/events/:id       - Update event (admin only)
DELETE /api/events/:id    - Delete event (admin only)
POST /api/events/:id/register - Register for event
```

### Testimonials
```
GET /api/testimonials     - Get approved testimonials (public)
GET /api/testimonials/admin/all - All testimonials (admin only)
GET /api/testimonials/featured - Get featured testimonials
POST /api/testimonials    - Submit testimonial
PUT /api/testimonials/:id - Update testimonial (admin only)
POST /api/testimonials/:id/approve - Approve (admin only)
POST /api/testimonials/:id/reject - Reject (admin only)
DELETE /api/testimonials/:id - Delete (admin only)
```

---

## 🎯 Admin Workflow Examples

### Managing Products
1. Click "Products" in sidebar
2. Click "+ Add Product" button
3. Fill form (name, price, category, image URL, stock)
4. Click "Create Product"
5. Use search to filter products
6. Click "Edit" or "Delete" on product card

### Processing Orders
1. Click "Orders" in sidebar
2. View all orders with stats
3. Click status dropdown on order to change status
4. Filter by status (pending, processing, shipped, etc.)
5. See customer address and item details

### Managing Testimonials
1. Click "Testimonials" in sidebar
2. See pending count
3. Click "✓ Approve" on pending testimonials
4. Featured testimonials appear on homepage
5. Click "⭐ Make Featured" to highlight approved ones

### Gallery Management
1. Click "Gallery" in sidebar
2. Use category filter to organize images
3. Click "+ Add Image" button
4. Add title, image URL, category, description
5. Check "Mark as Featured" for showcase images
6. Click star icon to toggle featured status

---

## 💾 Database Models

### Order
```javascript
{
  customerName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  items: [{name, quantity, price}],
  totalAmount: Number,
  paymentMethod: String,
  status: 'pending|processing|shipped|delivered|cancelled',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```javascript
{
  orderId: String,
  customerName: String,
  email: String,
  phone: String,
  amount: Number,
  paymentMethod: 'razorpay|card|upi|wallet|cash',
  status: 'pending|successful|failed|refunded',
  razorpayId: String,
  signature: String,
  itemCount: Number,
  type: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Gallery
```javascript
{
  title: String,
  image: String (URL),
  category: 'products|workshops|events|about',
  description: String,
  featured: Boolean,
  displayOrder: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Event
```javascript
{
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  image: String,
  status: 'upcoming|ongoing|completed',
  registrations: [{customerName, email, phone, registeredAt}],
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial
```javascript
{
  customerName: String,
  email: String,
  text: String,
  rating: 1-5,
  productOrServiceName: String,
  status: 'pending|approved|rejected',
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication

All admin endpoints (except public testimonials/gallery/events) require JWT token:

```javascript
// Token automatically added by frontend
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

Token stored in localStorage as `admin_token` after login.

---

## 📱 Responsive Design

All pages are fully responsive:
- **Desktop**: Multi-column grids, full tables
- **Tablet**: 2-column layout, simplified tables
- **Mobile**: Single column, stacked cards, touch-friendly buttons

---

## 🎨 UI/UX Features

- **Color Theme**: Gold (#ffd700) accents with dark blue (#1e1e2e) text
- **Animations**: Smooth hover effects, card elevation on hover
- **Status Badges**: Color-coded status indicators
- **Loading States**: Loading messages and spinners
- **Error Handling**: User-friendly error messages
- **Search & Filter**: Real-time filtering
- **Confirmation Dialogs**: Before destructive actions (delete)

---

## ⚠️ Important Notes

1. **Models**: Order.js, Payment.js, Gallery.js, Event.js, Testimonial.js must be imported in routes
2. **Middleware**: authMiddleware.js required for token verification
3. **Environment Variables**: JWT_SECRET must be in .env
4. **CORS**: Backend already configured for frontend origin
5. **Database**: All models will auto-create collections on first use

---

## 🔧 Troubleshooting

### "Cannot find module" errors
- Run `npm install` in basho-backend
- Check imports in routes match model names exactly

### Routes not working
- Verify routes registered in server.js
- Check JWT token in localStorage
- Verify bearer token format: `Bearer {token}`

### Data not showing
- Check admin is logged in with valid token
- Verify API endpoints in browser dev tools (Network tab)
- Check MongoDB connection (check server logs)

---

## 📝 Next Steps

1. ✅ Test each page in admin panel
2. ✅ Verify search/filter functionality
3. ✅ Test CRUD operations (Create, Read, Update, Delete)
4. ✅ Add real data to test
5. ✅ Configure MongoDB collections if needed
6. ✅ Test on mobile responsiveness

---

## 📞 Support Features

Each admin page includes:
- Real-time search
- Multiple filters
- Status indicators
- Action buttons
- Form validation
- Error messages
- Empty state handling

---

**Admin Panel Phase 2 is complete! 🚀**

All 7 new management pages are ready to use. Start with the Products page to familiarize yourself with the CRUD workflow, then explore other pages.

Good luck! 🎉
