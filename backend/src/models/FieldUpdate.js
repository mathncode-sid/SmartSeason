const { db_run, db_all } = require('../database');

class FieldUpdate {
  static async create(fieldId, agentId, stage, notes) {
    const result = await db_run(
      'INSERT INTO field_updates (field_id, agent_id, stage, notes) VALUES (?, ?, ?, ?)',
      [fieldId, agentId, stage, notes]
    );
    return result;
  }

  static async findByField(fieldId) {
    return db_all(
      `SELECT fu.*, u.first_name, u.last_name, u.email 
       FROM field_updates fu
       LEFT JOIN users u ON fu.agent_id = u.id
       WHERE fu.field_id = ? 
       ORDER BY fu.created_at DESC`,
      [fieldId]
    );
  }

  static async findByAgent(agentId) {
    return db_all(
      `SELECT fu.*, f.name as field_name, u.first_name, u.last_name
       FROM field_updates fu
       LEFT JOIN fields f ON fu.field_id = f.id
       LEFT JOIN users u ON fu.agent_id = u.id
       WHERE fu.agent_id = ?
       ORDER BY fu.created_at DESC`,
      [agentId]
    );
  }
}

module.exports = FieldUpdate;
