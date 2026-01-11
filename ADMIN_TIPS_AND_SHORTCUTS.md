# ⌨️ Admin Panel - Tips & Shortcuts

## 🎯 Quick Tips

### 1. Login Shortcuts
- **Demo Credentials**: Shown on login form
- **Auto-fill**: Click the demo credentials to auto-fill form
- **Remember Me**: Token persists for 24 hours

### 2. Navigation Tips
- **Sidebar**: Always visible on desktop, hidden on mobile
- **Active Link**: Current page is highlighted in gold
- **Quick Links**: Jump between sections via sidebar

### 3. Search & Filter Tips
- **Global Search**: Use Ctrl+F to search on page
- **User Search**: Instant filtering as you type
- **Status Filter**: Dropdown to filter by payment status
- **Case Insensitive**: Searches work with any case

### 4. Table Tips
- **Sort**: Click column headers to sort (if implemented)
- **Scroll**: On mobile, tables scroll horizontally
- **Delete**: Confirmation dialog prevents accidental deletion
- **View**: Eye icon shows full details (in future)

## ⌨️ Keyboard Shortcuts

### Browser DevTools
```
F12              - Open Developer Tools
Ctrl+J           - Open Console
Ctrl+Shift+I     - Inspect Element
Ctrl+Shift+K     - Open Console (Firefox)
Cmd+Option+I     - Open DevTools (Mac)
```

### Browser Navigation
```
Alt+←            - Go Back
Alt+→            - Go Forward
Ctrl+R           - Refresh Page
Ctrl+Shift+R     - Hard Refresh (clear cache)
Ctrl+L           - Go to Address Bar
Ctrl+T           - New Tab
Ctrl+W           - Close Tab
```

### Text Editing
```
Ctrl+A           - Select All
Ctrl+C           - Copy
Ctrl+V           - Paste
Ctrl+X           - Cut
Ctrl+Z           - Undo
Ctrl+Y           - Redo
```

## 💾 Local Storage Commands

### View Stored Data
Open DevTools → Application → Local Storage → http://localhost:5173

### Manual Token Management
```javascript
// View token
localStorage.getItem('admin_token')

// View admin email
localStorage.getItem('admin_email')

// Clear all data
localStorage.clear()

// Logout (via console)
localStorage.removeItem('admin_token');
localStorage.removeItem('admin_email');
window.location.href = '/admin/login';
```

## 🔍 Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (login, search, etc.)
4. View request details and response

### Check Console Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Click to expand error stack trace

### Check React Components
1. Install React Developer Tools extension
2. Open DevTools
3. Go to Components tab
4. Inspect component hierarchy
5. View component props and state

### Check Local Storage
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. View stored tokens and data
5. Delete items to test reload behavior

## 🚀 Advanced Features

### API Request Examples

#### Login
```javascript
// Using fetch
const response = await fetch('http://localhost:5000/api/auth/admin-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@basho.com',
    password: 'admin123'
  })
});
const data = await response.json();
console.log(data);
```

#### Get Users with Token
```javascript
// Using fetch with authorization
const token = localStorage.getItem('admin_token');
const response = await fetch('http://localhost:5000/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const users = await response.json();
console.log(users);
```

#### Delete User
```javascript
// Using DELETE method
const token = localStorage.getItem('admin_token');
const userId = '...'; // user ID

const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
const result = await response.json();
console.log(result);
```

## 🔐 Security Best Practices

### ✅ DO
- [ ] Change default admin credentials immediately
- [ ] Use strong passwords (mix of uppercase, lowercase, numbers, symbols)
- [ ] Keep JWT secret secure
- [ ] Logout when leaving computer
- [ ] Clear browser cache if on public computer
- [ ] Use HTTPS in production
- [ ] Regularly update dependencies

### ❌ DON'T
- [ ] Share admin credentials via email
- [ ] Use simple passwords like 'admin123' (in production)
- [ ] Leave browser logged in on shared computers
- [ ] Store tokens in regular variables (use secure methods)
- [ ] Expose JWT secret in frontend code
- [ ] Use admin panel on unsecured networks
- [ ] Ignore security warnings

## 📱 Mobile Optimization

