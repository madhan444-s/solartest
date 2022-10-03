

import React from 'react';
import classNames from 'classnames';
import { load as loadAccount } from './../../redux/reducers/commonReducer';
import { settings } from '../../redux/actions/settingsAction'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from '../../shared/components/form/Select';
import RadioButton from '../../shared/components/form/RadioButton';
import DefaultInput from '../../shared/components/form/DefaultInput';
import fetchMethodRequest from '../../config/service';

// Toaster message
import showToasterMessage from '../UI/ToasterMessage/toasterMessage';
import validate from '../Validations/validate';
// Loader
import Loader from '../App/Loader';
// Calendar
//session expiry modal
import SessionExpiryModal from '../Cruds/CommonModals/SessionexpiryModal'
import { th } from 'date-fns/locale';
import store from '../App/store';

// const required = value => (value || typeof value === 'string' ? undefined : configMessages.fillField);
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
class SettingsForm extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      settingsData: '',
      emailDetails: false,
      emailDetails1: false,
      options: [
        { label: 'ddMMYYY', value: 'DD/MM/YYYY' },
        { label: 'MMDDYYY', value: 'MM/DD/YYYY' },
        { label: 'MMM DD YYYY', value: 'MMM DD YYYY' },
        { label: 'DD MMM YYYY', value: 'DD MMM YYYY' },
        { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
        { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
        { label: 'MM/DD/YYYY HH:mm A', value: 'MM/DD/YYYY HH:mm A' },
        { label: 'MMM DD YYYY HH:mm A', value: 'MMM DD YYYY HH:mm A' },
        { label: 'hh:mm A, MM-DD-YYYY', value: 'hh:mm A, MM-DD-YYYY' },
        { label: 'MM/DD/YYYY HH:mm', value: 'MM/DD/YYYY HH:mm' },
        { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
        { label: 'YYYY-MM-DD[T]HH:mm:ss.SSS', value: 'YYYY-MM-DD[T]HH:mm:ss.SSS' },
        { label: 'YYYY-MM-DD[T]00:00:00Z', value: 'YYYY-MM-DD[T]00:00:00Z' },
        { label: 'MMM YYYY', value: 'MMM YYYY' },
        { label: 'MMM  DD, YYYY', value: 'MMM  DD, YYYY' },
      ],
      isLoading: false,

    };
  }

  componentDidMount = async () => {
    let userDetails = JSON.parse(localStorage.getItem('loginCredentials'))
    // let apiUrl=''
    this.setState({
      isLoading: true
    });
    let filterCriteria = {};
    filterCriteria['criteria'] = [];
    fetchMethodRequest('GET', `settings?filter=${JSON.stringify(filterCriteria)}`).then(async (response) => {
      if (response && response.respCode) {
        let settingsData = response.settings[0]
        this.setState({
          isLoading: false,
          settingsData: settingsData
        });
        if (settingsData.emailSourceType == "nodeMailer") {
          this.setState({ emailDetails1: true, emailServiceType: "nodeMailer", sendgridEmail: settingsData.sendGridEmail, smtphost: settingsData.nodeMailerHost, smtpuser: settingsData.nodeMailerUser, smtppassword: settingsData.nodeMailerPass })
        } else {
          this.setState({ emailDetails: true, emailServiceType: "sendgrid", sendgridEmail: settingsData.sendGridEmail, sendgridApiKey: settingsData.sendGridApiKey })
        }
        this.props.load(settingsData)
        this.props.settingsLoad(settingsData)
      }
    })
  }

  mailFields = (e) => {
    console.log("eeeeeeeeeeeeeeeeesrujiiiiii", e)
    if (e == "sendgrid") {
      this.setState({ emailDetails1: false })
      this.setState(prevState => ({ emailDetails: !prevState.emailDetails }));
    } else {
      this.setState({ emailDetails: false })
      this.setState(prevState => ({ emailDetails1: !prevState.emailDetails1 }));
    }
    if (e == "sendgrid") {
      this.setState({ emailServiceType: e })
    } else {
      this.setState({ emailServiceType: e })
    }
  }
  //send data to server
  saveDataToServer = (formValues) => {

    let validationExists;
    this.setState({
      isLoading: true
    });

    formValues.emailSourceType = this.state.emailServiceType ? this.state.emailServiceType : null
    formValues.sendGridEmail = this.state.sendgridEmail ? this.state.sendgridEmail : ""
    formValues.sendGridApiKey = this.state.sendgridApiKey ? this.state.sendgridApiKey : ""
    formValues.nodeMailerHost = this.state.smtphost ? this.state.smtphost : ""
    formValues.nodeMailerUser = this.state.smtpuser ? this.state.smtpuser : ""
    formValues.nodeMailerPass = this.state.smtppassword ? this.state.smtppassword : ""

    if (formValues) {
      let method, apiUrl;
      apiUrl = `settings/${formValues._id}`
      return fetchMethodRequest('PUT', apiUrl, formValues)
        .then(async (response) => {
          // let sessionexpired = await localStorage.getItem('sessionexpired')
          // if (sessionexpired == "true") {
          //   await this.setState({ sessionExpiryModal: true })
          // }
          let settingsData = this.state.settingsData
          settingsData.dateFormat = formValues.dateFormat
          this.setState({ settingsData: settingsData })
          await this.props.settingsLoad(settingsData)
          if (response && response.respCode) {
            showToasterMessage(response.respMessage, 'success');
          } else if (response && response.errorMessage) {
            showToasterMessage(response.errorMessage, 'error');
          }

          this.setState({
            isLoading: false,

            sendgridApiKey: "",
            smtphost: "",
            smtpuser: "",
            smtppassword: ""
          });
        }).catch((err) => {
          return err;
        });
    }
  }

  apple = () => {
    console.log('I am refreshed')
  }
  render() {
    const { handleSubmit } = this.props;
    const { options, isLoading } = this.state
    let isSubmitting = false
    const modalClass = classNames({
      'modal-dialog--colored': this.state.colored,
      'modal-dialog--header': this.state.header,
    });
    //
    return (
      <div style={{ overflowX: 'hidden', height: '88vh' }} onLoad={this.apple}>
        <Loader loader={isLoading} />
        <form onSubmit={handleSubmit(this.saveDataToServer)}>
          <div className='row px-5'>
            <div className='col-sm-6'>
              <div className="row create-header">
                <h4 className="col-md-6 offset-3 text-center py-3">Mail Settings</h4>
              </div>
              <div className="form-group">
                <label>Email Source Type </label>
                <div className="d-block d-sm-block d-md-flex radio-container">
                  <div className="form-check form-check-inline custom-align mr-4">
                    <Field
                      id=''
                      name='emailSourceType'
                      label="Node Mailer"
                      radioValue="nodeMailer"
                      // onClick={() => this.handleeditCheck('true')}
                      component={RadioButton}
                      // defaultChecked={this.props.rowData && this.props.rowData.displayineditForm == "true" ? true : false}
                      onChange={(e) => this.mailFields("nodeMailer")}

                    />
                    <Field
                      id='true'
                      name='emailSourceType'
                      label="Send Grid"
                      radioValue="sendgrid"
                      // onClick={() => this.handleeditCheck('true')}
                      component={RadioButton}
                      // defaultChecked={this.props.rowData && this.props.rowData.displayineditForm == "true" ? true : false}
                      onChange={(e) => this.mailFields("sendgrid")}
                    />
                  </div>

                </div>
              </div>
              {/* <div className="form-group">
                <label> </label>
                <div className="form__form-group-field">
                  <Field
                    name={'dateFormat'}
                    component={Select}
                    options={options}
                    placeholder={'Select Date format'}
                  />
                </div>
              </div> */}


              {this.state.emailDetails1 ? <div className='form-group'>
                <div className="row">
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Smtp host</label>
                    <Field
                      name="nodeMailerHost"
                      component={DefaultInput}
                      type="text"
                      placeholder="Smtp host"
                      className="form-control"
                      onChange={(e) => this.setState({ smtphost: e })}
                    />
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Smtp user</label>
                    <Field
                      name="nodeMailerUser"
                      component={DefaultInput}
                      type="text"
                      placeholder="Smtp user"
                      className="form-control"
                      onChange={(e) => this.setState({ smtpuser: e })}
                    />
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Smtp password</label>
                    <Field
                      name="nodeMailerPass"
                      component={DefaultInput}
                      type="text"
                      placeholder="Smtp password"
                      className="form-control"
                      onChange={(e) => this.setState({ smtppassword: e })}
                    />
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Nodemailer Email</label>
                    <Field
                      name="sendGridEmail"
                      component={DefaultInput}
                      type="text"
                      placeholder="NodemailerEmail"
                      className="form-control"
                      onChange={(e) => this.setState({ sendgridEmail: e })}
                    />
                  </div>
                </div>
              </div>
                : null
              }
              {this.state.emailDetails ? <div className='form-group'>
                <div className="row">
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Send Grid Api Key</label>
                    <Field
                      name="sendGridApiKey"
                      component={DefaultInput}
                      type="text"
                      placeholder="sendGridApiKey"
                      className="form-control"
                      onChange={(e) => this.setState({ sendgridApiKey: e })}
                    />
                  </div>
                  <div className='col-12 col-sm-12 col-md-6 col-lg-4'>
                    <label className='labelMargin'>Send Grid Email</label>
                    <Field
                      name="sendGridEmail"
                      component={DefaultInput}
                      type="text"
                      placeholder="sendGridEmail"
                      className="form-control"
                      onChange={(e) => this.setState({ sendgridEmail: e })}
                    />
                  </div>
                </div>
              </div>
                : null
              }




            </div>
            <div className='col-sm-6'>
              <div className="row create-header">
                <h4 className="col-md-6 offset-3 text-center py-3">Token Time Settings</h4>
              </div>
              <div className="form-group">
                <label>Expire Token Time (min)</label>
                <Field
                  component={DefaultInput}
                  name="expireTokenTime" className="form-control" disabled={isSubmitting} />
              </div>

            </div>
          </div>
          <div className='pl-5'>
            <button type='submit' className='btn btn-primary'>Update</button>
          </div>
        </form>
      </div >
    );
  }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
SettingsForm = reduxForm({
  form: "Common Form", // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(SettingsForm);

// You have to connect() to any reducers that you wish to connect to yourself
SettingsForm = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),

  {
    load: loadAccount,// bind account loading action creator
    settingsLoad: settings,
    // settingsData:auth
  }
)(SettingsForm);

export default SettingsForm;





