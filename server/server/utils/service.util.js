const iplocation = require("iplocation").default;
import randomstring from 'randomstring';
import randomNumber from 'random-number';

import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import requestIp from 'request-ip';

import config from '../config/config';

import dateUtil from './date.util';
import sessionUtil from '../utils/session.util';


import Settings from '../models/settings.model';
const randomString = require('random-base64-string');

/**
 * generate UUID 5
 * @returns {token}
 */
const generateUUID5 = () => {
  const randomUUID4 = uuidv4();
  return uuidv5(randomstring.generate(), randomUUID4);
}

/**
 * get client ip
 * @param req
 * @returns {randomString}
 */
const getClientIp = (req) => {
  return requestIp.getClientIp(req);
}

/**
 * get bearer token
 * @returns {token}
 */
const getBearerToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}
/** Check Permissions for View or Edit */
const checkPermission = async (req, res, type, controller) => {
  let permissions = sessionUtil.checkTokenInfo(req, "permissions") ? sessionUtil.getTokenInfo(req, "permissions") : null;
  if (!permissions) return true;
  req.i18nKey = "noPermissionErr";
  if (!permissions[controller] && (permissions[controller] === "View" && [type].include(permissions[controller])) ||
    (permissions[controller] === "Edit" && ["Edit", "View"].include(permissions[controller]))) {
    return true
  } else {
    logger.error(`Log:${controller} Controller:Permissions: query :${type}`, controller);
    return res.json(respUtil.getErrorResponse(req))
  }
};
/**
 * generate uuid
 * @returns {uuid}
 */
