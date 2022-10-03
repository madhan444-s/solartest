import config from '../config/config';

import Activity from '../models/activity.model';
import Roles from '../models/role.model';
import Settings from '../models/settings.model';

import Employee from '../models/employee.model';
import User from '../models/user.model';


import activityService from '../services/activity.service';
import EmailService from '../services/email.service';
// import socketBeforeService from '../services/socket.before.service';

import tokenService from '../services/token.service';


import dateUtil from '../utils/date.util';
import i18nUtil from '../utils/i18n.util';
import respUtil from '../utils/resp.util';
import serviceUtil from '../utils/service.util';
import sessionUtil from '../utils/session.util';

const emailService = new EmailService();
const controller = "Auth";
const validLoginTypes = ["user", "employee", "user"]

/**
 * login response
 * @param req
 * @param res
 * @param user
 * @returns {*}
 */
async function loginResponse(req, res, user) {
  // remove exisisting token and save new token
  await tokenService.removeTokenAndSaveNewToken(req);

  // adding login activity
  await activityService.insertActivity(req);
  return res.json(respUtil.loginSuccessResponse(req));
}

/**
 * login response
 * @param req
 * @param res
 * @param user
 * @returns {*}
 */
async function sendLoginResponse(req, res) {
  req.entityType = 'user';
  // adding login activity
  await activityService.insertActivity(req);
  // send login user count to admin users by socket
  // if (req.entityType === 'user') {
  //   socketBeforeService.sendStatsForAdminDashboard({ data: { sendLiveUsers: true } });
  // };
  return res.json(respUtil.loginSuccessResponse(req));
}

async function checkDeviceInfo(req, details) {
  if (req.body.deviceInfo) {
    let count = 0;
    if (details.deviceName.length > 0) {
      for (let deviceInfo of details.deviceName) {
        if ((deviceInfo.osName != req.body.deviceInfo.osName
          || deviceInfo.browserType != req.body.deviceInfo.browserType
          || deviceInfo.ipAddress != req.body.deviceInfo.ipAddress)) {
          count++;
        }
      }
    }
    if (count == details.deviceName.length) {
      if (details.deviceName.length < 1) {
        details.deviceName.push(req.body.deviceInfo);
        details.isDifferentDevice = false
      } else {
        let randomNumber = await serviceUtil.generateRandomNumber(100000, 999999)
        details.OTP = randomNumber
        details.OTPDate = new Date();
        emailService.sendEmailviaGrid({
          templateName: config.emailTemplates.differentDeviceLoginConfirmation,
          emailParams: {
            to: req.body.email,
            displayName: details.displayName,
            osName: req.body.deviceInfo.osName,
            browserType: req.body.deviceInfo.browserType,
            searchEngine: req.body.deviceInfo.searchEngine,
            engineVersion: req.body.deviceInfo.engineVersion,
            ipAddress: req.body.deviceInfo.ipAddress,
            OTP: details.OTP
          }
        });
        // smsService.sendSMS(details, config.messages.differentDeviceLogin)
        details.isDifferentDevice = true;
      }
      if (entityType === 'employee')
  await Employee.saveData(req.details);
if (entityType === 'user')
  await User.saveData(req.details);

    }
  }
}
/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  logger.info('Log:Auth Controller:login: body :' + JSON.stringify(req.body), controller);
  req.i18nKey = 'loginError';

  let entityType = req.body.entityType;
  let email = req.body.email;

  if (!validLoginTypes.includes(entityType)) {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }

  // check email from datbase
  if (entityType === 'employee') {
  req.details = await Employee.findUniqueEmail(email);
}
if (entityType === 'user') {
  req.details = await User.findUniqueEmail(email);
}

  req.entityType = `${entityType}`;
  req.activityKey = `${entityType}LoginSuccess`;
  req.description = `${entityType} logged in`;
  if (!req.details) {
    req.i18nKey = 'invalidEmail';
    return res.json(respUtil.getErrorResponse(req));
  };
  if (req.details && req.details.status && req.details.status !== 'Active') {
    req.i18nKey = 'activateYourAcount';
    return res.json(respUtil.getErrorResponse(req));
  }
  req.i18nKey = `${entityType}InactiveStatusMessage`;
  // check inactive status
  if (req.details && req.details.status && req.details.status === config.commonStatus.Inactive) {
    logger.error('Error:auth Controller:loginResponse:' + i18nUtil.getI18nMessage(req.i18nKey), controller);
    return res.json(respUtil.getErrorResponse(req));
  }

  // compare authenticate password 
  if (!req.details.authenticate(req.body.password)) {
    req.i18nKey = 'invalidPassword';
    logger.error('Error:auth Controller:login:' + i18nUtil.getI18nMessage(req.i18nKey), controller);
    return res.json(respUtil.getErrorResponse(req));
  }
  // checkDeviceInfo(req, req.details);
  let rolePermissions = await Roles.findUniqueRole(req.details.role);
  // return an error if employee role permissions is not found
  if (!rolePermissions) {
    req.i18nKey = 'rolePermissionsNotFound';
    logger.error('Error:Auth Controller:login:' + i18nUtil.getI18nMessage(req.i18nKey));
    return res.json(respUtil.getErrorResponse(req));
  }
  console.log("roleleeeeeee")
  console.log(rolePermissions.permissions)
  let newobj = { rolePermissions: rolePermissions.permissions }
  // details.rolePermissions = rolePermissions.permissions;
  req.details = { ...req.details._doc, ...newobj }

  req.details.password = undefined;
  req.details.salt = undefined;
  req[entityType] = req.details;
  req.i18nKey = 'loginSuccessMessage';
  loginResponse(req, res, req.details);
}


