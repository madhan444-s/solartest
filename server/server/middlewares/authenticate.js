import oauthServer from 'oauth2-server';
import config from '../config/config';

import oauthModel from '../auth/models';
import mongoose from 'mongoose';
import Settings from '../models/settings.model';
import Token from '../models/token.model';
import tokenService from '../services/token.service';

import serviceUtil from '../utils/service.util';
import sessionUtil from '../utils/session.util';
import respUtil from '../utils/resp.util';

const oauth = new oauthServer({ model: oauthModel });
const Request = oauthServer.Request;
const Response = oauthServer.Response;

async function updateExpireTime(token, type, req) {
  let settings = await Settings.findOne({ active: true });
  if (type === 'removeToken') {
    token.deleteOne();
  } else {
    // token.expires = new Date().getTime() + settings.expireTokenTime;
    // token.updated = new Date();
    // token.saveData();
    Token.updateOne(
      { _id: mongoose.Types.ObjectId(token._id) },
      { $set: { expires: new Date().getTime() + settings.expireTokenTime, updated: new Date() } }
    );
  }
};


async function oauthToken(req, res, next) {
  var request = new Request(req);
  var response = new Response(res);
  oauth
    .token(request, response)
    .then(function (token) {
      req.token = token;
      req.user = token.user;
      next();
    }).catch(function (err) {
      return res.status(500).json(err);
    });
}

async function authenticate(options = {}) {
  return function (req, res, next) {
    var request = new Request({
      headers: { authorization: req.headers.authorization },
      method: req.method,
      query: req.query,
      body: req.body
    });
    var response = new Response(res);

    oauth.authenticate(request, response, options)
      .then(function (token) {
        // Request is authorized.
        req.tokenInfo = token.user;
        req.tokenInfo.loginType = 'user';
        next();
      })
      .catch(function (err) {
        // Request is not authorized.
        res.status(err.code || 500).json(err)
      });
  };
}

/**
 * middleware b/w client and server
 */
async function isAllowed(req, res, next) {

  let token = '';
  // get token from request headers
  if (req.headers && req.headers.authorization) {
    token = serviceUtil.getBearerToken(req.headers);
  }
  // get token from request query parameters
  if (req.query && req.query.token) {
    token = req.query.token;
  }
  if (token) {

    //gets the token details based on the access token
    let tokenData = await tokenService.getTokenDetails(req, token);
    // let tokenData = req.tokenData
    if (tokenData && tokenData._doc) {
      tokenData = tokenData._doc;
    }
    if (tokenData && tokenData.accessToken) {
      if (!(tokenData.expires < new Date().getTime())) {
        req.tokenInfo = tokenData.details;
        req.tokenInfo.loginType = tokenData.loginType;
        req.tokenInfo.loginFrom = tokenData.loginFrom;
        req.tokenInfo.iosMobileAppVersion = tokenData.iosMobileAppVersion;
        req.tokenInfo.androidMobileAppVersion = tokenData.androidMobileAppVersion;
        req.tokenInfo.browserName = tokenData.browserName;
        req.tokenInfo.osName = tokenData.osName;
        req.tokenInfo.osVersion = tokenData.osVersion;
        req.tokenInfo.deviceType = tokenData.deviceType;
        req.tokenInfo.ipAddress = tokenData.ipAddress;
        if (!req.tokenInfo.loginFrom) {
          req.tokenInfo.loginFrom = 'web';
        }
        updateExpireTime(tokenData, 'updateTime');
        return next();
      } else {
        updateExpireTime(tokenData, 'removeToken');
        req.i18nKey = 'sessionExperied';
        return res.json(respUtil.getErrorResponse(req));
      }
    } else {
      req.i18nKey = 'sessionExperied';
      return res.json(respUtil.getErrorResponse(req));
    }
  } else {
    if (config.isTokenNotPassed) {
      req.i18nKey = 'tokenNotProvideMessage';
      return res.json(respUtil.getErrorResponse(req));
    }
  }
  return next();
}

export default {
  isAllowed,
  oauthToken,
  authenticate
}
