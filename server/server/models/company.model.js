import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import string from 'joi/lib/types/string';

const CompanySchemaJson = require('../schemas/company.json');
const Schema = mongoose.Schema;

/**
 * Default Scheamas
 */
let defaultSchemaValues = {
  // created: {
  //   type: Date
  // },
  // updated: {
  //   type: Date
  // },
  // createdBy: {
  //   type: String
  // },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },updatedBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },
};


/**
 * Company Schema
 */
const CompanySchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...CompanySchemaJson
}, { usePushEach: true });

/**
 * Statics
 */
CompanySchema.statics = {
  /**
   * save and update company
   * @param company
   * @returns {Promise<Company, APIError>}
   */
  saveData(company) {
    return company.save()
      .then((company) => {
        if (company) {
          return company;
        }
        const err = new APIError('Error in company', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * Get company
   * @param {ObjectId} id - The objectId of company.
   * @returns {Promise<Company, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((company) => {
        if (company) {
          return company;
        }
        const err = new APIError('No such company exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List company in descending order of 'createdAt' timestamp.
   * @returns {Promise<Company[]>}
   */
  list(query) {
    return this.find(query.filter, query.dbfields)
    .populate('createdBy',"name ") .populate('updatedBy',"name ") 
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },
  /**
   * Count of company records
   * @returns {Promise<Company[]>}
   */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  }

};

/**
 * @typedef Company
 */
export default mongoose.model('Company', CompanySchema);
