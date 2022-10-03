import express from 'express';
import employeeCtrl from '../controllers/employee.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router();

router.route('/register')
/** POST /api/employees - Register new employees */
.post(asyncHandler(employeeCtrl.register))

router.route('/multiDelete').all(authPolicy.isAllowed)
  /** POST /api/employees/employeeId - Delete employee records */
  .post(asyncHandler(employeeCtrl.multidelete))

router.route('/:employeeId').all(authPolicy.isAllowed)
  /** get /api/employees/employeeId -  get one employee using id*/
  .get(asyncHandler(employeeCtrl.get))

router.route('/').all(authPolicy.isAllowed)
  /** get /api/employees -  get all employees */
  .get(asyncHandler(employeeCtrl.list));

router.param('employeeId', asyncHandler(employeeCtrl.load));

router.route('/').all(authPolicy.isAllowed)
  /** POST /api/employees - Create new employees */
  .post(asyncHandler(employeeCtrl.create))

router.route('/:employeeId').all(authPolicy.isAllowed)
  /** get /api/employees/employeeId -  get one employee using id*/
  .put(asyncHandler(employeeCtrl.update));

router.route('/:employeeId').all(authPolicy.isAllowed)
  /** get /api/employees/employeeId -  get one employee using id*/
  .delete(asyncHandler(employeeCtrl.remove));

// export default router;
module.exports = router