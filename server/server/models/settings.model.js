import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

import APIError from '../helpers/APIError';

import SettingsSchemaJson from '../schemas/settings.json';

const Schema = mongoose.Schema;

let defaultSchemaValues = {
  companyName: String,
  companyImg: String,
  contactPerson: String,
  contactMail: String,
  contactNumber: String,
  contactAddress: String,
  sendGridApiKey: String,
  sendGridEmail: String,
  emailSourceType: String,
  logs: Array,
  updated: Date,
  nodeMailerHost: String,
  nodeMailerUser: String,
  nodeMailerPass: String,
  updatedBy: {
    employee: { type: Schema.ObjectId, ref: 'Employee' },
    user: { type: Schema.ObjectId, ref: 'User' }
  },
  created: { type: Date, default: Date.now },
  adminExpireTokenTime: { type: Number, default: 180000000000 },
  adminExpireTokenTimeInMin: { type: Number, default: 60 },
  expireTokenTime: { type: Number, default: 180000000000 },
  expireTokenTimeInMin: { type: Number, default: 60 },
  active: { type: Boolean, default: true },
  enableMails: { type: Boolean, default: false },
  disableMultipleLogin: { type: Boolean, default: true },
  enableTerminalLogs: { type: Boolean, default: true },
}
/**
 * SettingsSchema
 */
const SettingsSchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...SettingsSchemaJson
}, { usePushEach: true });
/**
 * Statics
 */
SettingsSchema.statics = {
  /**
   * save and update settings
   * @param settings
   * @returns {Promise<Settings, APIError>}
   */
  saveData(settings) {
    return settings.save()
      .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('Error in user', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
    * List task in descending order of 'createdAt' timestamp.
    * @returns {Promise<Settings[]>}
    */
  list(query) {
    return this.find(query.filter)
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },
  /**
    * Count of settings records
    * @returns {Promise<Settings[]>}
    */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  },

  /**
     * Get settings
     * @param {ObjectId} id - The objectId of settings.
     * @returns {Promise<Settings, APIError>}
     */
  get(id) {
    return this.findById(id)
      .exec()
      .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('No such settings exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  createBankDetails(query) {
    return this.findOne(query.filter)
      .exec()
      .then((settings) => {
        if (settings) {
          return settings;
        }
        const err = new APIError('No such settings exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
};

/**
 * @typedef Settings
 */
export default mongoose.model('Settings', SettingsSchema);






