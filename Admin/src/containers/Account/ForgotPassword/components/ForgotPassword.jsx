import React, { PureComponent } from 'react';
import { Button } from 'reactstrap';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { load as loadAccount } from '../../../../redux/reducers/commonReducer';
import PropTypes from 'prop-types';
import config from '../../../../config/config';

// fecth 
import fetch from '../../../../config/service';
import configMessages from '../../../../config/configMessages';

// loader
import Loader from '../../../App/Loader';

// show message 
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';

// input
import DefaultInput from '../../../../shared/components/form/DefaultInput';

// validate
import validate from '../../../Validations/validate';
import ReCAPTCHA from "react-google-recaptcha";
let required = value => (value ? undefined : configMessages.fillField)

export default class ForgotPassword extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      settingsData: {},
      captchaValue: null,
      isLoginDisabled: config.displayRecaptcha ? true : false,
    };
    this.getSettingsData()
  }

  //handle login user data
  handleUserPassword = (values) => {
    this.setState({ isLoading: true });
    let userBody = {
      entityType: config.entityType
    }
    return fetch('POST', `auth/forgotPassword?email=${values.email}`, userBody)
      .then((response) => {
        if (response) {
          if (response.respCode && response.respCode === 200) {
            // display message
            showToasterMessage(response.respMessage, 'success');
          } else if (response.errorMessage) {
            // display message
            showToasterMessage(response.errorMessage, 'error');
          }
          this.setState({ isLoading: false });
        }
      }).catch((err) => {
        return err;
      });
  }
  getSettingsData = () => {
    let settingsData;
    fetch('GET', `settings`).then(async (response) => {
      if (response && response.respCode) {
        settingsData = response.settings[0]
        settingsData["GooglesecretKey"]=settingsData["Admin"].GooglesecretKey;
        this.setState({ settingsData: settingsData })
      }
    })
    return settingsData;
  }
  onChange = (value) => {
    if (config.displayRecaptcha) {
      this.setState({
        captchaValue: value ? value : null,
        isLoginDisabled: value ? false : true,
      })
    }
  }
  backtoLogin = () => {
    this.setState({
      isLogin: true
    })
  }

  submit = (values) => {
    if (values) {
      if (values.email) {
        this.handleUserPassword(values)
      }
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="form" onSubmit={handleSubmit(this.submit)} >
        <Loader loader={this.state.isLoading} />
        <div className="form__form-group">
          <span className="form__form-group-label">Email</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              component={DefaultInput}
              validate={[required]}
            />
          </div>
          {config.displayRecaptcha && this.state.settingsData && this.state.settingsData.GooglesecretKey ?
            < ReCAPTCHA
              sitekey={this.state.settingsData && this.state.settingsData.GooglesecretKey}
              // sitekey={"6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={this.onChange}
              type="image"
              className='recap'
            /> : null}
        </div>
        <div className="account__btns forgotPasswordLoginLink">
          <Button className="account__btn mt-2" color="primary"
            disabled={this.state.isLoginDisabled}
            type='submit'>Submit</Button>
        </div>
        <div className="pt-3 ml-auto">
          <Link to="/log_in">Back to Login?</Link>
        </div>
      </form>
    );
  }
}
ForgotPassword = reduxForm({
  form: 'Forgot form', // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(ForgotPassword);

// You have to connect() to any reducers that you wish to connect to yourself
ForgotPassword = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(ForgotPassword);