const generateUUID = () => {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * generate random string
 * @param length
 * @param chars
 * @returns {randomString}
 */
const generateRandomString = (length, chars) => {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  let result = '';
  for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}

/**
 * generate list query
 * @param req
 * @returns { filter: filter, sorting: sorting }
 */
const generateListQuery = async (req) => {
  let criteria = {
    limit: config.limit,
    page: config.page,
    sortfield: config.sortfield,
    direction: config.direction,
    filter: {},
    pagination: {}
  };
  let json;
  if (req.queryType === 'employee') {
    json = {};
  } else {
    json = {
      active: true
    };
  }

  let data;
  if (req.query) {
    data = req.query;
    if (data && data.limit) {
      criteria.limit = criteria.pagination.limit = parseInt(data.limit);
    }
    if (data && data.page) {
      criteria.page = criteria.pagination.page = parseInt(data.page);
    }
    if (data && data.filter) {
      let cred = JSON.parse(data.filter);
      if (cred.limit) {
        criteria.limit = criteria.pagination.limit = parseInt(cred['limit']);
      }
      if (cred.page) {
        criteria.page = criteria.pagination.page = parseInt(cred['page']);
      }
      if (cred.sortfield) {
        criteria.sortfield = cred['sortfield'];
      }
      if (cred.direction) {
        criteria.direction = cred['direction'];
      }
      if (cred && cred.globalSearch) {
        let globalObj = cred.globalSearch;
        if (globalObj && globalObj.type === 'user' && globalObj.value) {
          let filtersArr = ["email", "phone", "displayName", "address",
            "name", "gender", "employeeName", "role", "subject", "country", "packageName", "website","to","from", "contextType", "context", "desc","createdByName","status", "name","email","address","role","name","email","status","name","email","password","status","companyId","role",];
          let numsArr = ["telegramId"];
          if (!json['$or']) {
            json['$or'] = [];
          }
          // numsArr.forEach(function (x) {
          //   let objarr = {
          //     $where: "/^.*" + globalObj.value + ".*/.test(this." + x + ")"
          //   }
          //   json['$or'].push(objarr)
          // });
          filtersArr.forEach(function (v) {
            // if (!json['$or']) {
            //   json['$or'] = [];
            // }
            let jsonNew = {};
            jsonNew[v] = { '$regex': globalObj.value, '$options': 'i' };
            json['$or'].push(jsonNew);
          });
        }
        if (globalObj && globalObj.type === 'employee' && globalObj.value) {
          let filtersArr = ["email", "phone", "displayName"];
          filtersArr.forEach(function (v) {
            if (!json['$or']) {
              json['$or'] = [];
            }
            let jsonNew = {};
            jsonNew[v] = { '$regex': globalObj.value, '$options': 'i' };
            json['$or'].push(jsonNew);
          });
        }
      }
      if (cred && cred.criteria) {
        let filters = cred.criteria;
        if (filters && filters.length > 0) {
          filters.forEach(function (v, i) {
            if (v.type === 'eq') {
              json[v.key] = v.value;
            }
            if (v.type === 'in') {
              json[v.key] = { "$in": v.value };
            }
            if (v.type === 'gte') {
              if (!json[v.key]) {
                json[v.key] = {};
              }
              json[v.key]["$gte"] = v.value;
            }
            if (v.type === 'lte') {
              if (!json[v.key]) {
                json[v.key] = {};
              }
              json[v.key]["$lte"] = v.value;
            }
            if (v.type === 'or') {
              if (!json['$or']) {
                json['$or'] = [];
              }
              let jsonNew = {};
              jsonNew[v.key] = { '$regex': v.value, '$options': 'i' };
              json['$or'].push(jsonNew);
            }
            if (v.type === 'ne') {
              json[v.key] = { $ne: v.value };
            }
            if (v.type === 'nin') {
              json[v.key] = { "$in": v.value };
            }
            if (v.type === 'regexOr') {
              json[v.key] = { '$regex': v.value, '$options': 'i' };
            }
          });
        }
      }
    }
  } else if (req.pair) {
    data = req;
    let fields = ['userId', 'pair'];
    // field wise filtering
    fields.forEach((field) => {
      json[field] = data[field];
    });
    // 1day
    if (data.type === '1day') {
      json['created'] = dateUtil.getOneDayQuery();
    }
    // 1 week
    if (data.type === '1week') {
      json['created'] = dateUtil.getThisWeekQuery();
    }
    // 1 month
    if (data.type === '1month') {
      json['created'] = dateUtil.getOneMonthDatesQuery();
    }
    // 3 month
    if (data.type === '3month') {
      json['created'] = dateUtil.getThreeMonthsQuery();
    }
    let fromdate = data.fromdate || data.fromDate;
    let todate = data.todate || data.toDate;
    // fromdate or tdate
    if (fromdate || todate) {
      if (fromdate) {
        json['created'] = { $lte: new Date(fromdate + 'T23:59:59Z'), $gte: new Date(fromdate + 'T00:00:00Z') };
      }
      if (todate) {
        json['created'] = { $lte: new Date(todate + 'T23:59:59Z'), $gte: new Date(todate + 'T00:00:00Z') };
      }
      if (fromdate && todate) {
        json['created'] = { $lte: new Date(todate + 'T23:59:59Z'), $gte: new Date(fromdate + 'T00:00:00Z') };
      }
    }
  }

  criteria.filter = json;
  criteria.sorting = {};
  if (criteria.direction === 'desc') {
    criteria.sorting[criteria.sortfield] = -1;
  } else {
    criteria.sorting[criteria.sortfield] = 1;
  }
  return criteria;
}


/**
 * encode string using buffer
 * @param enString
 * @returns encodeString
 */
const encodeString = (enString) => {
  return new Buffer(enString).toString('base64');
}

/**
 * decode string using buffer
 * @param deString
 * @returns decodeString
 */
const decodeString = (deString) => {
  return new Buffer(deString, 'base64').toString();
}

/**
 * Extend an object
 * @param {object} src 
 * @param {object} dest 
 */
const extendObject = (src = {}, dest = {}) => {
  // Set filter criteria by pair
  let destination = Object.keys(dest);
  if (destination.length > 0) {
    destination.forEach((key) => {
      if (key) {
        src[key] = dest[key];
      }
    })
  }
  return src;
};

/**
 * Js upper string
 * @param string String
 */
const jsUcfirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


const getRedisKey = (pair, name) => {
  return `${pair}${name}`;
};

/**
 * remove body fields
 * @param req Object
 * @param res Object
 * @param next Function
 */
const removeBodyFields = (req, res, next) => {
  let removeFieldsArr = ['active'];
  removeFieldsArr.forEach((field) => {
    if (req.body && (req.body[field] || typeof req.body[field] === 'boolean')) {
      delete req.body[field];
    }
  });
  next();
};



/**
 * secure api
 * @param req Object
 * @param res Object
 * @param next Function
 */
const secureApi = async (req, res, next) => {
  let settings = await Settings.findOne({ active: true });
  if (settings && settings.secureApi) {
    if (req && req.headers && req.headers['postman-token']) {
      return res.json({ errorCode: "9001", errorMessage: "Not Authorized" });
    } else {
      next();
    }
  } else {
    next();
  }

};

const camelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
};

