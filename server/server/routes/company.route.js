import express from 'express';
import companyCtrl from '../controllers/company.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router();

router.route('/multiDelete').all(authPolicy.isAllowed)
  /** POST /api/companys/companyId - Delete company records */
  .post(asyncHandler(companyCtrl.multidelete))

router.route('/:companyId').all(authPolicy.isAllowed)
  /** get /api/companys/companyId -  get one company using id*/
  .get(asyncHandler(companyCtrl.get))

router.route('/').all(authPolicy.isAllowed)
  /** get /api/companys -  get all companys */
  .get(asyncHandler(companyCtrl.list));

router.param('companyId', asyncHandler(companyCtrl.load));

router.route('/').all(authPolicy.isAllowed)
  /** POST /api/companys - Create new companys */
  .post(asyncHandler(companyCtrl.create))

router.route('/:companyId').all(authPolicy.isAllowed)
  /** get /api/companys/companyId -  get one company using id*/
  .put(asyncHandler(companyCtrl.update));

router.route('/:companyId').all(authPolicy.isAllowed)
  /** get /api/companys/companyId -  get one company using id*/
  .delete(asyncHandler(companyCtrl.remove));

// export default router;
module.exports = router