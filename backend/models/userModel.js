import { pool, isPgConnected, inMemoryUsers } from '../config/db.js';

export async function findUserByEmail(email) {
  const sanitized = email.toLowerCase().trim();

  if (isPgConnected) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [sanitized]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('findUserByEmail error:', err.message);
    }
  }

  return inMemoryUsers.find(u => u.email.toLowerCase() === sanitized) || null;
}

export async function findUserById(id) {
  if (isPgConnected) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1', [id]
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('findUserById error:', err.message);
    }
  }

  const user = inMemoryUsers.find(u => u.id === parseInt(id, 10));
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

export async function createUser({ name, email, address, passwordHash, role = 'user' }) {
  const sanitized = email.toLowerCase().trim();

  if (isPgConnected) {
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, address, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, address, role, created_at`,
        [name.trim(), sanitized, address.trim(), passwordHash, role]
      );
      return result.rows[0];
    } catch (err) {
      console.error('createUser error:', err.message);
      throw err;
    }
  }

  const newUser = {
    id: inMemoryUsers.length + 1,
    name: name.trim(),
    email: sanitized,
    address: address.trim(),
    password_hash: passwordHash,
    role: role || 'user',
    created_at: new Date().toISOString()
  };
  inMemoryUsers.push(newUser);

  const { password_hash: _, ...withoutPwd } = newUser;
  return withoutPwd;
}

export async function updateUserPassword(userId, newPasswordHash) {
  const numericId = parseInt(userId, 10);

  if (isPgConnected) {
    try {
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [newPasswordHash, numericId]
      );
      return true;
    } catch (err) {
      console.error('updateUserPassword error:', err.message);
      throw err;
    }
  }

  const user = inMemoryUsers.find(u => u.id === numericId);
  if (user) {
    user.password_hash = newPasswordHash;
    return true;
  }
  return false;
}

export async function getAllUsers(options = {}) {
  const search = (options.search || '').trim().toLowerCase();
  const role = options.role || 'all';
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.max(1, parseInt(options.limit || 10, 10));
  const offset = (page - 1) * limit;

  if (isPgConnected) {
    try {
      let conditions = [];
      let values = [];
      let idx = 1;

      if (search) {
        conditions.push(`(LOWER(name) LIKE $${idx} OR LOWER(email) LIKE $${idx} OR LOWER(address) LIKE $${idx})`);
        values.push(`%${search}%`);
        idx++;
      }

      if (role !== 'all') {
        conditions.push(`role = $${idx}`);
        values.push(role);
        idx++;
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRes = await pool.query(`SELECT COUNT(*)::int FROM users ${where}`, values);
      const total = countRes.rows[0].count;

      const dataRes = await pool.query(
        `SELECT id, name, email, address, role, created_at FROM users ${where} ORDER BY id DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        [...values, limit, offset]
      );

      return { users: dataRes.rows, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
    } catch (err) {
      console.error('getAllUsers error:', err.message);
    }
  }

  // memory fallback
  let filtered = inMemoryUsers.map(({ password_hash, ...u }) => u);

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
  const paginated = filtered.slice(offset, offset + limit);

  return { users: paginated, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}
