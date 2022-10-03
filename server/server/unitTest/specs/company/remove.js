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

  it('## Check company creation', (done) => {
    request(app)
      .post('/api/companys')
      .send(createpostBody)
      .set({  })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = 'companyCreate';
        expect(res.body).to.have.property('companyId');
        expect(res.body.respCode).to.equal(responseCodes.create);
        company.setId(res.body.companyId);
        done();
      })
      .catch(done)
  });

  it("## Should get sucessfully deleted message", (done) => {
    request(app)
      .delete(`/api/companys/${company.getId()}?response=true`)
      .set({ Authorization: `Bearer ${company.getAccessToken()}` })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = 'companyDelete';
        expect(res.body).to.have.property('companyId');
        expect(res.body.respCode).to.equal(responseCodes.delete);
        done();
      })
      .catch(done);
  })
})