
import Employee from '../models/employee.model';
import User from '../models/user.model';


import uploadeService from '../services/upload.service';
import imageUploadService from '../services/imageUpload.service';
import i18nUtil from '../utils/i18n.util';
import respUtil from '../utils/resp.util';
import sessionUtil from '../utils/session.util';
import serviceUtil from '../utils/service.util';

const controller = "Upload";

/** 
 * Upload pictures and documents
 */
async function upload(req, res, next) {
  logger.info('Log:Upload Controller :body:' + JSON.stringify(req.body), controller);
  await serviceUtil.checkPermission(req, res, "Edit", controller);
  if (sessionUtil.checkTokenInfo(req, "_id") && sessionUtil.checkTokenInfo(req, "loginType")) {
    req.entityType = sessionUtil.getTokenInfo(req, "loginType");
    if (req.entityType === "employee") {
req.details = await Employee.get(sessionUtil.getTokenInfo(req, "_id"));
}
else if (req.entityType === "user") {
req.details = await User.get(sessionUtil.getTokenInfo(req, "_id"));
}
else {
req.i18nKey = 'invalidLoginType';
return res.json(respUtil.getErrorResponse(req));
}
  } else {
    req.i18nKey = 'invalidLoginType';
    return res.json(respUtil.getErrorResponse(req));
  }
  req.uploadFile = [];
  req.uploadPath = req.query.uploadPath;
  // req.details.updatedBy[req.entityType] = sessionUtil.getTokenInfo(req, "_id");
  req.details.updated = Date.now();
  //Calling the activity of uploading the required file
  imageUploadService.upload(req, res, async (err) => {
    if (err) {
      logger.error(`Error:Upload Controller: Change ${req.entityType} Logo: Error:' + JSON.stringify(err)`, controller);
      req.i18nKey = "Upload Directory not Found";
      return res.json(respUtil.getErrorResponse(req));
    } else if (req.uploadFile && req.uploadFile[0] && req.uploadFile[0].name) {
      req.image = req.uploadFile[0].name;
      req.details.photo = req.uploadFile[0].name;
      console.log(req.details)
      //Saving the changes of the entityType 
      console.log(req.entityType)
      if (req.entityType === "employee") {
req.details = await Employee.get(sessionUtil.getTokenInfo(req, "_id"));
}
else if (req.entityType === "user") {
req.details = await User.get(sessionUtil.getTokenInfo(req, "_id"));
}

      req.entityType = `${req.entityType}`;
      console.log(req.entityType)
      req.entityType = req.uploadPath? `${req.uploadPath}Upload`:`${req.entityType}Upload`;
      req.activityKey = `${req.entityType}Upload`;
      logger.info(`Log:Upload Controller:Change ${req.entityType} logo:${i18nUtil.getI18nMessage(req.activityKey)}`, controller);
      return res.json(respUtil.uploadLogoSucessResponse(req))
    } else {
      req.i18nKey = `${req.entityType}LogoUploadedErrorMessage`;
      logger.error(`Error:Upload:Change ${req.entityType} Logo: Error : ${req.entityType} Logo not uploded.`, controller);
      return res.json(respUtil.getErrorResponse(req));
    }
  })
}

async function csvUpload(req, res) {
  logger.info('Log:User Controller:uploadCsvFile: Query : ' + JSON.stringify(req.query));
  req.uploadFile = [];
  req.uploadPath = 'bulkupload';
  req.user = req.tokenInfo
  //gets the uploded file
  uploadeService.upload(req, res, async (err) => {
    if (err) {
      console.log("err", err)
      logger.error('Error:Csv Controller:uploadCsvFile: Error : ' + JSON.stringify(err));
    } else if (req.uploadFile && req.uploadFile[0] && req.uploadFile[0].name) {
      //converts the csv format to json object format
      req.obj = await uploadeService.getJsonFromCsv(req);
    } else {
      req.i18nKey = 'CsvNotUploaded';
      logger.error('Error:Csv Controller:uploadCsvFile: Error : csv file not uploaded.');
      return res.json(await respUtil.getErrorResponse(req));
    };

    if (req.obj && req.obj.length > 0) {
      //calling multiple insert activity
      let uploadDetails = await uploadeService.insertBulkData(req, res);
      if (uploadDetails) {
        return res.json(uploadDetails);
      };
    } else {
      req.i18nKey = 'emptyFile';
      return res.json(await respUtil.getErrorResponse(req));
    };
  });
}

export default {
  upload,
  csvUpload
}