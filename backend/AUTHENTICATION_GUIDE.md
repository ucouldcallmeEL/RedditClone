# Authentication Backend Guide

## Overview
This guide explains the backend authentication system that has been implemented for the LoginAndSignup functionality.

## What Was Built

### 1. **Updated User Schema** (`schemas/user.js`)
   - Added `username` field (unique, optional)
   - Added `phone` field (unique, optional)
   - Made `email` optional (sparse unique index)
   - Made `password` optional (for phone-based signup)

### 2. **Authentication Utilities** (`utils/auth.js`)
   - `hashPassword()` - Hashes passwords using bcrypt
   - `comparePassword()` - Compares plain password with hashed password
   - `generateToken()` - Creates JWT tokens for authenticated users
   - `verifyToken()` - Verifies JWT tokens

### 3. **User Manager Extensions** (`managers/userManager.js`)
   - `findByEmail()` - Find user by email
   - `findByUsername()` - Find user by username
   - `findByEmailOrUsername()` - Find user by either email or username
   - `findByPhone()` - Find user by phone number
   - `checkEmailExists()` - Check if email exists
   - `checkUsernameExists()` - Check if username exists
   - `checkPhoneExists()` - Check if phone exists

### 4. **User Controller** (`controllers/userController.js`)
   All endpoints return JSON responses:
   
   - **POST `/api/users/login`** - Login with email/username and password
   - **POST `/api/users/signup/check-email`** - Check if email exists (before signup)
   - **POST `/api/users/signup`** - Create new user account
   - **POST `/api/users/reset-password/check`** - Check if user exists for password reset
   - **POST `/api/users/reset-password`** - Reset user password
   - **POST `/api/users/phone/signin`** - Sign in with phone number
   - **POST `/api/users/phone/signup`** - Sign up with phone number

### 5. **Authentication Middleware** (`middleware/auth.js`)
   - `authenticate` - Middleware to protect routes that require authentication

### 6. **Express Server** (`server.js`)
   - Sets up Express app with CORS
   - Connects to MongoDB
   - Registers user routes
   - Includes error handling

### 7. **Routes** (`routes/userRoutes.js`)
   - Defines all authentication endpoints

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Environment Variables (Optional)
Create a `.env` file in the backend directory:
```
JWT_SECRET=your-secret-key-here
PORT=5000
```

### Step 3: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### 1. Login
**POST** `/api/users/login`
```json
{
  "identifier": "user@example.com",  // or username
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "username": "username",
    "name": "User Name",
    ...
  }
}
```

### 2. Check Email (Before Signup)
**POST** `/api/users/signup/check-email`
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Email is available",
  "exists": false
}
```

### 3. Signup
**POST** `/api/users/signup`
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "name": "User Name"  // optional
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": { ... }
}
```

### 4. Check Reset Password
**POST** `/api/users/reset-password/check`
```json
{
  "identifier": "user@example.com"  // or username
}
```

**Response:**
```json
{
  "message": "Password reset link would be sent to your email",
  "exists": true
}
```

### 5. Reset Password
**POST** `/api/users/reset-password`
```json
{
  "identifier": "user@example.com",
  "newPassword": "newpassword123",
  "resetToken": "token-from-email"  // In production, verify this token
}
```

### 6. Phone Signin
**POST** `/api/users/phone/signin`
```json
{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": { ... },
  "isNewUser": false
}
```

### 7. Phone Signup
**POST** `/api/users/phone/signup`
```json
{
  "phone": "+1234567890",
  "name": "User Name",
  "username": "username",  // optional
  "password": "password123"  // optional
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing/invalid data)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found
- `409` - Conflict (email/username/phone already exists)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message here"
}
```

## Using Authentication Middleware

To protect routes that require authentication:

```javascript
const { authenticate } = require('../middleware/auth');

router.get('/protected-route', authenticate, (req, res) => {
  // req.user contains the authenticated user
  res.json({ user: req.user });
});
```

## Frontend Integration

In your frontend, you'll need to:

1. **Make API calls** to the endpoints above
2. **Store the JWT token** (in localStorage or cookies)
3. **Include the token** in subsequent requests:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

## Next Steps

1. **Install dependencies**: Run `npm install` in the backend directory
2. **Test the endpoints**: Use Postman or curl to test each endpoint
3. **Connect frontend**: Update your frontend components to call these APIs
4. **Add email verification**: Implement email sending for password reset
5. **Add phone verification**: Implement SMS verification for phone signup
6. **Environment variables**: Set up proper JWT_SECRET in production

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days
- Change `JWT_SECRET` in production
- Consider adding rate limiting for login attempts
- Implement proper email/SMS verification in production
- Use HTTPS in production

