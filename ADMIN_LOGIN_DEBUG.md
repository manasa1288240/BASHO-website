# 🔧 Admin Login - Troubleshooting Guide

## Error: "Connection error: Unexpected token '<'"

This error means the backend is returning HTML instead of JSON.

### 🎯 Fix Steps (in order)

#### 1. Verify Backend is Running

Open a PowerShell terminal and run:
```powershell
cd "C:\Users\sruth\OneDrive\Desktop\new\BASHO-website\basho-backend"
node server.js
```

**Expected output** (you should see):
```
✅ Server running on port 5000
```

**If you see an error**, copy it and check below.

---

#### 2. Check if Port 5000 is Available

If the server won't start, port 5000 might be in use:

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# If something is using it, kill the process:
# taskkill /PID <PID_NUMBER> /F
```

---

#### 3. Verify Backend Dependencies

Make sure all packages are installed:

```powershell
cd "C:\Users\sruth\OneDrive\Desktop\new\BASHO-website\basho-backend"
npm install
```

Key dependencies needed:
- ✅ express
- ✅ cors
- ✅ jsonwebtoken
- ✅ dotenv

---

#### 4. Test the Endpoint Directly

Once backend is running, test the endpoint:

**Using PowerShell (Invoke-RestMethod)**:
```powershell
$body = @{
    email = "admin@basho.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/auth/admin-login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body $body
```

**Expected response**:
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGc...",
  "email": "admin@basho.com"
}
```

If you don't get JSON back, the endpoint isn't working.

---

#### 5. Check Backend Console Logs

When you run `node server.js`, watch for:

**Good Signs**:
```
✅ Server running on port 5000
```

**Bad Signs**:
```
Error: Cannot find module 'jsonwebtoken'
⚠️ MongoDB connection failed
```

**Solution for MongoDB error**: That's OK - the admin login works without MongoDB. The server should still start with the warning message.

---

#### 6. Check .env File

Verify `.env` has these lines in `basho-backend/`:

```
ADMIN_EMAIL=admin@basho.com
ADMIN_PASSWORD=admin123
JWT_SECRET=your-jwt-secret-key-change-this-in-production
```

If missing, add them!

---

## ✅ Complete Setup Checklist

- [ ] Backend installed: `npm install`
- [ ] jsonwebtoken installed: `npm install jsonwebtoken`
- [ ] .env file has ADMIN_EMAIL and ADMIN_PASSWORD
- [ ] Backend running: `node server.js`
- [ ] Backend shows "Server running on port 5000"
- [ ] Frontend running: `npm run dev`
- [ ] Can open: `http://localhost:5173/admin/login`
- [ ] Can login with: admin@basho.com / admin123

---

## 🔍 Debug Steps

### Step 1: Check Backend is Responding

Open your browser DevTools (F12) → Console, then try to login.

**You should see logs** like:
```
Attempting login with: admin@basho.com
Response status: 200
Response data: { message: "Admin login successful", token: "...", email: "admin@basho.com" }
```

### Step 2: Check Network Request

In DevTools → Network tab:
1. Try to login
2. Look for request to `admin-login`
3. Click on it
4. Check **Response tab** - should show JSON, not HTML

### Step 3: Check Server Terminal

In the terminal where `node server.js` is running:

You should see:
```
ADMIN LOGIN BODY ---> { email: 'admin@basho.com', password: 'admin123' }
```

If not appearing, the request isn't reaching the backend.

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot POST /api/auth/admin-login"
**Cause**: Backend endpoint not found
**Solution**: 
1. Verify server.js has: `app.use("/api/auth", authRoutes);`
2. Restart backend server
3. Check authRoutes.js has the `admin-login` endpoint

### Issue: "Connection refused"
**Cause**: Backend not running or wrong port
**Solution**:
1. Check backend console shows "Server running on port 5000"
2. Verify frontend is calling `http://localhost:5000`
3. Restart both servers

### Issue: "MongoDB connection failed" warning
**Cause**: IP not whitelisted in MongoDB Atlas
**Solution**: This is OK! Admin login works without DB.

### Issue: JSON parsing error
**Cause**: Server returned HTML instead of JSON
**Solution**:
1. Check server console for errors
2. Verify endpoint code has `res.json({...})`
3. Check Content-Type header is `application/json`

---

## 🚀 Quick Fix (If Still Stuck)

Run these commands in order:

**Terminal 1:**
```powershell
cd "C:\Users\sruth\OneDrive\Desktop\new\BASHO-website\basho-backend"
npm install jsonwebtoken
node server.js
```

Wait for it to say "Server running on port 5000"

**Terminal 2:**
```powershell
cd "C:\Users\sruth\OneDrive\Desktop\new\BASHO-website"
npm run dev
```

Then:
1. Open: `http://localhost:5173/admin/login`
2. Type: `admin@basho.com`
3. Type: `admin123`
4. Click Sign In
5. Check browser console (F12) for messages

---

## 📞 If Nothing Works

1. **Take screenshot** of the error
2. **Copy backend console output** (what shows when you run `node server.js`)
3. **Copy browser console** (F12 → Console tab)
4. **Copy Network response** (F12 → Network → admin-login request → Response tab)

This will show what's wrong!

---

**Remember**: The admin login endpoint works WITHOUT MongoDB, so don't worry about the DB connection warning. Focus on making sure the backend server starts and listens on port 5000.
