import User from '../models/user.model';

import session from '../utils/session.util';
import activityService from './activity.service';
import i18nService from '../utils/i18n.util';
/**
 * set User variables
 * @returns {User}
 */
const setCreateUserVariables = async (req, user) => {
  if (req.tokenInfo) {
    user.createdBy = session.getSessionLoginID(req);
    user.userId = session.getSessionLoginID(req);
    user.userName = session.getSessionLoginName(req);
    // user.status = "Pending";
    user.userEmail = session.getSessionLoginEmail(req);
  };
  
  user.created = Date.now();
  return user;
};


/**
 * set User update variables
 * @returns {User}
 */
const setUpdateUserVariables = async (req, user) => {
  
  if (req.tokenInfo) {
    user.updatedBy = session.getSessionLoginID(req);
  };
  user.updated = Date.now();
  return user;
};

/**
 * insert Employees bulk data
 * @returns {Employees}
 */
async function insertUserData(req, res) {
  req.duplicates = [];
  let obj = req.obj;
  for (let val in obj) {
    try {
      let validateRes = await validateFields(req, obj[val])
      if (validateRes) {
        obj[val].reason = req.errorMessage
        req.duplicates.push(obj[val]);
        delete obj[val];
      } else {
        let user = new User(obj[val])
        const uniqueEmail = await User.findUniqueEmail(user.email);
        if (uniqueEmail) {
          req.i18nKey = 'emailExists';
          obj[val].reason = i18nService.getI18nMessage(req.i18nKey)
          req.duplicates.push(obj[val]);
          delete obj[val];
        }
         
        else {
          user = await setCreateUserVariables(req, user);
          req.user = await User.saveData(user);
          req.entityType = 'user';
          req.activityKey = 'userCreate';
          await activityService.insertActivity(req);
        }
      }
    }
    catch (err) {
      obj[val].reason = "Error while creating User" + err;
      req.duplicates.push(obj[val]);
      delete obj[val];
    }
  };
  return obj;
};

/**
 * TO get the Login cruds records
 * @returns {User}
 */
const getEmployees = async (members) => {
  let reportingMembersArray = [];
  if (members && members.length > 0) {
    for (let id of members) {
      let reportingMembers = await User.find({ reportingTo: id }, { _id: 1 });
      if (reportingMembers && reportingMembers.length > 0) {
        for (let obj of reportingMembers) {
          reportingMembersArray.push(obj._id);
        }
      }
    }
  }

  return reportingMembersArray
}

const validateFields = async (req, user) => {
  let isError = false;
  
  return isError
}

export default {
  setCreateUserVariables,
  setUpdateUserVariables,
  insertUserData,
  getEmployees,
  validateFields
};