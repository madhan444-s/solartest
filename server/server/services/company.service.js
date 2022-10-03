import Company from '../models/company.model';

import session from '../utils/session.util';
import activityService from './activity.service';
/**
 * set Company variables
 * @returns {Company}
 */
const setCreateCompanyVariables = async (req, company) => {
  if (req.tokenInfo) {
    company.createdBy = session.getSessionLoginID(req);
    company.userId = session.getSessionLoginID(req);
    company.userName = session.getSessionLoginName(req);
    // company.status = "Pending";
    company.userEmail = session.getSessionLoginEmail(req);
  };
  
  company.created = Date.now();
  return company;
};


/**
 * set Company update variables
 * @returns {Company}
 */
const setUpdateCompanyVariables = async (req, company) => {
  
  if (req.tokenInfo) {
    company.updatedBy = session.getSessionLoginID(req);
  };
  company.updated = Date.now();
  return company;
};

/**
 * insert Employees bulk data
 * @returns {Employees}
 */
async function insertCompanyData(req, res) {
  req.duplicates = [];
  let obj = req.obj;
  for (let val in obj) {
    try {
      let validateRes = await validateFields(req, obj[val])
      if (validateRes) {
        obj[val].reason = req.errorMessage
        req.duplicates.push(obj[val]);
        delete obj[val];
      }
       
      else {
        let company = new Company(obj[val])
        company = await setCreateCompanyVariables(req, company);
        req.company = await Company.saveData(company);
        req.entityType = 'company';
        req.activityKey = 'companyCreate';
        await activityService.insertActivity(req);
      }
    }
    catch (err) {
      obj[val].reason = "Error while creating Company" + err;
      req.duplicates.push(obj[val]);
      delete obj[val];
    }
  };
  return obj;
};

const validateFields = async (req, company) => {
  let isError = false;
  
  return isError
}

export default {
  setCreateCompanyVariables,
  setUpdateCompanyVariables,
  insertCompanyData,
  validateFields
};