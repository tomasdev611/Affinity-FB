const Model = require('objection').Model;

class BaseModel extends Model {
  static get jsonSchema() {
    return {
      type: 'object',
      required: []
    };
  }
}

module.exports = BaseModel;
