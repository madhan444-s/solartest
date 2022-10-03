import Error from '../models/error.model';

import ErrorUtil from '../utils/error.util';
import sessionUtil from '../utils/session.util';


/**
 * insert activity
 * @returns {activity}
 */
const insertActivity = async (req) => {
  let errorConfig = ErrorUtil.errorConfig;
  let error = new Error(errorConfig[req.errorKey]);

  if (req.contextId)
    error.contextId = req.contextId;

  if (req.description)
    error.description = req.description;

  if (errorConfig && errorConfig[req.errorKey]) {
    if (req.key === '401') {
      if (!req.body.type)
        req.body.type = "web";
      error.loginFrom = req.body.type;
    }
    if (sessionUtil.getTokenInfo(req, 'loginType') === 'employee') {
      error.createdBy.employee = sessionUtil.getTokenInfo(req, '_id');
      error.type = 'employee';

    } else if (sessionUtil.getTokenInfo(req, 'loginType') === 'user') {
      error.createdBy.user = sessionUtil.getTokenInfo(req, '_id');
      error.type = 'user';

    } else if (req && req.user && req.user._id) {
      error.contextId = req.user._id;
      error.createdBy.user = req.user._id;
      error.type = 'user';

    } else if (req && req.employee && req.employee._id) {
      error.contextId = req.employee._id;
      error.createdBy.employee = req.employee._id;
      error.type = 'employee';

    }
    await Error.saveData(error);
    return true;
  } else {
    return true;
  }
}

export default {
  insertActivity
};