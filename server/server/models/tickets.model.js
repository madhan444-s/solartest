import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import crypto from 'crypto';
import mongooseFloat from 'mongoose-float';
const Float = mongooseFloat.loadType(mongoose);

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

import TicketSchemaJson from '../schemas/tickets.json';


let defaultSchemaValues = {
  assignedTo: {
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  country: {
    type: String
  },
  createdBy: {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    employee: {
      type: Schema.ObjectId,
      ref: 'Employee'
    }
  },
  updatedBy: {
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    employee: {
      type: Schema.ObjectId,
      ref: 'Employee'
    }
  },
  comments: [
    {
      message: String,
      postedBy: {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        employee: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        }
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ]
}

/**
 * ticket Schema
 */
const TicketSchema = new mongoose.Schema({
  ...defaultSchemaValues,
  ...TicketSchemaJson
}, { usePushEach: true });

TicketSchema.statics = {

  /**
   * save and update Ticket
   * @param Ticket
   * @returns {Promise<Ticket, APIError>}
   */
  saveData(ticket) {
    return ticket.save()
      .then((ticket) => {
        if (ticket) {
          return ticket;
        }
        const err = new APIError('error in ticket', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });

  },

  /**
 * List Ticket in descending order of 'createdAt' timestamp.
 * @returns {Promise<ticket[]>}
 */
  list(query) {
    return this.find(query.filter)
      .sort(query.sorting)
      .populate('createdBy.user', 'firstname lastname userId userName profilePic')
      .populate('createdBy.employee', 'firstName lastName displayName profilePic')
      .populate('assignedTo', 'firstName lastName displayName profilePic')
      .populate('comments.postedBy.user', 'firstname lastname userId userName profilePic')
      .populate('comments.postedBy.employee', 'firstName lastName displayName profilePic')
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .exec();
  },

  /**
 * Count of ticket records
 * @returns {Promise<ticket[]>}
 */
  totalCount(query) {
    return this.find(query.filter)
      .countDocuments();
  },

  /**
   * Get ticket
   * @param {ObjectId} id - The objectId of ticket.
   * @returns {Promise<ticket, APIError>}
   */
  get(id) {
    return this.findById(id)
      .populate('createdBy.user', 'firstname lastname userId userName profilePic')
      .populate('createdBy.employee', 'firstName lastName displayName profilePic')
      .populate('assignedTo', 'firstName lastName displayName profilePic')
      .populate('comments.postedBy.user', 'firstname lastname userId userName profilePic')
      .populate('comments.postedBy.employee', 'firstName lastName displayName profilePic')
      .exec()
      .then((ticket) => {
        if (ticket) {
          return ticket;
        }
        const err = new APIError('No such ticket exists', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      })
  },

  /**
   * Get LastTicket
   * @param {ObjectId} id - The objectId of ticket.
   * @returns {Promise<ticket, APIError>}
   */
  getLastTicket() {
    return this.findOne({ 'active': true })
      .sort({ 'created': -1 })
      .exec();
  },

  /**
   * reply to ticket
   * @param {ObjectId} id - The objectId of ticket.
   * @returns {Promise<ticket, APIError>}
   */
  replyTicket(req, newvalues) {
    return this.update({ '_id': req.query.ticketId }, newvalues)
      .exec();
  },

  /**
   * get tickets count based on users 
   * @returns {Promise<ticket[]>}
   */
  getTicketCounts(query) {
    return this.aggregate(query)
      .exec()
      .then((ticket) => {
        if (ticket) {
          return ticket;
        }
        const err = new APIError('No tickets exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  }
}

export default mongoose.model('Ticket', TicketSchema);
