import Employee from '../models/employee.model';
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


const controller = "Employee";

/**
 * Create new employee
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
 async function register(req, res) {
    logger.info('Log:Employee Controller:register: body :' + JSON.stringify(req.body), controller);
  
    await serviceUtil.checkPermission(req, res, "Edit", controller);
    let employee = new Employee(req.body);
  
    //check email exists or not
    const uniqueEmail = await Employee.findUniqueEmail(employee.email);
    if (uniqueEmail) {
      req.i18nKey = 'emailExists';
      logger.error('Error:employee Controller:register:' + i18nUtil.getI18nMessage('emailExists'), controller);
      return res.json(respUtil.getErrorResponse(req));
    }
    
    
    
    employee = await employeeService.setCreateEmployeeVariables(req, employee)
    
    req.employee = await Employee.saveData(employee);
    req.employee.password = req.employee.salt = undefined;
    req.entityType = 'employee';
    req.activityKey = 'employeeRegister';
    activityService.insertActivity(req);
    if (req.body.email) {
 emailService.sendEmailviaGrid({
   templateName: config.emailTemplates.register,
   entityType: req.entityType || sessionUtil.getLoginType(req),
  emailParams: {
   to: req.body.email
        // link: templateInfo.clientUrl + '#/changeRecoverPassword/' + req.token + '?active=true'
  }
  });
  }
    //send email to employee
    // emailService.sendEmail(req, res);
    // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
    // emailService.sendEmailviaGrid({
    //   templateName: config.emailTemplates.employeeWelcome,
    //   emailParams: {
    //     to: employee.email,
    //     displayName: employee.displayName,
    //     Id: req.employee._id,
    //     link: templateInfo.adminUrl
    //   }
    // });
    logger.info('Log:employee Controller:register:' + i18nUtil.getI18nMessage('employeeCreate'), controller);
    return res.json(respUtil.createSuccessResponse(req));
  }
  

/**
 *  multiDelete employee.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:Employee Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await Employee.updateMany(
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
  req.entityType = 'employee';
  req.activityKey = 'employeeDelete';
  // adding employee delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get employee
 * @param req
 * @param res
 * @returns {details: Employee}
 */
async function get(req, res) {
  logger.info('Log:Employee Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.employee
  });
}// import { Employee } from "mocha";


/**
 * Get employee list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {employees: employees, pagination: pagination}
 */
async function list(req, res, next) {
  let employees
  logger.info('Log:Employee Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req);
  if (query.page === 1) {
    // total count 
    query.pagination.totalCount = await Employee.totalCount(query);
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
        level = level - 1;
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
          // query.filter.reportingTo = { $in: reportingMembersArray };
          query.filter["$or"] = [{ reportingTo: { $in: reportingMembersArray } }, ];
        }
      } else {
        // query.filter.reportingTo = req.tokenInfo._doc._id //ofor Employee crud
        query.filter["$or"] = [{ reportingTo: { $in: [req.tokenInfo._doc._id] } }, ];
      }
    }
  }
  req.entityType = 'employee';
  query.dbfields = { _id: 0, password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
    query.limit = query.pagination.totalCount;
  }
  employees = await Employee.list(query);
  res.json({
    employees: employees,
    pagination: query.pagination
  });
}


/**
 * Load employee and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.employee = await Employee.get(req.params.employeeId);
  return next();
}

/**
 * Create new employee
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Employee Controller:create: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let employee = new Employee(req.body);

  //check email exists or not
  const uniqueEmail = await Employee.findUniqueEmail(employee.email);
  if (uniqueEmail) {
    req.i18nKey = 'emailExists';
    logger.error('Error:employee Controller:create:' + i18nUtil.getI18nMessage('emailExists'), controller);
    return res.json(respUtil.getErrorResponse(req));
  }
  
  
  
  employee = await employeeService.setCreateEmployeeVariables(req, employee)
  
  req.employee = await Employee.saveData(employee);
  req.employee.password = req.employee.salt = undefined;
  req.entityType = 'employee';
  req.activityKey = 'employeeCreate';
  activityService.insertActivity(req);
  if (req.body.email) {
 emailService.sendEmailviaGrid({
   templateName: config.emailTemplates.register,
   entityType: req.entityType || sessionUtil.getLoginType(req),
  emailParams: {
   to: req.body.email
        // link: templateInfo.clientUrl + '#/changeRecoverPassword/' + req.token + '?active=true'
  }
  });
  }
  //send email to employee
  // emailService.sendEmail(req, res);
  // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
  // emailService.sendEmailviaGrid({
  //   templateName: config.emailTemplates.employeeWelcome,
  //   emailParams: {
  //     to: employee.email,
  //     displayName: employee.displayName,
  //     Id: req.employee._id,
  //     link: templateInfo.adminUrl
  //   }
  // });
  logger.info('Log:employee Controller:create:' + i18nUtil.getI18nMessage('employeeCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}


/**
 * Update existing employee
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:Employee Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let employee = req.employee;
  
  req.description = await serviceUtil.compareObjects(employee, req.body);
  employee = Object.assign(employee, req.body);
  
  
  employee = await employeeService.setUpdateEmployeeVariables(req, employee);
  req.employee = await Employee.saveData(employee);
  req.entityType = 'employee';
  req.activityKey = 'employeeUpdate';

  // adding employee update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete employee.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:Employee Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let employee = req.employee;
  employee.active = false;
  employee = await employeeService.setUpdateEmployeeVariables(req, employee);
  req.employee = await Employee.saveData(employee);
  req.entityType = 'employee';
  req.activityKey = 'employeeDelete';

  // adding employee delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

export default {register,multidelete,get,list,load,create,update,remove}