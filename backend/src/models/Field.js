const { db_run, db_get, db_all } = require('../database');

class Field {
  static async create(name, cropType, plantingDate, createdBy) {
    const result = await db_run(
      'INSERT INTO fields (name, crop_type, planting_date, created_by) VALUES (?, ?, ?, ?)',
      [name, cropType, plantingDate, createdBy]
    );
    return this.findById(result.id);
  }

  static async findById(id) {
    const field = await db_get('SELECT * FROM fields WHERE id = ?', [id]);
    if (field) {
      field.status = this.calculateStatus(field);
    }
    return field;
  }

  static async findAll() {
    const fields = await db_all('SELECT * FROM fields ORDER BY created_at DESC');
    return fields.map(f => ({
      ...f,
      status: this.calculateStatus(f)
    }));
  }

  static async findByAdmin(adminId) {
    const fields = await db_all('SELECT * FROM fields WHERE created_by = ? ORDER BY created_at DESC', [adminId]);
    return fields.map(f => ({
      ...f,
      status: this.calculateStatus(f)
    }));
  }

  static async findByAgent(agentId) {
    const fields = await db_all(
      `SELECT f.* FROM fields f 
       INNER JOIN field_assignments fa ON f.id = fa.field_id 
       WHERE fa.agent_id = ? ORDER BY f.created_at DESC`,
      [agentId]
    );
    return fields.map(f => ({
      ...f,
      status: this.calculateStatus(f)
    }));
  }

  static async update(id, data) {
    const updates = [];
    const values = [];
    
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.crop_type !== undefined) {
      updates.push('crop_type = ?');
      values.push(data.crop_type);
    }
    if (data.current_stage !== undefined) {
      updates.push('current_stage = ?');
      values.push(data.current_stage);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    if (updates.length > 0) {
      await db_run(
        `UPDATE fields SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    return this.findById(id);
  }

  static calculateStatus(field) {
    // Logic to determine field status
    // Based on current stage and implicit timeline
    const stages = ['Planted', 'Growing', 'Ready', 'Harvested'];
    const currentIndex = stages.indexOf(field.current_stage);

    if (field.current_stage === 'Harvested') {
      return 'Completed';
    }

    // Calculate days since planting
    const plantingDate = new Date(field.planting_date);
    const today = new Date();
    const daysSincePlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));

    // Typical crop growth timeline (can be adjusted)
    const expectedDaysPerStage = 30; // roughly 30 days per stage
    const expectedCurrentStage = Math.floor(daysSincePlanting / expectedDaysPerStage);

    // Status logic:
    // - At Risk: if we're behind schedule (actual stage < expected stage)
    // - Active: if we're on track
    // - Completed: if harvested
    if (currentIndex < expectedCurrentStage && field.current_stage !== 'Harvested') {
      return 'At Risk';
    }

    return 'Active';
  }

  static async getAgentsForField(fieldId) {
    return db_all(
      `SELECT u.id, u.email, u.first_name, u.last_name 
       FROM users u
       INNER JOIN field_assignments fa ON u.id = fa.agent_id
       WHERE fa.field_id = ?`,
      [fieldId]
    );
  }
}

module.exports = Field;
