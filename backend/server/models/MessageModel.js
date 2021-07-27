const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class MessageModel extends BaseModel {
  static idColumn = 'MessageId';

  static get tableName() {
    return 'dbo.messages';
  }

  static get jsonSchema() {
    return {
      properties: {
        MessageId: {type: 'integer'},
        MessageSid: {type: ['string', 'null'], maxLength: 50},
        twilioNumber: {type: 'string', maxLength: 20},
        targetNumber: {type: 'string', maxLength: 20},
        username: {type: ['string', 'null'], maxLength: 15}, // The username that's dealing with message
        SocialSecurityNum: {type: ['string', 'null'], maxLength: 9}, // This can be for Caregiver or Client
        ClientId: {type: ['integer', 'null']},
        GroupId: {type: ['string', 'null'], maxLength: 4}, // If this is a group message
        RoomId: {type: ['string', 'null'], maxLength: 50},
        sender: {type: 'string', maxLength: 1}, // T: Twilio number, C: Caregiver or Client
        message: {type: 'string', maxLength: 1000}, // Actual message sent, received
        isRead: {type: 'boolean'},
        image: {type: 'string', maxLength: 1000}, // Actual message sent, received
        createdBy: {type: ['string', 'null'], maxLength: 15}, // username if sent, or null if received message
        created: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = MessageModel;
