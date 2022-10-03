import Role from '../models/role.model';

import activityService from '../services/activity.service';
import roleService from '../services/role.service';

import respUtil from '../utils/resp.util';
import i18nService from '../utils/i18n.util';
import serviceUtil from '../utils/service.util';
import sessionUtil from '../utils/session.util';

const controller = "Role";

/**
 * Load role and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.role = await Role.get(req.params.roleId);
  return next();
}

/**
 * Get role
 * @param req
 * @param res
 * @returns {role}
 */
async function get(req, res) {
  logger.info('Log:role Controller:get: query :' + JSON.stringify(req.query), controller);

  await serviceUtil.checkPermission(req, res, "View", controller);
  let responseJson = {};
  logger.info('Log:role Controller:' + i18nService.getI18nMessage('recordFound'), controller);
  responseJson.respCode = respUtil.getDetailsSuccessResponse().respCode;
  responseJson.details = req.role;
  return res.json(responseJson);
}

/**
 * Create new role
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Auth Controller:create: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let role = new Role(req.body);
  role = await roleService.setCreateRoleVaribles(req, role);
  req.role = await Role.saveData(role);
  req.contextId = req.role._id;
  req.entityType = 'role';
  req.activityKey = 'roleCreate';
  activityService.insertActivity(req);
  logger.info('Log:role Controller:' + i18nService.getI18nMessage('roleCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing role
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:role Controller:update: body :' + JSON.stringify(req.body), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let role = req.role;
  req.description = await serviceUtil.compareObjects(role, req.body);

  role = await roleService.setUpdateRoleVaribles(req, role);
  role = Object.assign(role, req.body);
  req.role = await Role.saveData(role);
  req.contextId = req.role._id;
  req.entityType = 'role';
  req.activityKey = 'roleUpdate';
  activityService.insertActivity(req);
  logger.info('Log:role Controller:' + i18nService.getI18nMessage('roleUpdate'), controller);
  return res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Get role list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {role: roles, pagination: pagination}
 */
async function list(req, res, next) {
  logger.info('Log:role Controller:list: query :' + JSON.stringify(req.query), controller);

  await serviceUtil.checkPermission(req, res, "View", controller);
  let responseJson = {};
  const query = await serviceUtil.generateListQuery(req);

  if (query.page === 1)
    // total count 
    query.pagination.totalCount = await Role.totalCount(query);
  
    if (req.query.type === 'exportToCsv') {
      query.dbfields = { _id:0,role:1, status:1, roleType:1, createdBy:1, updatedBy:1, created:1, updated:1 };
      query.limit = query.pagination.totalCount;
    } else {
      query.dbfields = {};
    }
  //get total roles
  const roles = await Role.list(query);
  logger.info('Log:role Controller:' + i18nService.getI18nMessage('recordsFound'), controller);
  responseJson.respCode = respUtil.getDetailsSuccessResponse().respCode;
  responseJson.roles = roles;
  responseJson.pagination = query.pagination;
  return res.json(responseJson)
}

/**
 * Delete role.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:role Controller:remove: query :' + JSON.stringify(req.query), controller);

  await serviceUtil.checkPermission(req, res, "Edit", controller);
  const role = req.role;
  role.active = false;
  req.role = await Role.saveData(role);
  req.contextId = req.role._id;
  req.entityType = 'role';
  req.activityKey = 'roleDelete';
  activityService.insertActivity(req);
  logger.info('Log:role Controller:' + i18nService.getI18nMessage('roleDelete'), controller);
  return res.json(respUtil.removeSuccessResponse(req));
}

async function multipleDelete(req, res) {
  logger.info('Log:Role Controller:multipleDelete: body :' + JSON.stringify(req.body));
  if (req.body && req.body.selectedIds && req.body.selectedIds.length > 0) {
    await Role.updateMany(
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
  req.entityType = 'role';
  res.json(respUtil.removeSuccessResponse(req));
}
export default {
  load,
  get,
  create,
  update,
  list,
  remove,
  multipleDelete
};
