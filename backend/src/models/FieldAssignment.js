const { db_run, db_get, db_all } = require('../database');

class FieldAssignment {
  static async assign(fieldId, agentId) {
    try {
      const result = await db_run(
        'INSERT INTO field_assignments (field_id, agent_id) VALUES (?, ?)',
        [fieldId, agentId]
      );
      return result;
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        throw new Error('Field is already assigned to this agent');
      }
      throw err;
    }
  }

  static async unassign(fieldId, agentId) {
    const result = await db_run(
      'DELETE FROM field_assignments WHERE field_id = ? AND agent_id = ?',
      [fieldId, agentId]
    );
    return result;
  }

  static async findByField(fieldId) {
    return db_all(
      `SELECT fa.*, u.email, u.first_name, u.last_name 
       FROM field_assignments fa
       LEFT JOIN users u ON fa.agent_id = u.id
       WHERE fa.field_id = ?`,
      [fieldId]
    );
  }

  static async findByAgent(agentId) {
    return db_all(
      `SELECT fa.*, f.name as field_name, f.crop_type
       FROM field_assignments fa
       LEFT JOIN fields f ON fa.field_id = f.id
       WHERE fa.agent_id = ?`,
      [agentId]
    );
  }

  static async isAssigned(fieldId, agentId) {
    const result = await db_get(
      'SELECT id FROM field_assignments WHERE field_id = ? AND agent_id = ?',
      [fieldId, agentId]
    );
    return !!result;
  }
}

module.exports = FieldAssignment;
