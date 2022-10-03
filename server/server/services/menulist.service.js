import Menulist from '../models/menulist.model';

import session from '../utils/session.util';

/**
 * set Menulist variables
 * @returns {Menulist}
 */
const setCreateMenulistVaribles = async (req, menulist) => {
  if (req.tokenInfo) {
    menulist.userId = session.getSessionLoginID(req);
    menulist.userName = session.getSessionLoginName(req);
    menulist.status = "Pending";
    menulist.userEmail = session.getSessionLoginEmail(req);
  };
  menulist.created = Date.now();
  return menulist;
};


/**
 * set Menulist update variables
 * @returns {Menulist}
 */
const setUpdateMenulistVaribles = async (req, menulist) => {
  menulist.updated = Date.now();
  return menulist;
};

export default {
  setCreateMenulistVaribles,
  setUpdateMenulistVaribles,
};