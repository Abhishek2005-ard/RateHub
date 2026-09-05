import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool configuration
export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'ratehub_db',
});

export let isPgConnected = false;

// Fallback in-memory stores for instant zero-config testing if PostgreSQL is offline
export const inMemoryUsers = [];
export const inMemoryStores = [];
export const inMemoryRatings = [];

// Initialize Database Tables & Seed Initial Data
async function initDb() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL Database');
    isPgConnected = true;

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);`);

    client.release();
    console.log('✅ PostgreSQL Schema initialized (users, stores, ratings tables verified)');
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed (or DB not running). Using in-memory database fallback for zero-config testing.');
    isPgConnected = false;
  }

  // Seed default data for zero-config testing
  await seedDefaultData();
}

async function seedDefaultData() {
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('admin123', salt);
  const ownerHash = await bcrypt.hash('owner123', salt);
  const userHash = await bcrypt.hash('user123', salt);

  const defaultUsers = [
    { id: 1, name: 'System Admin', email: 'admin@ratehub.dev', address: 'RateHub HQ, Tech Center', password_hash: adminHash, role: 'admin', created_at: new Date('2026-01-15').toISOString() },
    { id: 2, name: 'Elena Rostova (Store Owner)', email: 'owner@heritage.com', address: 'Pearl District Branch', password_hash: ownerHash, role: 'store_owner', created_at: new Date('2026-02-10').toISOString() },
    { id: 3, name: 'Alex Morgan (Normal User)', email: 'user@ratehub.dev', address: '742 Evergreen Terrace', password_hash: userHash, role: 'user', created_at: new Date('2026-03-04').toISOString() },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', address: '120 Market St, SF', password_hash: userHash, role: 'user', created_at: new Date('2026-04-12').toISOString() },
    { id: 5, name: 'David Chen', email: 'david.c@techcorp.io', address: '450 Silicon Ave, Palo Alto', password_hash: userHash, role: 'user', created_at: new Date('2026-05-19').toISOString() }
  ];

  const defaultStores = [
    { id: 1, name: 'Heritage Artisan Coffee', email: 'owner@heritage.com', address: '742 Broadway Ave, Suite 100', category: 'Coffee & Cafe', created_at: new Date('2026-02-12').toISOString() },
    { id: 2, name: 'Lumina Tech Electronics', email: 'contact@lumina.tech', address: '88 Tech Boulevard', category: 'Electronics', created_at: new Date('2026-03-01').toISOString() },
    { id: 3, name: 'Urban Threads Boutique', email: 'info@urbanthreads.com', address: '512 Fashion St', category: 'Apparel', created_at: new Date('2026-03-15').toISOString() },
    { id: 4, name: 'Green Leaf Organic Market', email: 'support@greenleaf.org', address: '900 Natural Way', category: 'Groceries', created_at: new Date('2026-04-05').toISOString() },
    { id: 5, name: 'Apex Gaming Lounge', email: 'admin@apexgaming.gg', address: '303 Esports Plaza', category: 'Entertainment', created_at: new Date('2026-05-20').toISOString() }
  ];

  const defaultRatings = [
    { id: 1, store_id: 1, user_id: 3, rating: 5, comment: 'Best espresso in town! Ultra fast wifi and super helpful staff.', created_at: new Date('2026-03-10').toISOString() },
    { id: 2, store_id: 1, user_id: 4, rating: 5, comment: 'Loved the oat milk latte.', created_at: new Date('2026-04-15').toISOString() },
    { id: 3, store_id: 2, user_id: 3, rating: 4, comment: 'Great selection of gadgets, slightly high prices.', created_at: new Date('2026-03-20').toISOString() },
    { id: 4, store_id: 3, user_id: 5, rating: 5, comment: 'Stylish clothing collection.', created_at: new Date('2026-05-22').toISOString() },
    { id: 5, store_id: 4, user_id: 4, rating: 4, comment: 'Fresh organic produce, clean aisles.', created_at: new Date('2026-04-18').toISOString() },
    { id: 6, store_id: 5, user_id: 5, rating: 5, comment: 'Top tier PCs and high refresh rate monitors!', created_at: new Date('2026-06-01').toISOString() },
    { id: 7, store_id: 1, user_id: 5, rating: 4, comment: 'Cozy atmosphere for reading.', created_at: new Date('2026-06-14').toISOString() }
  ];

  if (!isPgConnected) {
    if (inMemoryUsers.length === 0) inMemoryUsers.push(...defaultUsers);
    if (inMemoryStores.length === 0) inMemoryStores.push(...defaultStores);
    if (inMemoryRatings.length === 0) inMemoryRatings.push(...defaultRatings);
  }
}

initDb();

export default pool;

