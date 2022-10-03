import express from 'express';
import emailstatusCtrl from '../controllers/emailstatus.controller';
import asyncHandler from 'express-async-handler';
import authPolicy from '../middlewares/authenticate';

const router = express.Router();

router.route('/:emailstatusId').all(authPolicy.isAllowed)
  /** get /api/emailstatuss/emailstatusId -  get one emailstatus using id*/
  .get(asyncHandler(emailstatusCtrl.get))

router.route('/').all(authPolicy.isAllowed)
  /** get /api/emailstatuss -  get all emailstatuss */
  .get(asyncHandler(emailstatusCtrl.list));

router.route('/:emailstatusId').all(authPolicy.isAllowed)
  /** get /api/emailstatuss/emailstatusId -  get one emailstatus using id*/
  .put(asyncHandler(emailstatusCtrl.update));

router.route('/').all(authPolicy.isAllowed)
  /** POST /api/emailstatuss - Create new emailstatuss */
  .post(asyncHandler(emailstatusCtrl.create))

router.route('/:emailstatusId').all(authPolicy.isAllowed)
  /** get /api/emailstatuss/emailstatusId -  get one emailstatus using id*/
  .delete(asyncHandler(emailstatusCtrl.remove));

router.param('emailstatusId', asyncHandler(emailstatusCtrl.load));

// export default router;
module.exports = router