/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

//log out for Admin and User
async function logout(req, res) {

  logger.info('Log:Auth Controller:logout: query :' + JSON.stringify(req.query), controller);
  let responseJson = {};
  let activity = new Activity();
  activity.type = 'LOGOUT';
  // if (sessionUtil.getTokenInfo(req, 'loginType') === 'user') {
  //   activity.userId = sessionUtil.getTokenInfo(req, '_id');
  //   req.activityKey = 'userLogoutSuccess';
  // } else if (sessionUtil.getTokenInfo(req, 'loginType') === 'employee') {
  //   activity.employeeId = sessionUtil.getTokenInfo(req, '_id');
  //   req.activityKey = 'employeeLogoutSuccess';
  // }
  if (sessionUtil.getTokenInfo(req, 'loginType') === 'employee') {
    activity.employeeId = sessionUtil.getTokenInfo(req, '_id');
    req.activityKey = 'employeeLogoutSuccess';
}if (sessionUtil.getTokenInfo(req, 'loginType') === 'user') {
    activity.userId = sessionUtil.getTokenInfo(req, '_id');
    req.activityKey = 'userLogoutSuccess';
}
  await tokenService.deleteToken(req)
  await activityService.insertActivity(req);
  responseJson = {
    details: req.Activity
  };
  req.i18nKey = 'logoutMessage';
  logger.info('Log:auth Controller:logout:' + i18nUtil.getI18nMessage("logoutMessage"), controller);
  return res.json(respUtil.logoutSuccessResponse(req));
}

/**
 * 
 *Sends the Email for the forgot password. 
 */
async function forgotPassword(req, res) {
  let templateInfo = JSON.parse(JSON.stringify(config.mailSettings));

  //check for the account type if the account type does not exists throws the error.
  let entityType = req.body.entityType
  if (req.body.entityType === 'employee') {
    //Email exists check
    req.details = await Employee.findUniqueEmail(req.query.email);
    req.url = templateInfo.adminUrl;
}else if (req.body.entityType === 'user') {
    //Email exists check
    req.details = await User.findUniqueEmail(req.query.email);
    req.url = templateInfo.clientUrl;
}
  else {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }
  if (!req.details) {
    req.i18nKey = 'emailNotExist';
    logger.error('auth', `Error:${req.body.entityType}:forgotPassword:'${i18nUtil.getI18nMessage('emailNotExist')}`);
    return res.json(respUtil.getErrorResponse(req));
  }
  if (req.details.forgotPasswordExpireTimeStamp && req.details.forgotPasswordExpireTimeStamp >= (new Date()).getTime()) {
    req.i18nKey = 'emailAlreadySent';
    logger.error('Error:user.Authorization Controller:forgotPassword:' + i18nUtil.getI18nMessage('emailNotExist'), "UserAuth");
    return res.json(respUtil.getErrorResponse(req));
  }
  //Account status check
  if (req.details && req.details.status === config.commonStatus.Inactive) {
    logger.error('auth', `Error:${req.body.entityType}:forgotPassword:'${i18nUtil.getI18nMessage('employeeInactiveStatusMessage')}`);
    req.i18nKey = `${req.body.entityType}InactiveStatusMessage`;
    return res.json(respUtil.getErrorResponse(req));
  }
  req.enEmail = serviceUtil.encodeString(req.details.email);
  req.details.forgotPasswordExpireTimeStamp = settings && settings.forgotEmailInterval ? (new Date()).getTime() + (settings.forgotEmailInterval * 60 * 1000) : (new Date()).getTime() + (5 * 60 * 1000);
 
  if (entityType === 'employee')
  await Employee.saveData(req.details);
if (entityType === 'user')
  await User.saveData(req.details);


  //Send email link to reset the password
  emailService.sendEmailviaGrid({
    templateName: config.emailTemplates.adminForgetPassword,
    emailParams: {
      to: req.details.email,
      displayName: req.details.displayName,
      link: `${req.url}/changeRecoverPassword/${req.enEmail}`
    }
  });
  req.entityType = `${req.body.entityType}`;
  req.activityKey = `${req.body.entityType}ForgotPassword`;
  activityService.insertActivity(req);
  req.i18nKey = 'mailSent';
  logger.info('auth', `Log:${req.body.entityType}:forgotPassword:${i18nUtil.getI18nMessage('mailSent')}`);
  return res.json(respUtil.successResponse(req));
}