const getIpDetails = async (ipAddress) => {
  return new Promise((resolve, reject) => {
    iplocation(ipAddress, [], (error, res) => {
      resolve(res)
    });
  })
};

const generateRandomNumber = (min, max) => {
  let options = {
    min: min,
    max: max,
    integer: true
  }
  return randomNumber(options);
};

const generateSequenceNumber = (number, length) => {
  let out = ''
  for (let i = number.length; i < length; i++) {
    out += '0';
  }
  return out + number;
}

const createCryptoRandomString = (length) => {
  let random = randomString(length)
  return random
};
const compareObjects = async (object1, object2) => {
  let description = ''
  for (let pair in object2) {
    console.log("pair", pair, "object1[pair]", object1[pair], "object2[pair]", object2[pair], "typeof (object1[pair])", typeof (object1[pair]))
    // if (pair === 'openingTime' || pair === 'closingTime') {
    //   object1[pair] = new Date(object1[pair])
    //   object2[pair] = new Date(object2[pair])
    //   let date1 = await dateFormat(object1[pair])
    //   let date2 = await dateFormat(object2[pair])
    //   // date1 === date2 ? '' : description += `"${pair}" is previously "${date1}" and changed to "${date2}",`
    //   date1 === date2 ? '' : description += `"${pair}" is updated from "${date1}" to "${date2}",`
    //   console.log("pair", pair, "date1", date1, "date2", date2, "typeof (date1)", typeof (date1), "typeof (date2)", typeof (date2))
    // }
    if ((object1[pair] || object1[pair] === false) &&
      ((typeof (object1[pair]) === "string" && typeof (object2[pair]) === "string") ||
        (typeof (object1[pair]) === "number" && typeof (object2[pair]) === "number") ||
        (typeof (object1[pair]) === "boolean" && typeof (object2[pair]) === "boolean")) &&
      pair !== '__v' && object1[pair] !== '') {
      // object1[pair] === object2[pair] ? '' : description += `"${pair}" is previously "${object1[pair]}" and changed to "${object2[pair]}",`
      object1[pair] === object2[pair] ? '' : description += `"${pair}" is updated from "${object1[pair]}" to "${object2[pair]}",`
    }
    if (!object1[pair] && pair !== '__v' && object2[pair] !== '') {
      if (object1[pair] !== false && object1[pair] !== 0)
        description += `${pair} is added ${object2[pair]},`
    }
    /*
    if ((!object1[pair] || Array.isArray(object1[pair])) && (Array.isArray(object2[pair]))) {
      for (let key in object2[pair]) {
        if (!(object1[pair].includes(object2[pair][key]))) {
          description += `${pair} is added ${object2[pair][key]},`

        }
      }
    }
    */

  }
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>", description)
  return description
}

export default {
  generateUUID5,
  getBearerToken,
  generateUUID,
  generateRandomString,
  generateListQuery,
  getClientIp,
  encodeString,
  decodeString,
  extendObject,
  jsUcfirst,
  getRedisKey,
  removeBodyFields,
  camelize,
  getIpDetails,
  secureApi,
  generateRandomNumber,
  generateSequenceNumber,
  checkPermission,
  createCryptoRandomString,
  compareObjects
};