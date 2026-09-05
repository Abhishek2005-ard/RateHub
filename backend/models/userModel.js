import { pool, isPgConnected, inMemoryUsers } from '../config/db.js';

export async function findUserByEmail(email) {
  const sanitizedEmail = email.toLowerCase().trim();

  if (isPgConnected) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [sanitizedEmail]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error querying PostgreSQL findUserByEmail:', error.message);
    }
  }
  
  // Memory store fallback
  return inMemoryUsers.find(u => u.email.toLowerCase() === sanitizedEmail) || null;
}

export async function findUserById(id) {
  if (isPgConnected) {
    try {
      const result = await pool.query('SELECT id, name, email, address, role, created_at FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error querying PostgreSQL findUserById:', error.message);
    }
  }

  // Memory store fallback
  const user = inMemoryUsers.find(u => u.id === parseInt(id, 10));
  if (!user) return null;
  const { password_hash: _hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function createUser({ name, email, address, passwordHash, role = 'user' }) {
  const sanitizedEmail = email.toLowerCase().trim();

  if (isPgConnected) {
    try {
      const query = `
        INSERT INTO users (name, email, address, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, address, role, created_at;
      `;
      const values = [name.trim(), sanitizedEmail, address.trim(), passwordHash, role];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting user into PostgreSQL:', error.message);
      throw error;
    }
  }

  // Memory store fallback
  const newUser = {
    id: inMemoryUsers.length + 1,
    name: name.trim(),
    email: sanitizedEmail,
    address: address.trim(),
    password_hash: passwordHash,
    role: role || 'user',
    created_at: new Date().toISOString()
  };
  inMemoryUsers.push(newUser);
  
  const { password_hash: _hash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function getAllUsers(options = {}) {
  const search = (options.search || '').trim().toLowerCase();
  const role = options.role || 'all';
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, parseInt(options.limit || 10, 10));
  const offset = (page - 1) * limit;

  if (isPgConnected) {
    try {
      let whereConditions = [];
      let queryValues = [];
      let valCount = 1;

      if (search) {
        whereConditions.push(`(LOWER(name) LIKE $${valCount} OR LOWER(email) LIKE $${valCount} OR LOWER(address) LIKE $${valCount})`);
        queryValues.push(`%${search}%`);
        valCount++;
      }

      if (role !== 'all') {
        whereConditions.push(`role = $${valCount}`);
        queryValues.push(role);
        valCount++;
      }

      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `SELECT COUNT(*)::int FROM users ${whereClause};`;
      const countResult = await pool.query(countQuery, queryValues);
      const total = countResult.rows[0].count;

      // Data query
      const dataQuery = `
        SELECT id, name, email, address, role, created_at
        FROM users
        ${whereClause}
        ORDER BY id DESC
        LIMIT $${valCount} OFFSET $${valCount + 1};
      `;
      const dataResult = await pool.query(dataQuery, [...queryValues, limit, offset]);

      return {
        users: dataResult.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      };
    } catch (error) {
      console.error('Error querying PostgreSQL getAllUsers:', error.message);
    }
  }

  // Memory store fallback with filtering and pagination
  let filtered = inMemoryUsers.map(({ password_hash: _hash, ...u }) => u);

  if (search) {
    filtered = filtered.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.address.toLowerCase().includes(search)
    );
  }

  if (role !== 'all') {
    filtered = filtered.filter(u => u.role === role);
  }

  const total = filtered.length;
  const paginatedUsers = filtered.slice(offset, offset + limit);

  return {
    users: paginatedUsers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  };
}