/** 
 * Change the recover password or activate the account by setting the password.
 */
async function changeRecoverPassword(req, res) {
  if (req.body.enEmail) {
    req.body.deEmail = serviceUtil.decodeString(req.body.enEmail);
    logger.info('auth', `Log:${req.body.entityType}:changeRecoverPassword: body :${req.body.deEmail}`);
  }
  let email = req.body.deEmail;
  let entityType = req.body.entityType;
  if (!validLoginTypes.includes(entityType)) {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }
  if (entityType === 'employee') {
  req.details = await Employee.findUniqueEmail(email);
}
if (entityType === 'user') {
  req.details = await User.findUniqueEmail(email);
}

  // email not exists
  if (!req.details) {
    req.i18nKey = 'emailNotExist';
    logger.error('auth', `Error:${req.body.entityType}:changeRecoverPassword:${i18nUtil.getI18nMessage('emailNotExist')}`);
    return res.json(respUtil.getErrorResponse(req));
  }
  let passwordDetails = req.body;
  if (passwordDetails.newPassword && !(passwordDetails.newPassword === passwordDetails.confirmPassword)) {
    req.i18nKey = 'passwordsNotMatched';
    logger.error('auth', `Error:${req.body.entityType}:changeRecoverPassword:${i18nUtil.getI18nMessage('passwordsNotMatched')}`);
    return res.json(respUtil.getErrorResponse(req));
  } else if (!passwordDetails.newPassword) {
    req.i18nKey = 'newPassword';
    logger.error('auth', `Error:${req.body.entityType}:changeRecoverPassword:${i18nUtil.getI18nMessage('newPassword')}`);
    return res.json(respUtil.getErrorResponse(req));
  }
  req.details.password = passwordDetails.newPassword;
  if (entityType === 'employee')
  await Employee.saveData(req.details);
if (entityType === 'user')
  await User.saveData(req.details);

  req.activityKey = `${req.body.entityType}ChangePassword`;
  req.entityType = `${req.body.entityType}`;
  activityService.insertActivity(req);
  req.i18nKey = 'passwordReset';
  return res.json(respUtil.successResponse(req));
}

/**
* Change Password
* @param req
* @param res
*/
async function changePassword(req, res) {
  logger.info(`Log:auth Controller:changePassword: query :${JSON.stringify(req.query)}`, controller);

  // let id = req.query.adminReset ? req.query._id : sessionUtil.checkTokenInfo(req, "_id") && sessionUtil.checkTokenInfo(req, "loginType") ? sessionUtil.getTokenInfo(req, "loginType") : null;
  let id = req.query.adminReset ? req.query._id : sessionUtil.checkTokenInfo(req, "_id") && sessionUtil.checkTokenInfo(req, "loginType") ? sessionUtil.getTokenInfo(req, "_id") : null;

  let entityType = req.body.entityType
  if (!validLoginTypes.includes(entityType) || !id) {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }
  if (entityType === "employee") {
  req.details = await Employee.get(id);
}
if (entityType === "user") {
  req.details = await User.get(id);
}

  let passwordDetails = req.body;
  if (!req.details) {
    req.i18nKey = "detailsNotFound";
    return res.json(respUtil.getErrorResponse(req));
  }

  // check new password exists
  if (passwordDetails.newPassword) {
    // check current password and new password are same
    if (passwordDetails.currentPassword && (passwordDetails.currentPassword === passwordDetails.newPassword)) {
      req.i18nKey = 'currentOldSameMsg';
      logger.error(`Error:${entityType} Controller:changePassword:' ${i18nUtil.getI18nMessage('currentOldSameMsg')}`, controller);
      return res.json(respUtil.getErrorResponse(req));
    };

    // authenticate current password
    if (req.details.authenticate(passwordDetails.currentPassword)) {
      if (passwordDetails.newPassword === passwordDetails.confirmPassword) {
        req.details.password = passwordDetails.newPassword;
        if (entityType === 'employee')
  await Employee.saveData(req.details);
if (entityType === 'user')
  await User.saveData(req.details);

        req.activityKey = `${entityType}ChangePassword`;
        req.entityType = `${req.body.entityType}`;
        activityService.insertActivity(req);
        req.i18nKey = 'passwordSuccess';
        logger.info(`Log:${entityType} Controller:changePassword: ${i18nUtil.getI18nMessage('passwordSuccess')}`, controller);
        return res.json(respUtil.successResponse(req));
      } else {
        req.i18nKey = 'passwordsNotMatched';
        logger.error(`Error:${entityType} Controller:changePassword:' ${i18nUtil.getI18nMessage('passwordsNotMatched')}`, controller);
        return res.json(respUtil.getErrorResponse(req));
      }
    } else {
      req.i18nKey = 'currentPasswordError';
      logger.error(`Error:${entityType} Controller:changePassword:' ${i18nUtil.getI18nMessage('currentPasswordError')}`, controller);
      return res.json(respUtil.getErrorResponse(req));
    }
  } else {
    req.i18nKey = 'newPassword';
    logger.error(`Error:${entityType} Controller:changePassword:' ${i18nUtil.getI18nMessage('newPassword')}`, controller);
    return res.json(respUtil.getErrorResponse(req));
  }
}

