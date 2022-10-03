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
import Company from '../../models/company';
const authCompany = new Company(credentials.validCompany);
const company = new Company();
const createpostBody = payload.getPostBody(company);
// inject promise to mocha
chai.config.includeStack = true;
chai.use(chaiAsPromised);

describe('## Check company creation', () => {

  beforeEach(mochaAsync(async () => {
    // login company and get access token
    
  }));
  it("## Should return the list of the companys", (done) => {
    request(app)
      .get('/api/companys')
      .set({ Authorization: `Bearer ${company.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.body).to.have.property('companys');
        expect(res.body.companys).to.be.an('array');
        expect(res.body.companys).to.not.have.length(0)
        done();
      })
      .catch(done);
  });
})