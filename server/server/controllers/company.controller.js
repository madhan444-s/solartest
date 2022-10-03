
import Company from '../models/company.model';
import Employee from '../models/employee.model';
import companyService from '../services/company.service';
import employeeService from '../services/employee.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import roleModel from '../models/role.model';
import EmailService from '../services/email.service'
import serviceUtil from '../utils/service.util';
import config from '../config/config'
import i18nUtil from '../utils/i18n.util';
import sessionUtil from '../utils/session.util';

const emailService = new EmailService()


const controller = "Company";

/**
 *  multiDelete company.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:Company Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await Company.updateMany(
      { _id: { $in: req.body.selectedIds } },
      {
        $set: {
          active: false,
          updated: new Date()
        }
      },
      { multi: true }
    );
  }
  req.entityType = 'company';
  req.activityKey = 'companyDelete';
  // adding company delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get company
 * @param req
 * @param res
 * @returns {details: Company}
 */
async function get(req, res) {
  logger.info('Log:Company Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.company
  });
}// import { Company } from "mocha";


/**
 * Get company list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {companys: companys, pagination: pagination}
 */
async function list(req, res, next) {
  let companys
  logger.info('Log:Company Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req);
  if (query.page === 1) {
    // total count 
    query.pagination.totalCount = await Company.totalCount(query);
  }
  // if (req.tokenInfo && req.tokenInfo._doc._id && req.tokenInfo._doc.role && req.tokenInfo._doc.role != 'Admin') {
  //   query.filter.createdBy = req.tokenInfo._id
  // }
  let roleDetails = {}
  if (req.tokenInfo && req.tokenInfo._doc && req.tokenInfo._doc.role) {
    roleDetails = await roleModel.findOne({ role: req.tokenInfo._doc.role })
  }
  if (!req.query.searchFrom) {
    if (req.tokenInfo && req.tokenInfo._doc && req.tokenInfo._doc._id && roleDetails && roleDetails.roleType && roleDetails.roleType === "Employee") {
      // query.filter.createdBy = req.tokenInfo._doc._id
      query.filter["$or"] = [{ createdBy: { $in: [req.tokenInfo._doc._id] } }, ];
    } else if (req.tokenInfo && req.tokenInfo._doc && req.tokenInfo._doc._id && roleDetails && roleDetails.roleType && roleDetails.roleType === "Manager") {
      let level = 0
      roleDetails.levels ? level = roleDetails.levels : level = 1;
      if (level >= 2) {
        level = level - 1;
        let reportingMembersArray = [req.tokenInfo._doc._id]
        // level = level - 1;
        let reportingMembers = await Employee.find({ reportingTo: req.tokenInfo._doc._id }, { _id: 1 });
        for (let obj of reportingMembers) {
          reportingMembersArray.push(obj._id);
        }
        if (level > 0) {
          var flag = true
          while (flag) {
            if (reportingMembers && reportingMembers.length > 0) {
              let value1 = await employeeService.getEmployees(reportingMembers)
              reportingMembersArray = [...reportingMembersArray, ...value1];
              reportingMembers = JSON.parse(JSON.stringify(value1));
            } else {
              flag = false;
            }
            level = level - 1;
            level == 0 ? flag = false : null
          }
        }
        if (reportingMembersArray.length > 0) {
          // query.filter.createdBy = { $in: reportingMembersArray };
          query.filter["$or"] = [{ createdBy: { $in: reportingMembersArray } }, ];
        }
      } else {
        // query.filter.createdBy = req.tokenInfo._doc._id //ofor Employee crud
        query.filter["$or"] = [{ createdBy: { $in: [req.tokenInfo._doc._id] } }, ];
      }
    }
  }
  req.entityType = 'company';
  // if (req.tokenInfo.loginType === 'employee') {
  //   let query = [{
  //     $match: {
  //       active: true
  //     }
  //   },
  //   { $sort: { created: -1 } },
  //   {
  //     $addFields:
  //       showHide
  //     //  "name": { "$cond": [{ "$eq": ["$name.show", false] }, "$$REMOVE", "$name"] },

  //   },]
  //   companys = await Company.aggregate(query)

  // } else {
  query.dbfields = { _id: 0, password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
      query.limit = query.pagination.totalCount;
  } 
  companys = await Company.list(query);
  // }
  res.json({
    companys: companys,
    pagination: query.pagination
  });
}


/**
 * Load company and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.company = await Company.get(req.params.companyId);
  return next();
}

/**
 * Create new company
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Company Controller:create: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let company = new Company(req.body);
  
  
  
  company = await companyService.setCreateCompanyVariables(req, company);
  req.companyIds= [];
            let results = await Company.find({ active: true }, { _id: 1, companyId: 1 });
            if (results && results.length > 0) {
              results.forEach((v) => { req.companyIds.push(v.companyId) });
              company.companyId = serviceUtil.generateRandomString(6, '#');
              while (req.companyIds.indexOf(company.companyId) > -1) {
                company.companyId = serviceUtil.generateRandomString(6, '#');
              }
            } else {
              company.companyId = serviceUtil.generateRandomString(6, '#');
            }
  req.company = await Company.saveData(company);
  req.entityType = 'company';
  req.activityKey = 'companyCreate';
  
  // adding company create activity
  activityService.insertActivity(req);
  res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing company
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:Company Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let company = req.company;
  
  req.description = await serviceUtil.compareObjects(company, req.body);
  company = Object.assign(company, req.body);
  
  
  company = await companyService.setUpdateCompanyVariables(req, company);
  req.company = await Company.saveData(company);
  req.entityType = 'company';
  req.activityKey = 'companyUpdate';

  // adding company update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete company.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:Company Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let company = req.company;
  company.active = false;
  company = await companyService.setUpdateCompanyVariables(req, company);
  req.company = await Company.saveData(company);
  req.entityType = 'company';
  req.activityKey = 'companyDelete';

  // adding company delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

export default {multidelete,get,list,load,create,update,remove}