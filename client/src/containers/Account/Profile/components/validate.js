const validate = (values) => {
  const errors = {};

  let fields = ['firstName', 'lastName','dateOfBirth','joinDate', 'phoneNumber', 'skypeId', 'bitbuketId'];

  fields.forEach((field) => {
    if (!values[field]) {
      let fieldName= capitalize(field);
      errors[field] = `${fieldName} field shouldn’t be empty`;
    }
  });

  if (!values.email) {
    errors.email = 'Email field shouldn’t be empty';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.companyEmail) {
    errors.companyEmail = 'Email field shouldn’t be empty';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.companyEmail = 'Invalid email address';
  }
  var passwordRegexp = /^(?=.{8,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])).*/;
  if (!values.password) {
    errors.password = 'Password field shouldn’t be empty';
  }
  else if (!passwordRegexp.test(values.password)) {
    errors.password = 'Your password must contain 3 of the following: one upper case, one lower case, one numeric, or one special character.';
  }

  if (!values.select) {
    errors.select = 'Please select the option';
  }

  return errors;
};

const capitalize=(str)=>{
  return str.charAt(0).toUpperCase() + str.slice(1);
  };

export default validate;