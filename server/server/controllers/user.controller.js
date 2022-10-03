import User from '../models/user.model';
import userService from '../services/user.service';
import activityService from '../services/activity.service';
import respUtil from '../utils/resp.util';
import roleModel from '../models/role.model';
import EmailService from '../services/email.service'
import serviceUtil from '../utils/service.util';
import config from '../config/config'
import i18nUtil from '../utils/i18n.util';
import sessionUtil from '../utils/session.util';

const emailService = new EmailService()


const controller = "User";

/**
 * Create new user
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
 async function register(req, res) {
    logger.info('Log:User Controller:register: body :' + JSON.stringify(req.body), controller);
  
    await serviceUtil.checkPermission(req, res, "Edit", controller);
    let user = new User(req.body);
  
    //check email exists or not
    const uniqueEmail = await User.findUniqueEmail(user.email);
    if (uniqueEmail) {
      req.i18nKey = 'emailExists';
      logger.error('Error:user Controller:register:' + i18nUtil.getI18nMessage('emailExists'), controller);
      return res.json(respUtil.getErrorResponse(req));
    }
    
    
    
    user = await userService.setCreateUserVariables(req, user)
    
    req.user = await User.saveData(user);
    req.user.password = req.user.salt = undefined;
    req.entityType = 'user';
    req.activityKey = 'userRegister';
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
    //send email to user
    // emailService.sendEmail(req, res);
    // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
    // emailService.sendEmailviaGrid({
    //   templateName: config.emailTemplates.userWelcome,
    //   emailParams: {
    //     to: user.email,
    //     displayName: user.displayName,
    //     Id: req.user._id,
    //     link: templateInfo.adminUrl
    //   }
    // });
    logger.info('Log:user Controller:register:' + i18nUtil.getI18nMessage('userCreate'), controller);
    return res.json(respUtil.createSuccessResponse(req));
  }
  

/**
 *  multiDelete user.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function multidelete(req, res, next) {
  logger.info('Log:User Controller:multidelete: query,body :' + JSON.stringify(req.query, req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await User.updateMany(
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
  req.entityType = 'user';
  req.activityKey = 'userDelete';
  // adding user delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

/**
 * Get user
 * @param req
 * @param res
 * @returns {details: User}
 */
async function get(req, res) {
  logger.info('Log:User Controller:get: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  res.json({
    details: req.user
  });
}// import { User } from "mocha";


/**
 * Get user list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {users: users, pagination: pagination}
 */
async function list(req, res, next) {
  let users
  logger.info('Log:User Controller:list: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "View", controller);
  const query = await serviceUtil.generateListQuery(req);
  if (query.page === 1) {
    // total count 
    query.pagination.totalCount = await User.totalCount(query);
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
        let reportingMembers = await User.find({ reportingTo: req.tokenInfo._doc._id }, { _id: 1 });
        for (let obj of reportingMembers) {
          reportingMembersArray.push(obj._id);
        }
        if (level > 0) {
          var flag = true
          while (flag) {
            if (reportingMembers && reportingMembers.length > 0) {
              let value1 = await userService.getEmployees(reportingMembers)
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
  req.entityType = 'user';
  query.dbfields = { _id: 0, password: 0, salt: 0, _v: 0 };
  if (req.query.type === 'exportToCsv') {
    query.limit = query.pagination.totalCount;
  }
  users = await User.list(query);
  res.json({
    users: users,
    pagination: query.pagination
  });
}


/**
 * Load user and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.user = await User.get(req.params.userId);
  return next();
}

/**
 * Create new user
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:User Controller:create: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let user = new User(req.body);

  //check email exists or not
  const uniqueEmail = await User.findUniqueEmail(user.email);
  if (uniqueEmail) {
    req.i18nKey = 'emailExists';
    logger.error('Error:user Controller:create:' + i18nUtil.getI18nMessage('emailExists'), controller);
    return res.json(respUtil.getErrorResponse(req));
  }
  
  
  
  user = await userService.setCreateUserVariables(req, user)
  
  req.user = await User.saveData(user);
  req.user.password = req.user.salt = undefined;
  req.entityType = 'user';
  req.activityKey = 'userCreate';
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
  //send email to user
  // emailService.sendEmail(req, res);
  // let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));
  // emailService.sendEmailviaGrid({
  //   templateName: config.emailTemplates.userWelcome,
  //   emailParams: {
  //     to: user.email,
  //     displayName: user.displayName,
  //     Id: req.user._id,
  //     link: templateInfo.adminUrl
  //   }
  // });
  logger.info('Log:user Controller:create:' + i18nUtil.getI18nMessage('userCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}


/**
 * Update existing user
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:User Controller:update: body :' + JSON.stringify(req.body));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let user = req.user;
  
  req.description = await serviceUtil.compareObjects(user, req.body);
  user = Object.assign(user, req.body);
  
  
  user = await userService.setUpdateUserVariables(req, user);
  req.user = await User.saveData(user);
  req.entityType = 'user';
  req.activityKey = 'userUpdate';

  // adding user update activity
  activityService.insertActivity(req);
  res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Delete user.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:User Controller:remove: query :' + JSON.stringify(req.query));
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let user = req.user;
  user.active = false;
  user = await userService.setUpdateUserVariables(req, user);
  req.user = await User.saveData(user);
  req.entityType = 'user';
  req.activityKey = 'userDelete';

  // adding user delete activity
  activityService.insertActivity(req);
  res.json(respUtil.removeSuccessResponse(req));
};

export default {register,multidelete,get,list,load,create,update,remove}