### Mobile View Tips
- **Sidebar**: Hidden on screens < 768px
- **Tables**: Swipe horizontally to see more columns
- **Forms**: Full width for better accessibility
- **Touch**: Buttons sized for touch-friendly clicks

### Testing on Mobile
```
Chrome DevTools:
1. Press F12
2. Click device icon (or Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test responsive behavior
```

## 🎯 Useful Browser Extensions

### Recommended
- **React Developer Tools** - Inspect React components
- **Redux DevTools** - (if Redux added later)
- **JSON Formatter** - Pretty-print API responses
- **EditThisCookie** - View/edit cookies
- **Postman** - Test API endpoints directly

## 🐛 Common Issues & Solutions

### Issue: Lost Admin Access
**Solution**:
```javascript
// If you know the correct credentials, clear and login again
localStorage.clear();
window.location.href = '/admin/login';
```

### Issue: Token Expired
**Solution**:
- Log out and log back in
- Token automatically refreshes (if implemented)
- Check token expiry in JWT payload

### Issue: Page Not Updating
**Solution**:
```javascript
// Hard refresh
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Issue: API Not Responding
**Check**:
1. Backend server is running
2. Correct port (5000)
3. MongoDB is connected
4. Network tab shows requests

## 📊 Performance Optimization

### Reduce Loading Time
- Use browser cache (Ctrl+Shift+R to clear if needed)
- Load only necessary data
- Lazy load components
- Compress images
- Minimize CSS/JS

### Monitor Performance
```javascript
// Check page load time in console
performance.timing.loadEventEnd - performance.timing.navigationStart
```

## 🔗 Useful Links

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Admin Panel: `http://localhost:5173/admin/login`

### Documentation
- See `ADMIN_QUICK_START.md` for setup
- See `ADMIN_PANEL_GUIDE.md` for features
- See `ADMIN_VISUAL_GUIDE.md` for layouts

### External Resources
- React Router: https://reactrouter.com/
- JWT: https://jwt.io/
- MongoDB: https://www.mongodb.com/

## 🎓 Learning Resources

### Understand JWT
```
JWT consists of 3 parts: header.payload.signature
Example: eyJhbGc....(header)
         eyJzdWI....(payload with data)
         SflKxw....(signature for verification)

Verify at: https://jwt.io/
```

### Test APIs with cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@basho.com","password":"admin123"}'

# Get users
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📈 Monitoring & Logs

### Check Backend Logs
- Server logs appear in terminal where `node server.js` runs
- Look for POST requests to `/api/auth/admin-login`
- Check for errors in database connections

### Check Frontend Logs
1. Open Browser Console (F12)
2. Look for 'ADMIN LOGIN BODY' messages
3. Check for any fetch errors
4. Monitor network requests

## ⚡ Performance Tips

### Speed Up Login
- Pre-fill email field if available
- Use debouncing on password field
- Cache login state

### Speed Up Data Loading
- Implement pagination (show 10 items per page)
- Add loading skeletons
- Cache API responses
- Use pagination for tables

### Reduce Bandwidth
- Compress images
- Minify CSS/JS
- Lazy load tables
- Load data on demand

## 🎨 Customization Ideas

### Quick Customizations
```css
/* Change primary color */
:root {
  --primary-color: #ffd700;  /* Change this */
}

/* Make sidebar wider */
.sidebar {
  width: 300px;  /* Change from 250px */
}

/* Increase font size */
body {
  font-size: 16px;  /* Change from 14px */
}
```

### Add New Features
- [ ] Export data to CSV
- [ ] Add charts/graphs
- [ ] Implement notifications
- [ ] Add bulk operations
- [ ] Create custom reports

## 📞 Getting Help

### Troubleshooting Steps
1. Check browser console for errors (F12)
2. Check backend logs in terminal
3. Verify backend is running
4. Clear cache and refresh
5. Check network requests (Network tab)
6. Read documentation files
7. Review code comments

### Debugging Workflow
```
Issue Found
    ↓
Check Browser Console
    ↓
Check Network Tab
    ↓
Check Backend Logs
    ↓
Check Code Comments
    ↓
Read Documentation
    ↓
Try Solution
    ↓
Works? → Done!
    ↓ No
Repeat...
```

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Ready to Use
