const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('jharkhand_tourism.db');

// Initialize database with sample data
const initDatabase = async () => {
  console.log('Initializing Jharkhand Tourism Database...');

  // Create tables
  db.serialize(() => {
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

    console.log('Tables created successfully');

    // Insert sample data
    insertSampleData();
  });
};

const insertSampleData = async () => {
  console.log('Inserting sample data...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  db.run(
    'INSERT OR IGNORE INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
    ['admin@jharkhandtourism.com', adminPassword, 'Admin', 'User', 'admin']
  );

  // Create sample destinations
  const destinations = [
    {
      name: 'Dassam Falls',
      description: 'Magnificent waterfall cascading from 144 feet height, surrounded by lush greenery and perfect for nature lovers.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      price: '₹500',
      location: 'Ranchi',
      category: 'Waterfall',
      duration: '1 day',
      tags: 'Waterfall,Nature,Adventure',
      is_featured: 1
    },
    {
      name: 'Betla National Park',
      description: 'Rich wildlife sanctuary with tigers, elephants, and diverse flora and fauna in their natural habitat.',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      price: '₹800',
      location: 'Palamu',
      category: 'Wildlife',
      duration: '2 days',
      tags: 'Wildlife,Nature,Safari',
      is_featured: 1
    },
    {
      name: 'Jagannath Temple',
      description: 'Ancient temple dedicated to Lord Jagannath with beautiful architecture and spiritual significance.',
      image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      price: '₹200',
      location: 'Ranchi',
      category: 'Temple',
      duration: 'Half day',
      tags: 'Temple,Spiritual,Historic',
      is_featured: 1
    },
    {
      name: 'Hundru Falls',
      description: 'Stunning waterfall with a height of 320 feet, perfect for adventure seekers and photography enthusiasts.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.8,
      price: '₹400',
      location: 'Ranchi',
      category: 'Waterfall',
      duration: '1 day',
      tags: 'Waterfall,Adventure,Photography',
      is_featured: 1
    },
    {
      name: 'Netarhat',
      description: 'Queen of Chotanagpur - a hill station with pleasant climate, scenic views, and peaceful environment.',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.7,
      price: '₹600',
      location: 'Latehar',
      category: 'Hill Station',
      duration: '2 days',
      tags: 'Hill Station,Nature,Peaceful',
      is_featured: 1
    },
    {
      name: 'Baidyanath Temple',
      description: 'One of the 12 Jyotirlingas, a sacred pilgrimage site for devotees with rich spiritual heritage.',
      image_url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      price: '₹300',
      location: 'Deoghar',
      category: 'Temple',
      duration: '1 day',
      tags: 'Temple,Spiritual,Pilgrimage',
      is_featured: 1
    },
    {
      name: 'Patratu Valley',
      description: 'Picturesque valley with winding roads, beautiful landscapes, and perfect for road trips.',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      price: '₹350',
      location: 'Ramgarh',
      category: 'Valley',
      duration: '1 day',
      tags: 'Valley,Nature,Road Trip',
      is_featured: 0
    },
    {
      name: 'Hazaribagh National Park',
      description: 'Wildlife sanctuary with diverse species, beautiful forest trails, and nature photography opportunities.',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      rating: 4.6,
      price: '₹700',
      location: 'Hazaribagh',
      category: 'Wildlife',
      duration: '2 days',
      tags: 'Wildlife,Nature,Photography',
      is_featured: 0
    }
  ];

  destinations.forEach(dest => {
    db.run(
      'INSERT OR IGNORE INTO destinations (name, description, image_url, rating, price, location, category, duration, tags, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [dest.name, dest.description, dest.image_url, dest.rating, dest.price, dest.location, dest.category, dest.duration, dest.tags, dest.is_featured]
    );
  });

  // Insert sample guide applications
  const guideApplications = [
    {
      full_name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91-9876543210',
      experience_years: 5,
      languages: 'Hindi, English, Santhali',
      specializations: 'Wildlife, Waterfalls, Tribal Culture',
      bio: 'Experienced local guide with deep knowledge of Jharkhand\'s natural beauty and cultural heritage.'
    },
    {
      full_name: 'Priya Singh',
      email: 'priya@example.com',
      phone: '+91-9876543211',
      experience_years: 3,
      languages: 'Hindi, English, Bengali',
      specializations: 'Temples, Pilgrimage, History',
      bio: 'Passionate about sharing the spiritual and historical significance of Jharkhand\'s temples.'
    }
  ];

  guideApplications.forEach(guide => {
    db.run(
      'INSERT OR IGNORE INTO guide_applications (full_name, email, phone, experience_years, languages, specializations, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [guide.full_name, guide.email, guide.phone, guide.experience_years, guide.languages, guide.specializations, guide.bio]
    );
  });

  // Insert sample reviews
  const reviews = [
    {
      user_id: 1,
      destination_id: 1,
      rating: 5,
      comment: 'Amazing waterfall! The view is breathtaking and the surrounding nature is pristine.'
    },
    {
      user_id: 1,
      destination_id: 2,
      rating: 4,
      comment: 'Great wildlife experience. Saw tigers and elephants in their natural habitat.'
    }
  ];

  reviews.forEach(review => {
    db.run(
      'INSERT OR IGNORE INTO reviews (user_id, destination_id, rating, comment) VALUES (?, ?, ?, ?)',
      [review.user_id, review.destination_id, review.rating, review.comment]
    );
  });

  console.log('Sample data inserted successfully');
  console.log('Database initialization completed!');
  console.log('\nAdmin credentials:');
  console.log('Email: admin@jharkhandtourism.com');
  console.log('Password: admin123');
};

// Run initialization
initDatabase().then(() => {
  db.close();
  process.exit(0);
}).catch(err => {
  console.error('Error initializing database:', err);
  db.close();
  process.exit(1);
});
