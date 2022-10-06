import React, { PureComponent } from 'react';
import { Button, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { load as loadAccount } from '../../../../redux/reducers/commonReducer';
// import {settingsAction} from '../../../../redux/actions/settingsAction'
import { settings } from '../../../../redux/actions/settingsAction'
import PropTypes from 'prop-types';

import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';

import renderCheckBoxField from '../../../../shared/components/form/CheckBox';

// Validate input
import validate from '../../../Validations/validate';

// Input field
import DefaultInput from '../../../../shared/components/form/DefaultInput';

// Config
import configMessage from '../../../../config/configMessages';
import fetchRequest from '../../../../config/service';
import apiCalls from '../../../../config/apiCalls';
import config from '../../../../config/config';

// Toaster message
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';

// Loader
import Loader from '../../../App/Loader';
import jwt_decode from "jwt-decode"
import ReCAPTCHA from "react-google-recaptcha";
import {
  browserName,
  osName, osVersion, deviceType
} from "react-device-detect";
const publicIp = require('public-ip');
const required = value => (value || typeof value === 'string' ? undefined : configMessage.fillField)

class LogInForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deviceInfo: {},
      showPassword: false,
      isLoginDisabled: config.displayRecaptcha ? true : false,
      isLoading: true,
      loginRememberInfo: null,
      captchaValue: null,
      isRobot: false,
      isLoginSuccess: false,
      isLoading: false,
      loginRole: '',
      userDetails: {},
      displayDetailsModal: false,
      formFields:[{"name":"name","placeholder":"Name","label":"Name"},{"name":"email","placeholder":"Email","label":"Email"},{"name":"phone","placeholder":"Phone","label":"Phone"}]
    };

    this.getSettingsData()
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
                  localStorage.removeItem('sessionexpired');
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
    let deviceInfo = {}
    publicIp.v4().then((res) => {
      deviceInfo.ipAddress = res
    })
    deviceInfo.browserName = browserName
    deviceInfo.osName = osName
    deviceInfo.osVersion = osVersion
    deviceInfo.deviceType = deviceType
    this.setState({ deviceInfo: deviceInfo });
  }
  getLoginRememberInfo = async () => {
    let keysToRemove = ["loginCredentials", "rolePermissions", 'loginBody', 'sessionexpired'];
    for (let key of keysToRemove) {
      localStorage.removeItem(key);
    }

    let loginRememberInfo = localStorage.getItem('loginRememberInfo');
    loginRememberInfo = loginRememberInfo ? JSON.parse(loginRememberInfo) : null;
    await this.props.load(loginRememberInfo);
    this.setState({
      loginRememberInfo: loginRememberInfo,
      remember_me: loginRememberInfo && loginRememberInfo.remember_me ? loginRememberInfo.remember_me : false
    })
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ showPassword: !prevState.showPassword }));
  }

  submit = (values) => {
    if (values.email && values.password) {

      this.setState({
        remember_me: values.remember_me,
        isLoginDisabled: true,
        isLoading: true
      })
      this.handleLoginUser(values)
    }
  }

  handleLoginUser = async (values) => {
    let deviceInfo = this.state.deviceInfo
    let userBody = {
      email: values.email,
      password: values.password,
      entityType: config.entityType,
      deviceInfo: deviceInfo
    };
    localStorage.setItem('loginBody', JSON.stringify(userBody));
    if (this.state.captchaValue || !config.displayRecaptcha) {
      return fetchRequest('POST', apiCalls.loginUser, userBody)
        .then(async (response) => {
          if (response && response.respCode && response.respCode == 200) {
            this.setState({
              isLoading: true
            });
            let userDetails = response.details;
            if (userDetails && userDetails._id) {
              if (response.accessToken) {
                let tokenInfo = {
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                  tokenExpires: response.tokenExpires,
                };
                userDetails = { ...userDetails, ...tokenInfo };
                // this.getSettingsData(userDetails)
                // save user credentials in storage
                localStorage.setItem('loginCredentials', JSON.stringify(userDetails));
                localStorage.removeItem('sessionexpired');
                if (userDetails && userDetails.role && userDetails.role == 'Teacher') {
                  this.setState({
                    loginRole: userDetails.role
                  })
                }
              }
              if (userDetails && userDetails.rolePermissions) {
                let permissions = userDetails.rolePermissions;
                // save user permissions in storage
                localStorage.setItem('rolePermissions', JSON.stringify(permissions));
              }
            }
            showToasterMessage(response.respMessage, 'success');
            await this.setState({
              isLoginSuccess: true,
            }, () => {
              if (this.state.remember_me) {
                var data = {
                  email: values.email,
                  password: values.password,
                  remember_me: this.state.remember_me
                }
                if (this.state.loginRememberInfo && this.state.loginRememberInfo.email &&
                  this.state.loginRememberInfo.email != values.email) {
                  localStorage.setItem('loginRememberInfo', JSON.stringify(data));
                } else if (!this.state.loginRememberInfo) {
                  localStorage.setItem('loginRememberInfo', JSON.stringify(data));
                }
              } else {
                localStorage.removeItem('loginRememberInfo');
              };
            });
          } else if (response && response.errorMessage) {
            setTimeout(() => {
              this.setState({
                isLoginDisabled: false,
                isLoading: false
              })
            }, 250);
            showToasterMessage(response.errorMessage, 'error');
          }
          // settingsAction
        }).catch((err) => {
          this.setState({
            isLoginDisabled: false,
            isLoading: false
          });
        });
    }
  }

  onChange = (value) => {
    if (value == 'remember' && this.state.remember_me) {
      this.setState({
        remember_me: false
      })
    } if (config.displayRecaptcha) {
      this.setState({
        captchaValue: value && value != "remember" ? value : null,
        isLoginDisabled: value && value != "remember" ? false : true,
      })
    }
  }
  getSettingsData = () => {
    let settingsData;
    // let filterCriteria = {};
    // filterCriteria['criteria'] = [{ key: 'userObjId', value: userDetails['_id'], type: 'eq' }];
    fetchRequest('GET', `settings`).then(async (response) => {
      if (response && response.respCode) {
        settingsData = response.settings[0]
        settingsData["GoogleClientId"]=settingsData["Admin"].GoogleClientId;
        settingsData["GooglesecretKey"]=settingsData["Admin"].GooglesecretKey;
        await this.setState({ settingsData: settingsData })
        this.loadGoogleComponent(this, this.state)
      }
    })
    return settingsData;
  }
  cancelReset = async type => {
    await this.setState({
      isLoginSuccess: false,
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
        Url = `${apiCalls["Employee"]}/${user._id}`;
      }
      return fetchRequest('PUT', Url, formValues)
        .then(async (response) => {
          if (response && response.respCode && response.respCode === 205) {
            showToasterMessage(response.respMessage, 'success');
            await this.setState({
              isLoginSuccess: true,
              displayDetailsModal: false
            })
          } else if (response && response.errorMessage) {
            await this.setState({
              isLoginSuccess: false,
              displayDetailsModal: false
            })
            showToasterMessage(response.errorMessage, 'error');
          }
        }).catch((err) => {
          this.setState({
            isLoginSuccess: false,
            displayDetailsModal: false
          })
          return err;
        });

    } else {
      await this.setState({
        isLoginSuccess: false,
        displayDetailsModal: false
      })
      return;
    }

  }
  render() {
    const { handleSubmit } = this.props;
    const { showPassword } = this.state;

    return (
      <div>
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

          <form className="form" onSubmit={handleSubmit(this.submit)}>
            <Loader loader={this.state.isLoading} />
            <div className="form__form-group mt-2">
              <span className="form__form-group-label">Username</span>
              <div className="form__form-group-field">
                {/* <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div> */}
                <Field
                  name="email"
                  component={DefaultInput}
                  type="email"
                  placeholder="Email"
                  validate={required}
                />
              </div>
            </div>
            <div className="form__form-group mt-2">
              <div className="form__form-group-label">Password</div>
              <div className="form__form-group-field">
                <Field
                  name="password"
                  component={DefaultInput}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  validate={required}
                  from={"login"}
                />
              </div>
            </div>

            <div className="form__form-group">
              <div className='d-flex justify-content-between'>
                <div>
                  <Field
                    name="remember_me"
                    component={renderCheckBoxField}
                    label="Remember me"
                    checked={this.state.remember_me}
                    onChange={() => this.onChange('remember')}
                  />
                </div>
                <div >
                  <Link to="/forgot_password">Forgot password?</Link>
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
            <div className="account__btns" style={{ width: '100%' }}>
              <Button className="ml-auto" style={{ width: '100%' }}
                color="primary"
                disabled={this.state.isLoginDisabled}
              >LOGIN</Button>
            </div>
            {config.displayGoogleLogin ?
              <div className='line'>
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
            <div className="form__form-group mb-2" >
              <div className="form__form-group-field" style={{ float: 'left' }}>
                Dont' have an account ?&nbsp;<Link to="/register">Register</Link>
              </div>
            </div>
            {/* change */}
            {/* Navigate to Home */}
            {this.state.isLoginSuccess ? <Redirect to="/employees" /> : null}
          </form >

        }
      </div>
    );
  }
}

LogInForm = reduxForm({
  form: 'log_in_form', // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(LogInForm);

// You have to connect() to any reducers that you wish to connect to yourself
LogInForm = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  {
    load: loadAccount,// bind account loading action creator
    settingsLoad: settings //binding settingsDAta
  }
)(LogInForm);

export default LogInForm;
