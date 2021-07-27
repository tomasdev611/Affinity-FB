import request from 'request-promise';
import querystring from 'querystring';
import config from '../../config';

export class GoogleMapService {
  static async getLocationFromAddress(address) {
    try {
      let result = await request.get({
        url: `https://maps.googleapis.com/maps/api/geocode/json?${querystring.stringify({
          address
        })}&key=${config.googleApiKey}`,
        json: true
      });
      return result;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
