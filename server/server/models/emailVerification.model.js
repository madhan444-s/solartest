import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import APIError from '../helpers/APIError';

import EmailVerificationSchemaJson from '../schemas/emailVerification.json';

const Schema = mongoose.Schema;

let defaultSchemaValues = {
  active: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  }
};
/**
 * EmailVerification Schema
 */
const EmailVerificationSchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...EmailVerificationSchemaJson
}, { usePushEach: true });
/**
 * Statics
 */
EmailVerificationSchema.statics = {
  /**
   * save and update emailVerification
   * @param emailVerification
   * @returns {Promise<EmailVerification, APIError>}
   */
  saveData(emailVerification) {
    return emailVerification.save()
      .then((emailVerification) => {
        if (emailVerification) {
          return emailVerification;
        }
        const err = new APIError('Error in user', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
    * List task in descending order of 'createdAt' timestamp.
    * @returns {Promise<EmailVerification[]>}
    */
  list(query) {
    return this.find(query.filter)
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },
  /**
    * Count of emailVerification records
    * @returns {Promise<EmailVerification[]>}
    */
  totalCount(query) {
    console.log(query)
    return this.find(query.filter)
      .countDocuments();
  },

  /**
     * Get emailVerification
     * @param {ObjectId} id - The objectId of emailVerification.
     * @returns {Promise<EmailVerification, APIError>}
     */
  get(id) {
    return this.findById(id)
      .exec()
      .then((emailVerification) => {
        if (emailVerification) {
          return emailVerification;
        }
        const err = new APIError('No such emailVerification exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },
};

/**
 * @typedef EmailVerification
 */
export default mongoose.model('EmailVerification', EmailVerificationSchema);




