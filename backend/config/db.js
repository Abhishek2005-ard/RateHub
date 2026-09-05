import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const { Pool } = pg;

const isCloudPg = (process.env.PGHOST || '').includes('supabase.co') || Boolean(process.env.DATABASE_URL);

export const pool = new Pool({
  host: process.env.PGHOST || 'db.mlsndfgykvbffxosqpit.supabase.co',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'Abhishekdhatrak%402005',
  database: process.env.PGDATABASE || 'postgres',
  ssl: isCloudPg ? { rejectUnauthorized: false } : false
});

export let isPgConnected = false;

// in-memory fallback array for local fallback mode
export const inMemoryUsers = [];
export const inMemoryStores = [];
export const inMemoryRatings = [];

async function initDb() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to Supabase PostgreSQL cloud database!');
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
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure unique constraint exists
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_store_rating'
        ) THEN
          ALTER TABLE ratings ADD CONSTRAINT unique_user_store_rating UNIQUE (store_id, user_id);
        END IF;
      END $$;
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);`);

    client.release();
    console.log('Database schema & tables ready on Supabase PostgreSQL');
  } catch (err) {
    console.warn('PostgreSQL connection error, using fallback:', err.message);
    isPgConnected = false;
  }

  await seedDefaults();
}

async function seedDefaults() {
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('admin123', salt);
  const ownerHash = await bcrypt.hash('owner123', salt);
  const userHash = await bcrypt.hash('user123', salt);

  const defaultUsers = [
    { id: 1, name: 'System Admin', email: 'admin@ratehub.dev', address: 'RateHub HQ, Tech Center', password_hash: adminHash, role: 'admin', created_at: new Date('2026-01-15').toISOString() },
    { id: 2, name: 'Elena Rostova', email: 'owner@heritage.com', address: 'Pearl District Branch', password_hash: ownerHash, role: 'store_owner', created_at: new Date('2026-02-10').toISOString() },
    { id: 3, name: 'Alex Morgan', email: 'user@ratehub.dev', address: '742 Evergreen Terrace', password_hash: userHash, role: 'user', created_at: new Date('2026-03-04').toISOString() },
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
    { id: 1, store_id: 1, user_id: 3, rating: 5, comment: 'Best espresso in town, great wifi too.', created_at: new Date('2026-03-10').toISOString() },
    { id: 2, store_id: 1, user_id: 4, rating: 5, comment: 'Loved the oat milk latte.', created_at: new Date('2026-04-15').toISOString() },
    { id: 3, store_id: 2, user_id: 3, rating: 4, comment: 'Good selection, prices a bit high.', created_at: new Date('2026-03-20').toISOString() },
    { id: 4, store_id: 3, user_id: 5, rating: 5, comment: 'Stylish clothing collection.', created_at: new Date('2026-05-22').toISOString() },
    { id: 5, store_id: 4, user_id: 4, rating: 4, comment: 'Fresh produce, clean aisles.', created_at: new Date('2026-04-18').toISOString() },
    { id: 6, store_id: 5, user_id: 5, rating: 5, comment: 'Great PCs and monitors!', created_at: new Date('2026-06-01').toISOString() },
    { id: 7, store_id: 1, user_id: 5, rating: 4, comment: 'Cozy atmosphere for reading.', created_at: new Date('2026-06-14').toISOString() }
  ];

  if (!isPgConnected) {
    if (inMemoryUsers.length === 0) inMemoryUsers.push(...defaultUsers);
    if (inMemoryStores.length === 0) inMemoryStores.push(...defaultStores);
    if (inMemoryRatings.length === 0) inMemoryRatings.push(...defaultRatings);
  } else {
    try {
      const userCheck = await pool.query('SELECT COUNT(*)::int FROM users');
      if (userCheck.rows[0].count === 0) {
        for (const u of defaultUsers) {
          await pool.query(
            `INSERT INTO users (name, email, address, password_hash, role)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING`,
            [u.name, u.email, u.address, u.password_hash, u.role]
          );
        }
        for (const s of defaultStores) {
          await pool.query(
            `INSERT INTO stores (name, email, address, category)
             VALUES ($1, $2, $3, $4)`,
            [s.name, s.email, s.address, s.category]
          );
        }
        for (const r of defaultRatings) {
          await pool.query(
            `INSERT INTO ratings (store_id, user_id, rating, comment)
             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
            [r.store_id, r.user_id, r.rating, r.comment]
          );
        }
        console.log('Seeded initial data into Supabase PostgreSQL cloud database');
      }
    } catch (e) {
      console.warn('PostgreSQL seed check skipped:', e.message);
    }
  }
}

initDb();

export default pool;