async function checkForgotPasswordLink(req, res) {
  if (!(req.query && req.query.token)) {
    return res.redirect(config.serverUrl + 'html/expire.html');
  }
  let emailVerify = await EmailVerify.findOne({ active: true, token: req.query.token, type: 'forgotPassword', login: req.body.entityType });
  if (!emailVerify) {
    return res.redirect(config.serverUrl + 'html/expire.html');
  }
  if (!(emailVerify.expireTimeStamp > (new Date().getTime()))) {
    return res.redirect(config.serverUrl + 'html/expire.html');
  }
  let user = await User.findUniqueEmail(emailVerify.email);
  // email not exists
  if (!user) {
    logger.error('Error:user.Authorization Controller:changeRecoverPassword:' + i18nUtil.getI18nMessage('emailNotExist'), "UserAuth");
    return res.redirect(config.serverUrl + 'html/expire.html');
  }
  res.redirect(emailVerify.redirectUrl);
};
async function socialLogin(req, res) {
  let email = req.body.email;
  let entityType = req.body.entityType
  if (!validLoginTypes.includes(entityType)) {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }  
   
if (entityType === 'employee') {
    req.details = await Employee.findUniqueEmail(email);
    let employee = req.details
    req.entityType = entityType
    if (!employee) {
        employee = new Employee(req.body);
        employee._doc.status = "Active"
        employee._doc.role = "Employee"
        employee._doc.firstTimeLogin = true
        employee._doc.created = Date.now();
        employee = await Employee.saveData(employee)
        req.details = employee;
        req.authEntityType = employee;
        req.activityKey = `${entityType}Create`;
        activityService.insertActivity(req);
    }
}else  
if (entityType === 'user') {
    req.details = await User.findUniqueEmail(email);
    let user = req.details
    req.entityType = entityType
    if (!user) {
        user = new User(req.body);
        user._doc.status = "Active"
        user._doc.role = "User"
        user._doc.firstTimeLogin = true
        user._doc.created = Date.now();
        user = await User.saveData(user)
        req.details = user;
        req.authEntityType = user;
        req.activityKey = `${entityType}Create`;
        activityService.insertActivity(req);
    }
}
  if (req.details) {
    let rolePermissions = await Roles.findUniqueRole(req.details.role);
    // return an error if employee role permissions is not found
    if (!rolePermissions) {
      req.i18nKey = 'rolePermissionsNotFound';
      logger.error('Error:Auth Controller:login:' + i18nUtil.getI18nMessage(req.i18nKey));
      return res.json(respUtil.getErrorResponse(req));
    }
    console.log(rolePermissions.permissions)
    let newobj = { rolePermissions: rolePermissions.permissions }
    // details.rolePermissions = rolePermissions.permissions;
    req.details = { ...req.details._doc, ...newobj }
    req.details.password = undefined;
    req.details.salt = undefined;
    req[entityType] = req.details;
    req.activityKey = `${entityType}LoginSuccess`;
    req.i18nKey = 'loginSuccessMessage';
    loginResponse(req, res, req.details);
  }

}

export default {
  login,
  getRandomNumber,
  logout,
  loginResponse,
  sendLoginResponse,
  forgotPassword,
  changeRecoverPassword,
  changePassword,
  socialLogin,
  checkForgotPasswordLink
};

