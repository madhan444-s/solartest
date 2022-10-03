import express from 'express';
import roleCtrl from '../controllers/role.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/multiDelete').all(authPolicy.isAllowed)
  /** POST /api/roles - Delete roles */
  .post(asyncHandler(roleCtrl.multipleDelete))

router.route('/').all(authPolicy.isAllowed)
  /** GET /api/roles - Get list of roles */
  .get(asyncHandler(roleCtrl.list))

  /** POST /api/roles - Create new roles */
  .post(asyncHandler(roleCtrl.create));

router.route('/:roleId').all(authPolicy.isAllowed)
  /** GET /api/roles/:roleId - Get roles */
  .get(asyncHandler(roleCtrl.get))

  /** PUT /api/roles/:roleId - Update roles */
  .put(asyncHandler(roleCtrl.update))

  /** DELETE /api/roles/:roleId - Delete roles */
  .delete(asyncHandler(roleCtrl.remove));


/** Load activity when API with roleId route parameter is hit */
router.param('roleId', asyncHandler(roleCtrl.load));

export default router;
