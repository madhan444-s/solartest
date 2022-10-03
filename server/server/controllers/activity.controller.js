import Activity from '../models/activity.model';
import Menulist from '../models/menulist.model';

import activityService from '../services/activity.service';

import i18nUtil from '../utils/i18n.util';
import respUtil from '../utils/resp.util';
import serviceUtil from '../utils/service.util';

const controller = "Activity";

/**
 * Load activity and append to req.
 * @param req
 * @param res
 * @param next
 */
async function load(req, res, next) {
  req.activity = await Activity.get(req.params.activityId);
  return next();
}

/**
 * Get activity
 * @param req
 * @param res
 * @returns {Activity}
 */
async function get(req, res) {
  logger.info('Log:activity Controller:get: query :' + JSON.stringify(req.query), controller);

  await serviceUtil.checkPermission(req, res, "View", controller);
  let responseJson = {};
  logger.info('Log:activity Controller:' + i18nUtil.getI18nMessage('recordFound'), controller);
  responseJson.respCode = respUtil.getDetailsSuccessResponse().respCode;
  responseJson.details = req.activity;
  return res.json(responseJson);
}

/**
 * Create new activity
 * @param req
 * @param res
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function create(req, res) {
  logger.info('Log:Auth Controller:create: body :' + JSON.stringify(req.body), controller);
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let activity = new Activity(req.body);
  activity = await activityService.setActivityVaribles(req, activity);
  req.activity = await Activity.saveData(activity);
  req.entityType = 'activity';
  logger.info('Log:activity Controller:' + i18nUtil.getI18nMessage('activityCreate'), controller);
  return res.json(respUtil.createSuccessResponse(req));
}

/**
 * Update existing activity
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function update(req, res, next) {
  logger.info('Log:activity Controller:update: body :' + JSON.stringify(req.body), controller);
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  let activity = req.activity;
  req.description = await serviceUtil.compareObjects(activity, req.body);
  activity = Object.assign(activity, req.body);
  req.activity = await Activity.saveData(activity);
  req.entityType = 'activity';
  logger.info('Log:activity Controller:' + i18nUtil.getI18nMessage('activityUpdate'), controller);
  return res.json(respUtil.updateSuccessResponse(req));
}

/**
 * Get activity list. based on criteria
 * @param req
 * @param res
 * @param next
 * @returns {activities: activities, pagination: pagination}
 */
async function list(req, res, next) {
  logger.info('Log:activity Controller:list: query :' + JSON.stringify(req.query), controller);
  await serviceUtil.checkPermission(req, res, "View", controller);
  let responseJson = {};
  const query = await serviceUtil.generateListQuery(req);
  //get total activities
  if (query.page === 1)
    // total count 
    query.pagination.totalCount = await Activity.totalCount(query);

  if (req && req.query && req.query.type)
    query.filter.type = req.query.type;

  if (req && req.query && req.query.contextType)
    query.filter.contextType = req.query.contextType.toUpperCase();

  let menulist = [];
  if (req && req.tokenInfo.loginType== "employee") {  menulist = await Menulist.find({type:"Admin"},{ _id:1 ,title:1 })}
 else if (req && req.tokenInfo.loginType== "user") {  menulist = await Menulist.find({type:"client"},{ _id:1 ,title:1 })}
  if (menulist.length) {
    let context = [];
    menulist.forEach(t => {
      if (t.title) {
        if (t.title == 'Email Templates') {
          t.title = 'Template'
        } else if (t.title == 'Roles') {
          t.title = 'Role'
        }
        context.push(t.title)
        context.push(t.title.toUpperCase())
      }
    })
    query.filter.context = { $in: context }
  }

  const activities = await Activity.list(query);
  logger.info('Log:activity Controller:' + i18nUtil.getI18nMessage('recordsFound'), controller);
  responseJson.respCode = respUtil.getDetailsSuccessResponse().respCode;
  responseJson.activities = activities;
  responseJson.pagination = query.pagination;
  return res.json(responseJson)
}

/**
 * Delete activity.
 * @param req
 * @param res
 * @param next
 * @returns { respCode: respCode, respMessage: respMessage }
 */
async function remove(req, res, next) {
  logger.info('Log:activity Controller:remove: query :' + JSON.stringify(req.query), controller);
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  const activity = req.activity;
  activity.active = false;
  req.activity = await Activity.saveData(activity);
  req.entityType = 'activity';
  logger.info('Log:activity Controller:' + i18nUtil.getI18nMessage('activityDelete'), controller);
  return res.json(respUtil.removeSuccessResponse(req));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove
};
