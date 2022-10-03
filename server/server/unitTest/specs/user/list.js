import 'babel-polyfill';
import request from 'supertest-as-promised';
import chaiAsPromised from 'chai-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../../index';

import auth from '../../http-requests/lib/authorization';
import mochaAsync from '../../lib/mocha-async';

// load credentials
import credentials from '../../data/credentials.json';
import responseCodes from '../../data/response-codes.json';

import i18nUtil from '../../../utils/i18n.util';

// load payload module
import payload from '../../http-requests/lib/payloads/';
import User from '../../models/user';
const authUser = new User(credentials.validUser);
const user = new User();
const createpostBody = payload.getPostBody(user);
// inject promise to mocha
chai.config.includeStack = true;
chai.use(chaiAsPromised);

describe('## Check user creation', () => {

  beforeEach(mochaAsync(async () => {
    // login user and get access token
    await auth.getAccessToken(authUser);
  }));
  it("## Should return the list of the users", (done) => {
    request(app)
      .get('/api/users')
      .set({ Authorization: `Bearer ${user.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property('users');
        expect(res.body.users).to.be.an('array');
        expect(res.body.users).to.not.have.length(0)
        done();
      })
      .catch(done);
  });
})