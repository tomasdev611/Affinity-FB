import config from '../../config';
const TwilioClient = require('twilio')(config.twilio.accountSID, config.twilio.authToken);
const TwilioGroupNotifyService = TwilioClient.notify.services(config.twilio.groupNotifySID);

// Deprecated. Not currently using Individual Notify Service
const TwilioIndividualNotifyService = TwilioClient.notify.services(
  config.twilio.individualNotifySID
);

export class TwilioService {
  static async sendSMS(from, to, body, image) {
    const messageObj = {
      body: body,
      from: from,
      to: to
    };
    if (image) {
      messageObj.mediaUrl = image;
    }

    return await TwilioClient.messages.create(messageObj);
  }

  // isGroup deprecated as only group is used at the moment
  static async sendBulkSMS(numbers, body, image, isGroup = true) {
    const bindings = numbers.map(number => {
      return JSON.stringify({binding_type: 'sms', address: number});
    });
    const messageObj = {
      body: body,
      toBinding: bindings
    };
    if (image) {
      messageObj.sms = {media_urls: [image]};
    }

    const TwilioNotifyService = isGroup ? TwilioGroupNotifyService : TwilioIndividualNotifyService;
    const notification = await TwilioNotifyService.notifications.create(messageObj);
    return notification;
  }

  static async fetchImage(MessageSid) {}
}
