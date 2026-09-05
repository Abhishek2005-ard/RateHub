import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool configuration
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'ratehub_db',
});

let isPgConnected = false;

// Fallback in-memory user store for instant local testing if PostgreSQL server is inactive
const inMemoryUsers = [];

// Initialize Database Table
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
    
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    client.release();
    console.log('✅ PostgreSQL Schema initialized (users table verified)');
  } catch (err) {
    console.warn('⚠️ PostgreSQL connection failed (or DB not running). Using in-memory database fallback for zero-config testing.');
    console.warn('   PostgreSQL error:', err.message);
    isPgConnected = false;
  }
}

initDb();

export async function findUserByEmail(email) {
  if (isPgConnected) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error querying PostgreSQL findUserByEmail:', error.message);
    }
  }
  
  // Fallback memory store lookup
  return inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
}

export async function createUser({ name, email, address, passwordHash }) {
  const sanitizedEmail = email.toLowerCase().trim();

  if (isPgConnected) {
    try {
      const query = `
        INSERT INTO users (name, email, address, password_hash, role)
        VALUES ($1, $2, $3, $4, 'user')
        RETURNING id, name, email, address, role, created_at;
      `;
      const values = [name.trim(), sanitizedEmail, address.trim(), passwordHash];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting user into PostgreSQL:', error.message);
      throw error;
    }
  }

  // Fallback memory store insert
  const newUser = {
    id: inMemoryUsers.length + 1,
    name: name.trim(),
    email: sanitizedEmail,
    address: address.trim(),
    password_hash: passwordHash,
    role: 'user',
    created_at: new Date().toISOString()
  };
  inMemoryUsers.push(newUser);
  
  // Return user without password_hash
  const { password_hash: _hash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export default pool;
