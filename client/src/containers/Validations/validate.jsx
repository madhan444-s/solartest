import config from '../../config/config';
import configMessages from '../../config/configMessages';
import dateFormats from '../UI/FormatDate/formatDate';

const validate = (values, props) => {
  let fields = [];
  // get formFields from props and set validation  fields
  if (props.formFields) {
    fields = [];
    let formFields = props.formFields();
    if (formFields && formFields.length > 0) {
      formFields.forEach(formField => {
        if (formField.required) {
          fields.push(formField.name);
        }
      });
    }
  }
  const errors = {};
  let checkRegExpFieldsArray = ['aadharcardNumber', 'pancardNumber', 'email', 'roomId', 'companyEmail', 'phoneNumber','confirmPassword', 'password', 'phone', 'displayName', 'firstName', 'lastName', 'name', 'companyName', 'projectName', 'teamName', 'subject', ];
  if (values.email) {
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}$/i.test(values["email"])) {
       errors.email = configMessages['invalidEmail'];
     }
   }
  
  fields.forEach((field) => {
    if (!values[field]) {
      errors[field] = configMessages.fillField;
    } else if (checkRegExpFieldsArray.includes(field)) {
      let regex = config[field + "Regex"];
      if (field == 'email') {
        regex = config['email' + "Regex"];
      }
      if (field == 'phone') {
        regex = config['phoneNumber' + "Regex"];
      }
      if (field == 'roomId') {
        regex = config['roomId' + "Regex"];
      }
      if (field == 'subject') {
        regex = config['subject' + "Regex"];
      }
      if (field == 'lastName') {
        regex = config['lastName' + "Regex"];
      }
      if (field == 'displayName' || field == 'firstName' || field == 'name') {
        regex = config['userName' + "Regex"];
      }
      if (field == 'companyName' || field == 'projectName' || field == 'teamName') {
        regex = config['company' + "Regex"];
      }
      if (values[field] && typeof (values[field]) == 'string' && regex.test(values[field].trim()) == false) {
        var ifFileds = ['companyName', 'projectName', 'roomId', 'teamName', 'companyEmail', 'displayName', 'firstName', 'lastName', 'name', 'subject'];
        if (ifFileds.indexOf(field) > -1) {
          if (field == 'companyEmail') {
            errors[field] = configMessages['email'];
          } if (field == 'displayName' || field == 'firstName' || field == 'lastName' || field == 'name' || field == 'subject') {
            errors[field] = configMessages['userName'];
          } if (field == 'companyName' || field == 'projectName' || field == 'teamName') {
            errors[field] = configMessages['companyName'];
          } if (field == 'roomId') {
            errors[field] = configMessages['roomId'];
          }
        } else {
          errors[field] = configMessages[field];
        }
      }
    }
  });
  if(values.confirmPassword &&values.password&&values.confirmPassword !==values.password){
    errors["confirmPassword"] = "Password and Confirm password must be same";
  }
  if(values.confirmPassword &&values.newPassword&&values.confirmPassword !==values.newPassword){
    errors["confirmPassword"] = "New Password and Confirm password must be same";
  }
  
  if(values && values.toTime && values.fromTime){
   let toTime=values.toTime._d
   let fromTime=values.fromTime._d
   if(( toTime && fromTime && (toTime.getTime()-fromTime.getTime()))<0){
      errors.toTime=configMessages.toTimeFromTimeValidation 
   }
  }
  let todayDate = dateFormats.formatDate(new Date(), config.dateDayMonthFormat);
  let compare;
  if (values && values.dateOfBirth) {
    compare = dateFormats.datesComparisionBefore(todayDate, values.dateOfBirth);
    if (compare) {
      errors.dateOfBirth = configMessages.InvalidDate;
    }
  }

  if (values && values.endDate && values.startDate) {
    compare = dateFormats.datesComparisionBefore(values.endDate, values.startDate);
    if (compare) {
      errors['endDate'] = configMessages.InvalidDate;
    } else {
      errors['endDate'] = '';
    }
  }
  if (values && values.toDate && values.fromDate) {
    compare = dateFormats.datesComparisionBefore(values.toDate, values.fromDate);
    if (compare) {
      errors['toDate'] = configMessages.InvalidDate;
    } else {
      errors['toDate'] = '';
    }
  }
  if (values && values.joinDate) {
    if (values.dateOfBirth) {
      let years = dateFormats.differenceBetweenDatesInYears(values.joinDate, values.dateOfBirth);
      if (years < 15) {
        errors.joinDate = configMessages.InvalidDate;
      } else {
        errors.joinDate = '';
      }
    }
  }
  return errors;
};




export default validate;

