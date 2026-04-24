const bcrypt = require('bcryptjs');
const { db_run, db_get, db_all } = require('../database');

class User {
  static async create(email, password, firstName, lastName, role = 'agent') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db_run(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, role]
    );
    return result;
  }

  static async findByEmail(email) {
    return db_get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    return db_get('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async findAll() {
    return db_all('SELECT id, email, first_name, last_name, role FROM users');
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async findAgents() {
    return db_all("SELECT id, email, first_name, last_name FROM users WHERE role = 'agent'");
  }
}

module.exports = User;
