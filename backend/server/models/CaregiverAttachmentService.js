import {raw} from 'objection';
import {AWSService, ACL_PRIVATE} from '../services/aws';
import {extensionMap} from '../lib/constants';
import {generateRandomIds} from '../lib/helpers';

import CaregiverAttachment from './CaregiverAttachment';

const database = require('./../lib/databasemssql');

export class CaregiverAttachmentService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  async syncAttachmentsToS3() {
    try {
      let countResult = await CaregiverAttachment.query(this.knex)
        .whereNull('documentPath')
        .count({count: '*'});
      let tryCount = countResult[0].count / 10;
      console.log(
        'CaregiverAttachmentService syncAttachmentsToS3 Start',
        tryCount,
        countResult[0].count
      );
      for (let i = 0; i < tryCount; i++) {
        let attachments = await CaregiverAttachment.query(this.knex)
          .whereNull('documentPath')
          .limit(10);
        for (let attachment of attachments) {
          await this.uploadSingleAttachment(attachment);
        }
        console.log('Processed documentPath Null Page', i);
      }
      console.log('CaregiverAttachmentService syncAttachmentsToS3 complete');
    } catch (error) {
      console.log('Error', error);
    }
  }

  async downloadAllAttachments() {
    try {
      let attachments = await CaregiverAttachment.query(this.knex)
        .whereNotNull('documentPath')
        .select(['documentPath', 'attachmentId', 'socialSecNum']);
      for (let attachment of attachments) {
        try {
          await AWSService.downloadFileAndSave(
            attachment.documentPath,
            `./tmp/caregiver_attachments/${attachment.socialSecNum}_${attachment.attachmentId}.pdf`
          );
        } catch (error) {
          console.log('download attachment error', attachment);
        }
      }
    } catch (error) {
      console.log('Error', error);
    }
  }

  async removeFilesForAllCaregivers() {
    await CaregiverAttachment.query(this.knex)
      .whereNotNull('documentPath')
      .patch({attachment: raw('null')});
  }

  async uploadSingleAttachment(attachment) {
    if (!attachment.documentPath) {
      let extension = 'pdf';
      if (attachment.str_filename) {
        const nameParts = attachment.str_filename.split('.');
        extension = nameParts[nameParts.length - 1];
      }
      const key = `caregiver_attachments/${attachment.socialSecNum.substr(0, 2)}/${
        attachment.socialSecNum
      }/${attachment.attachmentId}.${extension}`;
      const mimeContent = extensionMap[extension] || 'application/pdf';

      await AWSService.uploadFileToS3FromContent(
        attachment.attachment,
        key,
        mimeContent,
        ACL_PRIVATE
      );
      await CaregiverAttachment.query(this.knex)
        .where('attachmentId', attachment.attachmentId)
        .patch({documentPath: key});
    }
  }

  static async uploadAttachmentForUser(attachmentInfo, body) {
    let extension = 'pdf';
    if (attachmentInfo.str_filename) {
      const nameParts = attachmentInfo.str_filename.split('.');
      extension = nameParts[nameParts.length - 1];
    }
    const keyName = attachmentInfo.attachmentId
      ? `${attachmentInfo.attachmentId}_${generateRandomIds()}`
      : generateRandomIds();
    const key = `caregiver_attachments/${attachmentInfo.socialSecNum.substr(0, 2)}/${
      attachmentInfo.socialSecNum
    }/${keyName}.${extension}`;
    const mimeContent = extensionMap[extension] || 'application/pdf';

    await AWSService.uploadFileToS3FromContent(body, key, mimeContent, ACL_PRIVATE);
    return key;
  }

  async updateAttachmentPathsToS3WithoutUpload() {
    let attachments = await CaregiverAttachment.query(this.knex)
      .whereNull('documentPath')
      .select(['socialSecNum', 'attachmentId', 'documentPath', 'str_filename']);
    for (let attachment of attachments) {
      await this.uploadAttachmentPath(attachment);
    }
    console.log('Processed documentPath Null Page');
  }

  async uploadAttachmentPath(attachment) {
    if (!attachment.documentPath) {
      let extension = 'pdf';
      if (attachment.str_filename) {
        const nameParts = attachment.str_filename.split('.');
        extension = nameParts[nameParts.length - 1];
      }
      const key = `caregiver_attachments/${attachment.socialSecNum.substr(0, 2)}/${
        attachment.socialSecNum
      }/${attachment.attachmentId}.${extension}`;

      await CaregiverAttachment.query(this.knex)
        .where('attachmentId', attachment.attachmentId)
        .patch({documentPath: key});
    }
  }
}
