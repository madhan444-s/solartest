import React from 'react';

import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

// fecth method
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { load as loadAccount } from '../../../../redux/reducers/commonReducer';
import EyeIcon from 'mdi-react/EyeIcon';

import configMessage from '../../../../config/configMessages';
import fetch from '../../../../config/service';
import config from '../../../../config/config';

// show message 
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';

// Loader
import Loader from '../../../App/Loader';

// Input
import DefaultInput from '../../../../shared/components/form/DefaultInput';

// Validate
import validate from '../../../Validations/validate';

const required = value => (value || typeof value === 'string' ? undefined : configMessage.fillField)
let passval = value => (value ? config.passwordRegex.test(value) ? undefined : 'The Password should contain one Uppercase letter, one Lower case letter and a Number' : configMessage.fillField)

class ChangePasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      showConfirmPassword: false,
      showCurrentPassword: false,
      isLoginSuccess: false,
      isLoading: true
    };
  }
  componentDidMount() {
    this.setState({ isLoading: false });
  }

  submit = (values) => {
    //for password matching
    values.currentPassword===undefined?this.setState({currentPasswordError:true}):this.setState({currentPasswordError:false})
    values.newPassword===undefined?this.setState({newPasswordError:true}):this.setState({newPasswordError:false}) 
    values.confirmPassword===undefined?this.setState({confirmPasswordError:true}):this.setState({confirmPasswordError:false})
     if(values.newPassword &&values.currentPassword&& values.confirmPassword) {
      this.handleUserPassword(values)
     }
  }

  // handle login user data
  handleUserPassword = (values) => {
    this.setState({
      isLoading: true
    });
    let userData = localStorage.getItem('loginCredentials');
    userData = JSON.parse(userData);
    // let userBody = values

    let userBody = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
      entityType: config.entityType,

    };
    return fetch('POST', `auth/changePassword `, userBody)
      .then((response) => {
        if (response && response.respCode && response.respCode === 200) {
          // display message
          this.setState({ redirect: true });
          showToasterMessage(response.respMessage, 'success');
        } else if (response && response.errorMessage) {
          // display message
          showToasterMessage(response.errorMessage, 'error');
        }
        this.setState({ isLoading: false });
        this.clearInputFields();
      }).catch((err) => {
        return err;
      });
  }

  // validate password
  showCurrentPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showCurrentPassword: !prevState.showCurrentPassword
    }));
  }
  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  showConfirmPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showConfirmPassword: !prevState.showConfirmPassword
    }));

  }
  // clear input data after submit password changes
  clearInputFields = () => {
    this.props.reset();
    this.props.load({currentPassword:undefined,newPassword:undefined,confirmPassword:undefined});
  }
  setDetails=(key,value)=>{
this.setState({currentPasswordError:false,newPasswordError:false,confirmPasswordError:false})
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="col-md-8" >
        <Loader loader={this.state.isLoading} />
        <Card>
          <CardHeader style={{ fontSize: 20 }}>Change Password</CardHeader>
          <CardBody>
            <form className='form' onSubmit={handleSubmit(this.submit)} >
              <div className='form__form-group'>
                <div className="form__form-group ">
                  <span className="form__form-group-label">Current Password</span>
                  <div className="form__form-group-field">
                    <Field
                      name="currentPassword"
                      component={DefaultInput}
                      type={this.state.showCurrentPassword ? 'text' : "password"}
                      placeholder="Current Password"
                      onChange={(e)=> e ?this.setDetails("currentPasswordError",false):null}
                      validate={[required]}
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${this.state.showCurrentPassword ? ' active' : ''}`}
                      onClick={e => this.showCurrentPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                  {this.state.currentPasswordError && <span className="form__form-group-error">{configMessage.fillField}</span>}
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">New Password</span>
                  <div className="form__form-group-field">
                    <Field
                      name="newPassword"
                      component={DefaultInput}
                      type={this.state.showPassword ? 'text' : "password"}
                      placeholder="New Password"
                      onChange={(e)=> e ?this.setDetails("newPasswordError",false):null}
                      validate={[passval]}
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                      onClick={e => this.showPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                  {this.state.newPasswordError && <span className="form__form-group-error">{configMessage.fillField}</span>}
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Confirm Password</span>
                  <div className="form__form-group-field">

                    <Field
                      name="confirmPassword"
                      component={DefaultInput}
                      onChange={(e)=> e ?this.setDetails("confirmPasswordError",false):null}
                      type={this.state.showConfirmPassword ? 'text' : "password"}
                      placeholder="Confirm Password"
                      validate={[passval]}
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${this.state.showConfirmPassword ? ' active' : ''}`}
                      onClick={e => this.showConfirmPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                  {this.state.confirmPasswordError && <span className="form__form-group-error">{configMessage.fillField}</span>}
                </div>
              </div>
              <div style={{ margin: 'auto' }}>
                <Button color='primary' type='submit'>Submit
                </Button>
                <Button color='primary' outline style={{ marginLeft: 10 }}
                  onClick={() => this.clearInputFields()}>Reset
                </Button>
                <Link to={'/employees'}>
                  <Button color='primary' style={{ marginLeft: 10 }}
                  >Back</Button>
                </Link>
              </div>

            </form>
          </CardBody>
        </Card>
        {this.state.redirect ? <Redirect to="/employees" /> : null}
      </div >
    );
  }
}
ChangePasswordForm = reduxForm({
  form: 'change_password_form', // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(ChangePasswordForm);

// You have to connect() to any reducers that you wish to connect to yourself
ChangePasswordForm = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(ChangePasswordForm);

export default ChangePasswordForm;
