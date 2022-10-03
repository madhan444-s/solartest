import express from 'express';
import userCtrl from '../controllers/user.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router();

router.route('/register')
/** POST /api/users - Register new users */
.post(asyncHandler(userCtrl.register))

router.route('/multiDelete').all(authPolicy.isAllowed)
  /** POST /api/users/userId - Delete user records */
  .post(asyncHandler(userCtrl.multidelete))

router.route('/:userId').all(authPolicy.isAllowed)
  /** get /api/users/userId -  get one user using id*/
  .get(asyncHandler(userCtrl.get))

router.route('/').all(authPolicy.isAllowed)
  /** get /api/users -  get all users */
  .get(asyncHandler(userCtrl.list));

router.param('userId', asyncHandler(userCtrl.load));

router.route('/').all(authPolicy.isAllowed)
  /** POST /api/users - Create new users */
  .post(asyncHandler(userCtrl.create))

router.route('/:userId').all(authPolicy.isAllowed)
  /** get /api/users/userId -  get one user using id*/
  .put(asyncHandler(userCtrl.update));

router.route('/:userId').all(authPolicy.isAllowed)
  /** get /api/users/userId -  get one user using id*/
  .delete(asyncHandler(userCtrl.remove));

// export default router;
module.exports = router