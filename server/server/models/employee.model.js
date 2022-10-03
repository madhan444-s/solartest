import Promise from 'bluebird';
import crypto from 'crypto';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import mongooseFloat from 'mongoose-float';

import APIError from '../helpers/APIError';


const Float = mongooseFloat.loadType(mongoose);
const Schema = mongoose.Schema;

const EmployeeSchemaJson = require('../schemas/employee.json');

/**
 * Default Scheamas
 */
let defaultSchemaValues = {
  password: String,
  salt: String,
  forgotPasswordExpireTimeStamp: Number,
  photo: String,
  email: String,
  role: { type: String, default: '' },
  // created: {
  //   type: Date
  // },
  // updated: {
  //   type: Date
  // },
  firstTimeLogin: {
    type: Boolean,
  },
  active: {
    type: Boolean,
    default: true
  },
  reportingTo: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },createdBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },updatedBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },
};

/**
 * Employee Schema
 */
const EmployeeSchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...EmployeeSchemaJson
}, { usePushEach: true });


/**
 * Hook a pre save method to hash the password
 */
EmployeeSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to employee the local password
 */
EmployeeSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    let result = owasp.employee(this.password);
    if (result.errors.length) {
      let error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
EmployeeSchema.methods = {
  /**
  * Create instance method for authenticating employee
  * @param {password}
  */
  authenticate(password) {
    return this.password === this.hashPassword(password);
  },

  /**
  * Create instance method for hashing a password
  * @param {password}
  */
  hashPassword(password) {
    if (this.salt && password) {
      return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64, 'SHA1').toString('base64');
    } else {
      return password;
    }
  }
};


EmployeeSchema.statics = {

  /**
   * save and update Employee
   * @param Employee
   * @returns {Promise<Employee, APIError>}
   */
  saveData(employee) {
    return employee.save()
      .then((employee) => {
        if (employee) {
          return employee;
        }
        const err = new APIError('error in employee', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });

  },

  /**
 * List employee in descending order of 'createdAt' timestamp.
 * @returns {Promise<employee[]>}
 */
  list(query) {
    return this.find(query.filter, query.dbfields)
    .populate('reportingTo',"name ") .populate('createdBy',"name ") .populate('updatedBy',"name ") 
      .sort(query.sorting)
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },

  /**
   * Count of employee records
   * @returns {Promise<employee[]>}
   */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  },
  /**
   * Get employee
   * @param {ObjectId} id - The objectId of employee.
   * @returns {Promise<employee, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((employee) => {
        if (employee) {
          return employee;
        }
        const err = new APIError('No such employee exists', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
  },

  /**
   * Find unique email.
   * @param {string} email.
   * @returns {Promise<Employee[]>}
   */
  findUniqueEmail(email) {
    email = email.toLowerCase();
    return this.findOne({
      email: email,
      active: true
    })
      .exec()
      .then((employee) => employee);
  }
}

export default mongoose.model('Employee', EmployeeSchema);
