import Emailstatus from '../models/emailstatus.model';

import session from '../utils/session.util';

/**
 * set Emailstatus variables
 * @returns {Emailstatus}
 */
const setCreateEmailstatusVaribles = async (req, emailstatus) => {
  if (req.tokenInfo) {
    emailstatus.userId = session.getSessionLoginID(req);
    emailstatus.userName = session.getSessionLoginName(req);
    emailstatus.status = "Pending";
    emailstatus.userEmail = session.getSessionLoginEmail(req);
  };
  emailstatus.created = Date.now();
  return emailstatus;
};


/**
 * set Emailstatus update variables
 * @returns {Emailstatus}
 */
const setUpdateEmailstatusVaribles = async (req, emailstatus) => {
  emailstatus.updated = Date.now();
  return emailstatus;
};

export default {
  setCreateEmailstatusVaribles,
  setUpdateEmailstatusVaribles,
};