import {raw} from 'objection';
import {AWSService, ACL_PRIVATE} from '../services/aws';
import {extensionMap} from '../lib/constants';
import {generateRandomIds} from '../lib/helpers';

import ApplicantAttachment from './ApplicantAttachment';
const fs = require('fs');

const database = require('./../lib/databasemssql');

export class ApplicantAttachmentService {
  constructor(knex, user, division_db) {
    this.knex = knex;
    this.user = user;
    this.division_db = division_db;
    this.db = database.getDb();
  }

  async syncAttachmentsToS3() {
    try {
      let attachmentsAll = await ApplicantAttachment.query(this.knex)
        .whereNull('documentPath')
        .select('attachmentId');
      let tryCount = attachmentsAll.length / 10;
      console.log('ApplicantAttachmentService syncAttachmentsToS3 Start', tryCount, attachmentsAll);
      for (let i = 0; i < tryCount; i++) {
        const attachmentIds = attachmentsAll.slice(i * 10, (i + 1) * 10).map(c => c.attachmentId);
        let attachments = await ApplicantAttachment.query(this.knex).whereIn(
          'attachmentId',
          attachmentIds
        );
        for (let attachment of attachments) {
          // fs.writeFileSync(
          //   `./tmp/applicant_attachments/${attachment.socialSecNum}_${attachment.attachmentId}.pdf`,
          //   attachment.attachment
          // );
          await this.uploadSingleAttachment(attachment);
        }
        console.log('Processed documentPath Null Page', i);
      }
      console.log('ApplicantAttachmentService syncAttachmentsToS3 complete');
    } catch (error) {
      console.log('Error', error);
    }
  }

  async downloadAllAttachments() {
    try {
      let attachments = await ApplicantAttachment.query(this.knex)
        .whereNotNull('documentPath')
        .select(['documentPath', 'attachmentId', 'socialSecNum']);
      for (let attachment of attachments) {
        try {
          await AWSService.downloadFileAndSave(
            attachment.documentPath,
            `./tmp/applicant_attachments/${attachment.socialSecNum}_${attachment.attachmentId}.pdf`
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
    await ApplicantAttachment.query(this.knex)
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
      }/${attachment.attachmentId}_${generateRandomIds()}.${extension}`;
      const mimeContent = extensionMap[extension] || 'application/pdf';

      await AWSService.uploadFileToS3FromContent(
        attachment.attachment,
        key,
        mimeContent,
        ACL_PRIVATE
      );
      await ApplicantAttachment.query(this.knex)
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

  // async updateAttachmentPathsToS3WithoutUpload() {
  //   let attachments = await ApplicantAttachment.query(this.knex)
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

  //     await ApplicantAttachment.query(this.knex)
  //       .where('attachmentId', attachment.attachmentId)
  //       .patch({documentPath: key});
  //   }
  // }
}
