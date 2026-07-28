# CleanCity Backend Setup Guide

## 📋 Prerequisites

- Node.js v14+ installed
- SQLite support (built into Node.js)
- Cloudinary account (free tier available)

## 🚀 Quick Start

### 1. Install Dependencies
All dependencies are already installed. To verify:
```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory with your credentials:

```env
DATABASE_PATH=./data/cleancity.db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
```

### 3. Get Your Credentials

#### SQLite Setup:
1. The server uses a local SQLite file automatically.
2. Set `DATABASE_PATH` if you want a custom location.
3. The database file will be created on first run.

#### Cloudinary Setup:
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free
3. Go to Dashboard → Settings → API Keys
4. Copy your Cloud Name, API Key, and API Secret

### 4. Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `PUT /api/auth/profile` - Update user profile

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/nearby?latitude=X&longitude=Y&maxDistance=500` - Get nearby reports
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report with photo
- `POST /api/reports/:id/confirm` - Confirm/upvote a report
- `PUT /api/reports/:id/status` - Update report status (admin/officer)
- `POST /api/reports/:id/after-photo` - Upload completion photo (officer)
- `GET /api/reports/analytics/dashboard` - Get analytics (admin)

## 🏗 Project Structure

```
server/
├── config/
│   ├── db.js           # SQLite connection
│   └── cloudinary.js   # Cloudinary setup
├── models/
│   ├── User.js         # User schema
│   └── Report.js       # Report schema
├── middleware/
│   └── auth.js         # JWT authentication
├── controllers/
│   ├── authController.js    # Auth logic
│   └── reportController.js  # Report logic
├── routes/
│   ├── auth.js         # Auth routes
│   └── reports.js      # Report routes
├── .env                # Environment variables
├── server.js           # Main server file
└── package.json
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (user, admin, officer)
- Location-based report queries using SQLite filtering
- Secure file uploads with Cloudinary

## 🌍 Community Features

- Location-based report queries
- Automatic report confirmation system
- Priority escalation based on confirmations
- Geospatial search (reports within 500m)

## 📝 Notes

- All endpoints return JSON responses
- Authentication required for user-specific routes
- Admin/Officer roles needed for status updates
- Images are stored on Cloudinary, not locally
