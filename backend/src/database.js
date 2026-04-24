const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../smartseason.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema
const initializeDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'agent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fields table
    db.run(`
      CREATE TABLE IF NOT EXISTS fields (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        crop_type TEXT NOT NULL,
        planting_date DATE NOT NULL,
        current_stage TEXT DEFAULT 'Planted',
        status TEXT DEFAULT 'Active',
        created_by INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Field assignments (linking fields to agents)
    db.run(`
      CREATE TABLE IF NOT EXISTS field_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id INTEGER NOT NULL,
        agent_id INTEGER NOT NULL,
        assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES users(id),
        UNIQUE(field_id, agent_id)
      )
    `);

    // Field updates/notes
    db.run(`
      CREATE TABLE IF NOT EXISTS field_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        field_id INTEGER NOT NULL,
        agent_id INTEGER NOT NULL,
        stage TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
        FOREIGN KEY (agent_id) REFERENCES users(id)
      )
    `);

    console.log('Database schema initialized successfully');
  });
};

// Helper functions for database operations
const db_run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const db_get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const db_all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

initializeDatabase();

module.exports = {
  db,
  db_run,
  db_get,
  db_all
};
