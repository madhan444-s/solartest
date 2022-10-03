import Promise from 'bluebird';
import crypto from 'crypto';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import mongooseFloat from 'mongoose-float';

import APIError from '../helpers/APIError';


const Float = mongooseFloat.loadType(mongoose);
const Schema = mongoose.Schema;

const UserSchemaJson = require('../schemas/user.json');

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
  createdBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },updatedBy: {
                  type: Schema.ObjectId,
                  ref: 'Employee'
                },
};

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...UserSchemaJson
}, { usePushEach: true });


/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to user the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    let result = owasp.user(this.password);
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
UserSchema.methods = {
  /**
  * Create instance method for authenticating user
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


UserSchema.statics = {

  /**
   * save and update User
   * @param User
   * @returns {Promise<User, APIError>}
   */
  saveData(user) {
    return user.save()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('error in user', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });

  },

  /**
 * List user in descending order of 'createdAt' timestamp.
 * @returns {Promise<user[]>}
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
   * Count of user records
   * @returns {Promise<user[]>}
   */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  },
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<user, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
  },

  /**
   * Find unique email.
   * @param {string} email.
   * @returns {Promise<User[]>}
   */
  findUniqueEmail(email) {
    email = email.toLowerCase();
    return this.findOne({
      email: email,
      active: true
    })
      .exec()
      .then((user) => user);
  }
}

export default mongoose.model('User', UserSchema);
