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
import Employee from '../../models/employee';
const authEmployee = new Employee(credentials.validEmployee);
const employee = new Employee();
const createpostBody = payload.getPostBody(employee);
// inject promise to mocha
chai.config.includeStack = true;
chai.use(chaiAsPromised);

describe('## Check employee creation', () => {

  beforeEach(mochaAsync(async () => {
    // login employee and get access token
    await auth.getAccessToken(authEmployee);
  }));

  it('## Check employee creation', (done) => {
    request(app)
      .post('/api/employees')
      .send(createpostBody)
      .set({  Authorization: `Bearer ${ authEmployee.getAccessToken() }` })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = 'employeeCreate';
        expect(res.body).to.have.property('employeeId');
        expect(res.body.respCode).to.equal(responseCodes.create);
        employee.setId(res.body.employeeId);
        done();
      })
      .catch(done)
  });

  it("## Should return employee updated succesfully", (done) => {
    request(app)
      .put(`/api/employees/${employee.getId()}`)
      .set({ Authorization: `Bearer ${employee.getAccessToken()}` })
      .send({
        phone: employee.getNewPhone()
      })
      .expect(httpStatus.OK)
      .then((res, req = {}) => {
        req.i18nKey = "employeeUpdate";
        expect(res.body).to.have.property('respCode');
        expect(res.body).to.have.property('employeeId');
        expect(res.body.respCode).to.equal(responseCodes.update);
        done();
      })
      .catch(done)
  });
})