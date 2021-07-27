import * as moment from 'moment';

export const getFieldFromCollectionsWithID = (
  collections,
  id,
  idField,
  targetField,
  defaultValue = '',
  separator = ' '
) => {
  let row = collections.find(c => c[idField] === id);
  if (row) {
    if (typeof targetField === 'string') {
      return row[targetField];
    }
    return targetField.map(f => row[f]).join(separator);
  }
  if (defaultValue || defaultValue === '') {
    return defaultValue;
  }
  return id;
};

export const getFieldFromCollectionsWithIDs = (
  collections,
  id,
  idField,
  targetField,
  defaultValue = '',
  separator = ' '
) => {
  if (!id) {
    return defaultValue;
  }

  const ids = id.split(',');
  const data = collections.filter(c => ids.includes(`${c[idField]}`)).map(c => c[targetField]);
  return data.join(separator);
};

export const getAgeFromBirthday = birthday => {
  if (moment(new Date(birthday)).isValid()) {
    const age = moment().diff(new Date(birthday), 'years');
    return age;
  }
  return '';
};

export const convertBufferToImageURI = bin_image => {
  let imgDt: any = [];
  new Uint8Array(bin_image.data).forEach((a: any) => {
    imgDt.push(String.fromCharCode(a));
  });
  return 'data:image/jpeg;base64,' + btoa(imgDt.join(''));
};

export const getAddressString = caregiver => {
  let addressString = caregiver.Address1;
  if (caregiver.Address2) {
    addressString = `${addressString} ${caregiver.Address2}`;
  }
  if (caregiver.City) {
    addressString = `${addressString}, ${caregiver.City}`;
  }
  if (caregiver.County) {
    addressString = `${addressString}, ${caregiver.County}`;
  }
  addressString = `${addressString}, ${caregiver.State} ${caregiver.Zip}`;
  return addressString;
};

export function getErrorMessage(error: any, defaultMessage = 'Something went wrong') {
  if (!error) {
    return defaultMessage;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error.error && error.error.message) {
    return error.error.message;
  }
  if (error && error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message && typeof error.message === 'string') {
    return error.message;
  }
  return defaultMessage;
}

export function s3UrlFor(key) {
  return `https://s3.amazonaws.com/affinityasset/${key}`;
}
