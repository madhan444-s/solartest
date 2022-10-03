import React, { PureComponent } from 'react';
import { Button, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { load as loadAccount } from '../../../redux/reducers/commonReducer';
// import {settingsAction} from '../../../../redux/actions/settingsAction'
import { settings } from '../../../redux/actions/settingsAction'
import PropTypes from 'prop-types';

import renderCheckBoxField from '../../../shared/components/form/CheckBox';

// Validate input
// import validate from '../../Validations/validate';
import validate from '../../Validations/validate';

// Input field
import DefaultInput from '../../../shared/components/form/DefaultInput';

// Config
import configMessage from '../../../config/configMessages';
import fetchRequest from '../../../config/service';
import apiCalls from '../../../config/apiCalls';
import config from '../../../config/config';
import GoogleLogin from 'react-google-login'

// Toaster message
import showToasterMessage from '../../UI/ToasterMessage/toasterMessage';
import jwt_decode from "jwt-decode"
import ReCAPTCHA from "react-google-recaptcha";
import {
  browserName,
  osName, osVersion, deviceType
} from "react-device-detect";
// Loader
import Loader from '../../App/Loader';
const publicIp = require('public-ip');
let newpassval = value => (value ? config.passwordRegex.test(value) ? undefined : 'Not a secure paswword, hint:User1234$' : configMessage.fillField)
const newpassvalLength = value => (value ? value.length >= 8 ? undefined : 'Password length should be atleast 8' : configMessage.fillField)

const required = value => (value || typeof value === 'string' ? undefined : configMessage.fillField)
const normalizePhone = (value) => {
  if (!value) {
    return value
  }
  const onlyNums = value.replace(/[^\d]/g, '')
  if (onlyNums.length <= 3) {
    return onlyNums
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`
  }
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(6, 10)}`
}
class Register extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      is_agreed: false,
      isNotChecked: false,
      deviceInfo: {},
      isLoginDisabled: config.displayRecaptcha ? true : false,
      captchaValue: null,
      isLoginSuccess: false,
      isGoogleLoginSuccess: false,
      settingsData: {},
      isLoading: false,
      loginRole: '',
      userDetails: {},
      displayDetailsModal: false,
      formFields:[{"name":"name","placeholder":"Name","label":"Name"},{"name":"email","placeholder":"Email","label":"Email"},{"name":"phone","placeholder":"Phone","label":"Phone"}]
    };
    this.getSettingsData()
  }


  submit = (values) => {
    console.log(values)
    values.status = "Active"
    values.role = "Admin"
    // if (this.state.is_agreed) {
    return fetchRequest('POST', "users/register", values)
      .then(async (response) => {
        if (response && response.respCode && response.respCode == 204) {
          this.setState({
            isLoginSuccess: true,
            isNotChecked: false
          })
          let userDetails = response.details
          if (response.accessToken) {
            let tokenInfo = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            };
            userDetails = { ...userDetails, ...tokenInfo };
            // save user credentials in storage
            localStorage.setItem('loginCredentials', JSON.stringify(userDetails));

          }
          showToasterMessage(response.respMessage, 'success');
        } else if (response && response.errorMessage) {
          showToasterMessage(response.errorMessage, 'error');
        }

      })
    // } else if (!this.state.is_agreed) {
    //   this.setState({
    //     isNotChecked: true
    //   })
    // }
  }
  onChange = (value) => {
    if (config.displayRecaptcha) {
      this.setState({
        captchaValue: value ? value : null,
        isLoginDisabled: value ? false : true,
      })
    }
  }
  getSettingsData = () => {
    let settingsData;
    fetchRequest('GET', `settings`).then(async (response) => {
      if (response && response.respCode) {
        settingsData = response.settings[0]
        settingsData["GoogleClientId"]=settingsData["client"].GoogleClientId;
        settingsData["GooglesecretKey"]=settingsData["client"].GooglesecretKey;
        await this.setState({ settingsData: settingsData })
        this.loadGoogleComponent(this, this.state)
      }

    })
    return settingsData;
  }
  loadGoogleComponent = (self) => {
    function handleCredentialResponse(response) {
      var data = jwt_decode(response.credential);
      if (data.email && data.name && config.displayGoogleLogin) {
        return fetchRequest('POST', 'auth/socialLogin', { name: data.name, email: data.email, role: "Admin", entityType: config.entityType, deviceInfo: self.state.deviceInfo })
          .then(async (response) => {
            if (response && response.respCode && response.respCode == 200) {
              self.setState({
                isLoading: true
              });
              let userDetails = response.details;
              console.log(userDetails)
              if (userDetails && userDetails._id) {
                if (response.accessToken) {
                  let tokenInfo = {
                    accessToken: response.accessToken,
                    refreshToken: response.refreshToken,
                    tokenExpires: response.tokenExpires,
                  };
                  userDetails = { ...userDetails, ...tokenInfo };

                  // save user credentials in storage
                  localStorage.setItem('loginCredentials', JSON.stringify(userDetails));
                }
                if (userDetails && userDetails.rolePermissions) {
                  let permissions = userDetails.rolePermissions;
                  // save user permissions in storage
                  console.log(permissions)
                  localStorage.setItem('rolePermissions', JSON.stringify(permissions));
                }
              }

              showToasterMessage(response.respMessage, 'success');

              if (userDetails.firstTimeLogin) {
                self.setState({
                  // isLoginSuccess: true,
                  displayDetailsModal: true,
                  isLoading: false,
                  userDetails: userDetails
                })
                if (self.props.load) {
                  setTimeout(() => {
                    self.props.load(self.state.userDetails)
                  }, 300);
                }

              } else {
                self.setState({
                  isLoginSuccess: true,
                  isGoogleLoginSuccess: true,
                })
              }
            } else if (response && response.errorMessage) {
              setTimeout(() => {
                self.setState({
                  isLoginDisabled: false,
                  isLoading: false
                })
              }, 250);
              showToasterMessage(response.errorMessage, 'error');
            }
            // settingsAction
          }).catch((err) => {
            self.setState({
              isLoginDisabled: false,
              isLoading: false
            });
          });
      }
    }
    if (config.displayGoogleLogin) {
      // window.onload = function () {
      if (self.state.settingsData && self.state.settingsData.GoogleClientId) {
        let GoogleClientId = self.state.settingsData && self.state.settingsData.GoogleClientId ? self.state.settingsData.GoogleClientId : null
        /* global google */
        google.accounts.id.initialize({
          client_id: GoogleClientId,
          callback: handleCredentialResponse
        });
        google.accounts.id.renderButton(
          document.getElementById("loginButton"),
          { theme: "outline", size: "large", width: document.getElementById('googleButton').clientWidth }  // customization attributes
        );
        // google.accounts.id.prompt(); // also display the One Tap dialog
      }
      // }
    }
    return true
  }

  componentDidMount = () => {
    let self = this
    let deviceInfo = {}
    publicIp.v4().then((res) => {
      deviceInfo.ipAddress = res
    })
    deviceInfo.browserName = browserName
    deviceInfo.osName = osName
    deviceInfo.osVersion = osVersion
    deviceInfo.deviceType = deviceType
    this.setState({ deviceInfo: deviceInfo })
  }

  cancelReset = async type => {
    await this.setState({
      isLoginSuccess: false,
      isGoogleLoginSuccess: false,
      displayDetailsModal: false
    })
    localStorage.removeItem("rolePermissions");
    localStorage.removeItem("loginCredentials");
    await this.props.reset();
  }
  handleModalSubmit = async formValues => {
    if (formValues) {
      delete formValues.email;
      delete formValues.password;
      formValues["firstTimeLogin"] = false
      let Url;
      if (localStorage.getItem('loginCredentials')) {
        let user = JSON.parse(localStorage.getItem('loginCredentials'));
        Url = `${apiCalls["Users"]}/${user._id}`;
      }
      return fetchRequest('PUT', Url, formValues)
        .then(async (response) => {
          if (response && response.respCode && response.respCode === 205) {
            showToasterMessage(response.respMessage, 'success');
            await this.setState({
              isLoginSuccess: false,
              isGoogleLoginSuccess: true,
              displayDetailsModal: false
            })
          } else if (response && response.errorMessage) {
            await this.setState({
              isLoginSuccess: false,
              isGoogleLoginSuccess: false,
              displayDetailsModal: false
            })
            showToasterMessage(response.errorMessage, 'error');
          }
        }).catch((err) => {
          this.setState({
            isLoginSuccess: false,
            isGoogleLoginSuccess: false,
            displayDetailsModal: false
          })
          return err;
        });

    } else {
      await this.setState({
        isLoginSuccess: false,
        isGoogleLoginSuccess: false,
        displayDetailsModal: false
      })
      return;
    }

  }
  render() {
    const { handleSubmit } = this.props;
    const { showPassword, formFields } = this.state;

    return (
      <span>
        {this.state.displayDetailsModal ?
          <Modal
            isOpen={this.state.displayDetailsModal}
            toggle={this.cancelReset}
            centered
            className={`modal-dialog modal-dialog-centered modal-dialog--primary  modal-dialog--header`}
          >
            <ModalHeader className="modal__header">
              <button
                className="lnr lnr-cross modal__close-btn"
                type="button"
                onClick={this.cancelReset}
              />
              <p className="bold-text  modal__title"> {"Details"} </p>
            </ModalHeader>
            <ModalBody className="p-2">
              <Loader loader={this.state.isLoading} />

              <form className="form" onSubmit={handleSubmit(this.handleModalSubmit)}>
                <div className="row mx-1 mt-3 " style={{ width: '100%' }}>

                  {
                    this.state.formFields && this.state.formFields.length && this.state.formFields.length > 0 ?
                      this.state.formFields.map((item, index) => {
                        return (
                          <div className="col-sm-12 col-md-6">
                            <div className="form__form-group ">
                              <span className="form__form-group-label">{item.label}</span>
                              <div className="form__form-group-field">
                                <Field
                                  name={item.name}
                                  component={DefaultInput}
                                  type="text"
                                  placeholder={item.placeholder}
                                  validate={required}
                                  isDisable={item.name && item.name == "email" ? true : false}
                                />
                              </div>
                            </div>
                          </div>

                        )
                      }) : null

                  }
                  <div className="col-sm-12 text-center pt-3">
                    <div>
                      <Button
                        outline
                        color="primary"
                        type="buttom"
                        onClick={this.cancelReset}
                      >
                        Cancel
                      </Button>

                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          :
          <div>
            < form className="form" autocomplete="off" onSubmit={handleSubmit(this.submit)}>
              <Loader loader={this.state.isLoading} />
              <div className='w-100'>
                {
                  this.state.formFields && this.state.formFields.length && this.state.formFields.length > 0 ?
                    this.state.formFields.map((item, index) => {
                      return (
                        <div className="form__form-group">
                          <span className="form__form-group-label">{item.label}</span>
                          <div className="form__form-group-field">
                            <Field
                              name={item.name}
                              component={DefaultInput}
                              type="text"
                              placeholder={item.placeholder}
                              validate={required}
                            />
                          </div>
                        </div>
                      )
                    }) : null

                }

                <div className="form__form-group">
                  <span className="form__form-group-label">Password</span>
                  <div className="form__form-group-field">
                    <Field
                      name="password"
                      component={DefaultInput}
                      type="password"
                      placeholder="Password"
                      from={true}
                      validate={[required, newpassvalLength, newpassval]}
                    />
                  </div>
                </div>
                <div className="form__form-group ">
                  <span className="form__form-group-label">Confirm Password</span>
                  <div className="form__form-group-field">
                    <Field
                      name="confirmPassword"
                      component={DefaultInput}
                      type="password"
                      placeholder="Confirm Password"
                      validate={[required]}
                      required={true}
                    />
                  </div>
                </div>
              </div>
              <div className="w-100 mt-2">
                {config.displayRecaptcha && this.state.settingsData && this.state.settingsData.GooglesecretKey ?
                  < ReCAPTCHA
                    sitekey={this.state.settingsData && this.state.settingsData.GooglesecretKey}
                    // sitekey={"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={this.onChange}
                    type="image"
                    className='recap'
                  />
                  : null}
              </div>
              <div className="account__btns" style={{ margin: 'auto', width: '100%' }}>
                <Button
                  className=" mt-2 mb-0"
                  color="primary"
                  disabled={this.state.isLoginDisabled}
                  style={{ width: '100%' }}
                >
                  Register
                </Button>
              </div>
              {config.displayGoogleLogin ?
                <div className='line mt-4'>
                  <div className='text'>
                    or
                  </div>
                </div>
                : null
              }
              <div className='d-flex flex-column w-100 pb-3'>
                {config.displayGoogleLogin ?
                  <div id="googleButton">
                    <div id="loginButton" className="strike w-100"></div>
                  </div>
                  : null
                }
              </div>
              <div className='py-2'>
                <p>
                  Back to <Link to="/log_in">Login</Link>
                </p>
              </div>
              {this.state.isLoginSuccess ? <Redirect to="/log_in" /> : null}
              {this.state.isGoogleLoginSuccess ? <Redirect to="/users" /> : null}
            </form>
          </div>
        }
      </span >
    );
  }
}


Register = reduxForm({
  form: 'Registerform', // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(Register);

// You have to connect() to any reducers that you wish to connect to yourself
Register = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  {
    load: loadAccount,// bind account loading action creator
    settingsLoad: settings //binding settingsDAta
  }
)(Register);

export default Register;
