# Jharkhand Tourism - Full Stack Website

A complete tourism website for Jharkhand with backend database, user authentication, admin panel, and all features fully functional.

## 🚀 Quick Start

### Option 1: Using the Batch File (Windows)
1. Double-click `start.bat`
2. The script will automatically:
   - Check for Node.js
   - Install dependencies
   - Initialize the database
   - Start the server

### Option 2: Manual Setup
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database:**
   ```bash
   node scripts/init-database.js
   ```

3. **Start Server:**
   ```bash
   node server.js
   ```

4. **Access Website:**
   - Open browser and go to: `http://localhost:3000`

## 🔐 Admin Access

**Admin Credentials:**
- Email: `admin@jharkhandtourism.com`
- Password: `admin123`

**Admin Panel Access:**
1. Click the 🔐 button (bottom-right corner)
2. Enter the admin credentials
3. Access all admin features

## 🗄️ Database Features

### Tables Created:
- **users** - User accounts and authentication
- **destinations** - Jharkhand tourism destinations
- **guide_applications** - Guide registration applications
- **bookings** - User bookings and reservations
- **reviews** - Destination reviews and ratings
- **contact_messages** - Contact form submissions
- **newsletter_subscriptions** - Newsletter subscribers
- **admin_logs** - Admin action logs
- **page_views** - Website analytics

### Sample Data Included:
- 8 Jharkhand destinations with full details
- Admin user account
- Sample guide applications
- Sample reviews

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get specific destination
- `GET /api/destinations?search=query` - Search destinations
- `GET /api/destinations?category=waterfall` - Filter by category

### Guide Applications
- `POST /api/guides/apply` - Submit guide application

### Contact & Newsletter
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Admin (Requires Authentication)
- `GET /api/admin/stats` - Get website statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/guides` - Get guide applications
- `POST /api/admin/block-user` - Block a user
- `POST /api/admin/unblock-user` - Unblock a user

### Analytics
- `POST /api/track-page-view` - Track page views

## 🎯 Fully Functional Features

### ✅ User Management
- User registration and login
- JWT-based authentication
- User profiles and sessions
- Password hashing with bcrypt

### ✅ Destination Management
- Dynamic destination loading from database
- Search and filtering
- Detailed destination views
- Reviews and ratings system

### ✅ Guide Registration
- Complete guide application form
- Email notifications
- Admin approval system
- Application tracking

### ✅ Admin Panel
- Real-time statistics dashboard
- User management (block/unblock)
- Guide application management
- Expenditure analysis
- Page view analytics

### ✅ Contact & Communication
- Contact form with email notifications
- Newsletter subscription
- Email integration with Nodemailer

### ✅ Security Features
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection

### ✅ File Upload
- Image upload for destinations
- File size limits
- File type validation
- Secure file storage

### ✅ Payment Integration
- Stripe payment gateway ready
- Booking system
- Payment tracking

## 📁 Project Structure

```
/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── config.env               # Environment configuration
├── start.bat                # Windows startup script
├── api.js                   # Frontend API client
├── script.js                # Frontend JavaScript
├── index.html               # Main website
├── signin.html              # Login page
├── signup.html              # Registration page
├── guide-registration.html  # Guide application
├── styles.css               # Website styling
├── scripts/
│   └── init-database.js     # Database initialization
├── uploads/                 # File upload directory
├── jharkhand_tourism.db     # SQLite database
└── node_modules/            # Dependencies
```

## 🔧 Configuration

### Environment Variables (config.env)
```env
PORT=3000
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=your-stripe-key
```

### Email Setup
1. Use Gmail with App Password
2. Update `EMAIL_USER` and `EMAIL_PASS` in config.env
3. Enable 2-factor authentication on Gmail
4. Generate App Password for the application

### Payment Setup
1. Get Stripe API keys from https://stripe.com
2. Update `STRIPE_SECRET_KEY` in config.env
3. Test with Stripe test keys first

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- Domain name and hosting
- SSL certificate
- Email service configured

### Steps
1. Update environment variables for production
2. Set up reverse proxy (Nginx)
3. Configure SSL certificate
4. Set up database backups
5. Configure email service
6. Deploy to hosting platform

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 3000 is available
- Verify Node.js is installed
- Check if dependencies are installed

**Database errors:**
- Run `node scripts/init-database.js` to reinitialize
- Check file permissions for database file

**Email not working:**
- Verify email credentials in config.env
- Check Gmail App Password setup
- Ensure 2FA is enabled on Gmail

**Admin panel not accessible:**
- Use correct admin credentials
- Check JWT token in browser storage
- Verify user role in database

## 📊 Features Comparison

| Feature | Before | After |
|---------|--------|-------|
| Data Storage | localStorage | SQLite Database |
| Authentication | Simulated | JWT + bcrypt |
| User Management | Basic | Full CRUD |
| Admin Panel | Static | Dynamic + Real-time |
| Email Notifications | None | Full Integration |
| File Upload | None | Complete System |
| Payment Gateway | None | Stripe Integration |
| Analytics | Basic | Comprehensive |
| Security | Basic | Enterprise-level |

## 🎉 Success!

Your Jharkhand Tourism website is now fully functional with:
- ✅ Complete backend with database
- ✅ User authentication and management
- ✅ Admin panel with all features
- ✅ Email notifications
- ✅ File upload system
- ✅ Payment integration ready
- ✅ Security features
- ✅ Real-time analytics

**Access your website at: http://localhost:3000**
