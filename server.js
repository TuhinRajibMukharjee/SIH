const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Database initialization
const db = new sqlite3.Database('jharkhand_tourism.db');

// Initialize database tables
const initDatabase = () => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',
    is_verified BOOLEAN DEFAULT 0,
    is_blocked BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Destinations table
  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    rating REAL DEFAULT 0,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    tags TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Guide applications table
  db.run(`CREATE TABLE IF NOT EXISTS guide_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience_years INTEGER NOT NULL,
    languages TEXT NOT NULL,
    specializations TEXT NOT NULL,
    bio TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Bookings table
  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    duration INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (destination_id) REFERENCES destinations (id)
  )`);

  // Reviews table
  db.run(`CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (destination_id) REFERENCES destinations (id)
  )`);

  // Contact messages table
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Newsletter subscriptions table
  db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Admin logs table
  db.run(`CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users (id)
  )`);

  // Page views table
  db.run(`CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    user_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  console.log('Database tables initialized successfully');
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API Routes

// Authentication routes
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.run(
        'INSERT INTO users (email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, phone],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { id: this.lastID, email, role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, email, firstName, lastName, role: 'user' }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if (user.is_blocked) {
      return res.status(403).json({ error: 'Account is blocked' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  });
});

// Destinations routes
app.get('/api/destinations', (req, res) => {
  const { category, search, limit = 10, offset = 0 } = req.query;
  let query = 'SELECT * FROM destinations WHERE 1=1';
  let params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ? OR location LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY is_featured DESC, rating DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/destinations/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM destinations WHERE id = ?', [id], (err, destination) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Get reviews for this destination
    db.all(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.destination_id = ? ORDER BY r.created_at DESC',
      [id],
      (err, reviews) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        destination.reviews = reviews;
        res.json(destination);
      }
    );
  });
});

// Guide applications routes
app.post('/api/guides/apply', [
  body('fullName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').notEmpty().trim(),
  body('experienceYears').isInt({ min: 0 }),
  body('languages').notEmpty().trim(),
  body('specializations').notEmpty().trim(),
  body('bio').notEmpty().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, phone, experienceYears, languages, specializations, bio } = req.body;

  db.run(
    'INSERT INTO guide_applications (full_name, email, phone, experience_years, languages, specializations, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [fullName, email, phone, experienceYears, languages, specializations, bio],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to submit application' });
      }

      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Guide Application Received - Jharkhand Tourism',
        html: `
          <h2>Thank you for your interest in becoming a guide!</h2>
          <p>Dear ${fullName},</p>
          <p>We have received your guide application. Our team will review it and get back to you within 3-5 business days.</p>
          <p>Application Details:</p>
          <ul>
            <li>Name: ${fullName}</li>
            <li>Email: ${email}</li>
            <li>Phone: ${phone}</li>
            <li>Experience: ${experienceYears} years</li>
            <li>Languages: ${languages}</li>
            <li>Specializations: ${specializations}</li>
          </ul>
          <p>Best regards,<br>Jharkhand Tourism Board</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Email sending failed:', error);
        }
      });

      res.status(201).json({ message: 'Application submitted successfully' });
    }
  );
});

// Contact form route
app.post('/api/contact', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty().trim(),
  body('message').notEmpty().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  db.run(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to send message' });
      }

      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || 'admin@jharkhandtourism.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Email sending failed:', error);
        }
      });

      res.json({ message: 'Message sent successfully' });
    }
  );
});

// Newsletter subscription route
app.post('/api/newsletter/subscribe', [
  body('email').isEmail().normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  db.run(
    'INSERT OR REPLACE INTO newsletter_subscriptions (email) VALUES (?)',
    [email],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to subscribe' });
      }

      res.json({ message: 'Successfully subscribed to newsletter' });
    }
  );
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  const stats = {};

  // Get user count
  db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    stats.totalUsers = result.count;

    // Get guide applications count
    db.get('SELECT COUNT(*) as count FROM guide_applications', (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      stats.totalGuideApplications = result.count;

      // Get destinations count
      db.get('SELECT COUNT(*) as count FROM destinations', (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.totalDestinations = result.count;

        // Get bookings count
        db.get('SELECT COUNT(*) as count FROM bookings', (err, result) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          stats.totalBookings = result.count;

          // Get page views count
          db.get('SELECT COUNT(*) as count FROM page_views', (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            stats.totalPageViews = result.count;

            res.json(stats);
          });
        });
      });
    });
  });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, email, first_name, last_name, phone, role, is_blocked, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/admin/guides', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM guide_applications ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/admin/block-user', authenticateToken, requireAdmin, [
  body('userId').isInt(),
  body('reason').notEmpty().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, reason } = req.body;

  db.run('UPDATE users SET is_blocked = 1 WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to block user' });
    }

    // Log admin action
    db.run(
      'INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'block_user', `Blocked user ${userId}. Reason: ${reason}`]
    );

    res.json({ message: 'User blocked successfully' });
  });
});

app.post('/api/admin/unblock-user', authenticateToken, requireAdmin, [
  body('userId').isInt()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId } = req.body;

  db.run('UPDATE users SET is_blocked = 0 WHERE id = ?', [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to unblock user' });
    }

    // Log admin action
    db.run(
      'INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)',
      [req.user.id, 'unblock_user', `Unblocked user ${userId}`]
    );

    res.json({ message: 'User unblocked successfully' });
  });
});

// Page view tracking
app.post('/api/track-page-view', (req, res) => {
  const { page, userId, ipAddress, userAgent } = req.body;

  db.run(
    'INSERT INTO page_views (page, user_id, ip_address, user_agent) VALUES (?, ?, ?, ?)',
    [page, userId, ipAddress, userAgent],
    (err) => {
      if (err) {
        console.log('Failed to track page view:', err);
      }
      res.json({ message: 'Page view tracked' });
    }
  );
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
initDatabase();

app.listen(PORT, () => {
  console.log(`Jharkhand Tourism Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
