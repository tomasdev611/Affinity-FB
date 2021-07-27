import {raw} from 'objection';
const fs = require('fs');

import {AWSService, ACL_PRIVATE, ACL_PUBLIC_READ} from '../services/aws';
import {extensionMap} from '../lib/constants';
import {generateRandomIds} from '../lib/helpers';

import CaregiverImage from './CaregiverImageModel';

import Caregiver from './CaregiverModel';

const database = require('./../lib/databasemssql');

export class CaregiverImageService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  async syncAttachmentsToS3() {
    try {
      let securityNums = await CaregiverImage.query(this.knex).select('SocialSecurityNum');
      let tryCount = securityNums.length / 100;
      console.log('CaregiverImageService syncAttachmentsToS3 Start', tryCount, securityNums.length);
      for (let i = 0; i < tryCount; i++) {
        const socialSecurityNums = securityNums
          .slice(i * 100, (i + 1) * 100)
          .map(c => c.SocialSecurityNum);

        let attachments = await CaregiverImage.query(this.knex).whereIn(
          'SocialSecurityNum',
          socialSecurityNums
        );
        for (let attachment of attachments) {
          // fs.writeFileSync(
          //   `./tmp/caregiver_photos/${attachment.SocialSecurityNum}.jpg`,
          //   attachment.bin_image
          // );
          await this.uploadSingleAttachment(attachment);
        }
        console.log('Processed syncAttachmentsToS3', i);
      }
      console.log('CaregiverImageService syncAttachmentsToS3 complete');
    } catch (error) {
      console.log('Error', error);
    }
  }

  // async downloadAllAttachments() {
  //   try {
  //     let attachments = await CaregiverImage.query(this.knex)
  //       .whereNotNull('documentPath')
  //       .select(['documentPath', 'attachmentId', 'socialSecNum']);
  //     for (let attachment of attachments) {
  //       try {
  //         await AWSService.downloadFileAndSave(
  //           attachment.documentPath,
  //           `./tmp/caregiver_attachments/${attachment.socialSecNum}_${attachment.attachmentId}.pdf`
  //         );
  //       } catch (error) {
  //         console.log('download attachment error', attachment);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error', error);
  //   }
  // }

  async removeFilesForAllCaregivers() {
    await CaregiverImage.query(this.knex).delete();
  }

  async uploadSingleAttachment(attachment) {
    const key = `caregiver_photos/${attachment.SocialSecurityNum.substr(0, 2)}/${
      attachment.SocialSecurityNum
    }/${generateRandomIds()}.jpg`;
    const mimeContent = 'image/jpeg';
    await AWSService.uploadFileToS3FromContent(
      attachment.bin_image,
      key,
      mimeContent,
      ACL_PUBLIC_READ
    );
    await Caregiver.query(this.knex)
      .where({SocialSecurityNum: attachment.SocialSecurityNum})
      .update({photo: key});
  }

  // static async uploadAttachmentForUser(attachmentInfo, body) {
  //   let extension = 'pdf';
  //   if (attachmentInfo.str_filename) {
  //     const nameParts = attachmentInfo.str_filename.split('.');
  //     extension = nameParts[nameParts.length - 1];
  //   }
  //   const keyName = attachmentInfo.attachmentId
  //     ? `${attachmentInfo.attachmentId}_${generateRandomIds()}`
  //     : generateRandomIds();
  //   const key = `caregiver_attachments/${attachmentInfo.socialSecNum.substr(0, 2)}/${
  //     attachmentInfo.socialSecNum
  //   }/${keyName}.${extension}`;
  //   const mimeContent = extensionMap[extension] || 'application/pdf';

  //   await AWSService.uploadFileToS3FromContent(body, key, mimeContent, ACL_PRIVATE);
  //   return key;
  // }

  // async updateAttachmentPathsToS3WithoutUpload() {
  //   let attachments = await CaregiverImage.query(this.knex)
  //     .whereNull('documentPath')
  //     .select(['socialSecNum', 'attachmentId', 'documentPath', 'str_filename']);
  //   for (let attachment of attachments) {
  //     await this.uploadAttachmentPath(attachment);
  //   }
  //   console.log('Processed documentPath Null Page');
  // }

  // async uploadAttachmentPath(attachment) {
  //   if (!attachment.documentPath) {
  //     let extension = 'pdf';
  //     if (attachment.str_filename) {
  //       const nameParts = attachment.str_filename.split('.');
  //       extension = nameParts[nameParts.length - 1];
  //     }
  //     const key = `caregiver_attachments/${attachment.socialSecNum.substr(0, 2)}/${
  //       attachment.socialSecNum
  //     }/${attachment.attachmentId}.${extension}`;

  //     await CaregiverImage.query(this.knex)
  //       .where('attachmentId', attachment.attachmentId)
  //       .patch({documentPath: key});
  //   }
  // }
}
