const Model = require('objection').Model;
const BaseModel = require('./BaseModel');

class MessageRoom extends BaseModel {
  static idColumn = 'MessageRoomId';

  static get tableName() {
    return 'dbo.messages';
  }

  static get jsonSchema() {
    return {
      properties: {
        MessageRoomId: {type: 'integer'},
        twilioNumber: {type: 'string', maxLength: 20}, // Direct Message
        targetNumber: {type: 'string', maxLength: 20},
        GroupId: {type: ['string', 'null'], maxLength: 4}, // If this is a group message

        username: {type: ['string', 'null'], maxLength: 15}, // The username that's dealing with message
        lastMessageSender: {type: 'string', maxLength: 1}, // T: Twilio number, C: Caregiver or Client
        lastMessage: {type: 'string', maxLength: 1000}, // Actual message sent, received
        createdBy: {type: ['string', 'null'], maxLength: 15}, // username if sent, or null if received message
        created: {type: ['string', 'null']}
      }
    };
  }
}

module.exports = MessageRoom;
