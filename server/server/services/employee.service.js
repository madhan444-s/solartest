import Employee from '../models/employee.model';

import session from '../utils/session.util';
import activityService from './activity.service';
import i18nService from '../utils/i18n.util';
/**
 * set Employee variables
 * @returns {Employee}
 */
const setCreateEmployeeVariables = async (req, employee) => {
  if (req.tokenInfo) {
    employee.createdBy = session.getSessionLoginID(req);
    employee.userId = session.getSessionLoginID(req);
    employee.userName = session.getSessionLoginName(req);
    // employee.status = "Pending";
    employee.userEmail = session.getSessionLoginEmail(req);
  };
  
  employee.created = Date.now();
  return employee;
};


/**
 * set Employee update variables
 * @returns {Employee}
 */
const setUpdateEmployeeVariables = async (req, employee) => {
  
  if (req.tokenInfo) {
    employee.updatedBy = session.getSessionLoginID(req);
  };
  employee.updated = Date.now();
  return employee;
};

/**
 * insert Employees bulk data
 * @returns {Employees}
 */
async function insertEmployeeData(req, res) {
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
        let employee = new Employee(obj[val])
        const uniqueEmail = await Employee.findUniqueEmail(employee.email);
        if (uniqueEmail) {
          req.i18nKey = 'emailExists';
          obj[val].reason = i18nService.getI18nMessage(req.i18nKey)
          req.duplicates.push(obj[val]);
          delete obj[val];
        }
         
        else {
          employee = await setCreateEmployeeVariables(req, employee);
          req.employee = await Employee.saveData(employee);
          req.entityType = 'employee';
          req.activityKey = 'employeeCreate';
          await activityService.insertActivity(req);
        }
      }
    }
    catch (err) {
      obj[val].reason = "Error while creating Employee" + err;
      req.duplicates.push(obj[val]);
      delete obj[val];
    }
  };
  return obj;
};

/**
 * TO get the Login cruds records
 * @returns {Employee}
 */
const getEmployees = async (members) => {
  let reportingMembersArray = [];
  if (members && members.length > 0) {
    for (let id of members) {
      let reportingMembers = await Employee.find({ reportingTo: id }, { _id: 1 });
      if (reportingMembers && reportingMembers.length > 0) {
        for (let obj of reportingMembers) {
          reportingMembersArray.push(obj._id);
        }
      }
    }
  }

  return reportingMembersArray
}

const validateFields = async (req, employee) => {
  let isError = false;
  
  return isError
}

export default {
  setCreateEmployeeVariables,
  setUpdateEmployeeVariables,
  insertEmployeeData,
  getEmployees,
  validateFields
};