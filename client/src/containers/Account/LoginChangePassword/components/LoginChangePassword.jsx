
import React, { PureComponent } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { load as loadAccount } from '../../../../redux/reducers/commonReducer';

import fetch from '../../../../config/service';
import config from '../../../../config/config';
import configMessage from '../../../../config/configMessages';

// show message 
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';
import DefaultInput from '../../../../shared/components/form/DefaultInput';
import validate from '../../../Validations/validate';
import Loader from '../../../App/Loader';
import EyeIcon from 'mdi-react/EyeIcon';
import apiCalls from '../../../../config/apiCalls';

let newpassval = value => (value ? config.passwordRegex.test(value) ? undefined : 'The Password should contain one Uppercase letter, one Lower case letter and a Number' : configMessage.fillField)

class LoginChangePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.buttonActionType = null;
    this.state = {
      isLoginSuccess: false,
      isLoading: true
    };
  }
  componentDidMount() {
    this.setState({ isLoading: false });
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

  // handle login user data
  handleUserPassword = (values) => {
    this.setState({
      isLoading: true
    });
    values.entityType = config.entityType
    return fetch('POST', apiCalls.loginChangePassword, values)
      .then((response) => {
        if (response && response.respCode && response.respCode) {
          showToasterMessage(response.respMessage, 'success');
          this.setState({
            isLoginSuccess: true
          });
        } else if (response && response.errorMessage) {
          showToasterMessage(response.errorMessage, 'error');
        }
        this.setState({
          isLoading: false
        });
        this.clearInputFields();
      }).catch((err) => {
        return err;
      });
  }

  // clear input data
  clearInputFields = () => {
    this.props.reset();
  }
  submit = (values) => {
    if (values && values.newPassword === values.confirmPassword) {
      this.handleUserPassword(values)
    } else if (values.password !== values.confirmPassword) {
      newpassval = values => (configMessage.passwordMatchValidation)
    }
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="col-md-6" >
        <Card>
          <CardHeader style={{ fontSize: 20 }}>Change Password</CardHeader>
          <CardBody>
            <form className="form" onSubmit={handleSubmit(this.submit)}>
              <div className='form__form-group'>
                <Loader loader={this.state.isLoading} />
                <div className="form__form-group">
                  <label className="form__form-group-label">New Password</label>
                  <div className=' form__form-group-field'>
                    <Field className='inputLogin'
                      type={this.state.showConfirmPassword ? 'text' : "password"}
                      name="newPassword"
                      component={DefaultInput}
                      placeholder='New Password'
                      validate={[newpassval]}
                    />
                    <button
                      type="button"
                      className={`form__form-group-button${this.state.showConfirmPassword ? ' active' : ''}`}
                      onClick={e => this.showConfirmPassword(e)}
                    ><EyeIcon />
                    </button>
                  </div>
                </div>
                <div className="form__form-group">
                  <label className="form__form-group-label">Confirm Password</label>
                  <div className='form__form-group-field'>
                    <Field className='inputLogin'
                      type={this.state.showPassword ? 'text' : "password"}
                      name="confirmPassword"
                      component={DefaultInput}
                      validate={[newpassval]}
                      placeholder='Confirm Password'
                    /> <button
                      type="button"
                      className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                      onClick={e => this.showPassword(e)}
                    ><EyeIcon />
                    </button>

                  </div>
                </div>
              </div>
              <div style={{ margin: 'auto' }}>
                <Button color="primary"
                  type='submit'>Submit</Button>
                <Button style={{ marginLeft: '10px' }} color="primary" outline
                  onClick={() => this.clearInputFields()}>Reset</Button>
              </div>
            </form>

          </CardBody>

        </Card>
        {this.state.isLoginSuccess ?
          <Redirect to='/log_in' /> : null}
      </div >

    );
  }
}
LoginChangePassword = reduxForm({
  form: 'Change password form', // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(LoginChangePassword);
LoginChangePassword = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(LoginChangePassword);
export default LoginChangePassword;