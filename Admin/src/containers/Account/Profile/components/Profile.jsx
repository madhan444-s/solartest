import React, { PureComponent } from 'react';
import {
  Card, CardBody, Col, Button, ButtonToolbar,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { load as loadAccount } from './../../../../redux/reducers/commonReducer';
import { Link } from 'react-router-dom';
// file upload
import RenderFileInputField from '../../../Form/components/FileUpload';
import CalendarBlankIcon from 'mdi-react/CalendarBlankIcon';
import DatePicker from '../../../../shared/components/form/DatePicker';
import DefaultTextArea from '../../../../shared/components/form/DefaultTextArea';
// validate
import validate from './validate';

// config
import fetch from '../../../../config/service';
import apiCalls from '../../../../config/apiCalls';
import config from '../../../../config/config';

const renderField = ({
  input, placeholder, type, isDisable, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap">
    <input {...input} disabled={isDisable} placeholder={placeholder} type={type} />
    {touched && error && <span className="form__form-group-error">{error}</span>}
  </div>
);



renderField.propTypes = {
  input: PropTypes.shape().isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

renderField.defaultProps = {
  placeholder: '',
  meta: null,
  type: 'text',
  isDisable: false
};

class Profile extends PureComponent {
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
      showPassword: false,
      locationProps: '',
      profileFields: [{"name":"name","type":"text","placeholder":"Name","label":"Name","width":110,"id":"name","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"fieldType":"Link","displayinregisterForm":"true","disabled":true,"globalSearchField":"true","show":true,"mobile":true,"displayInSettings":true},{"name":"email","type":"email","placeholder":"Email","label":"Email","id":"email","width":150,"displayinaddForm":"true","displayineditForm":"false","displayinlist":"true","controllerName":null,"displayinregisterForm":"true","disabled":true,"show":true,"globalSearchField":"true","mobile":true,"displayInSettings":true},{"name":"address","type":"textarea","placeholder":"Address","label":"Address","id":"address","width":180,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"show":true,"disabled":true,"globalSearchField":"true","mobile":true,"displayInSettings":true},{"name":"phone","type":"text","placeholder":"Phone","label":"Phone","id":"phone","width":110,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"displayinregisterForm":"true","show":true,"disabled":true,"mobile":true,"displayInSettings":true,"fieldType":"Link","style":{"color":"#0e4768","cursor":"pointer","textTransform":"capitalize"}}]
      // [
      //   {
      //     name: 'firstName',
      //     type: 'text',
      //     placeholder: 'FirstName',
      //     label: 'First Name'
      //   },
      //   {
      //     name: 'email',
      //     type: 'email',
      //     placeholder: 'Email',
      //     isDisable: true,
      //     label: 'Email'
      //   },
      //   {
      //     name: 'role',
      //     type: 'text',
      //     placeholder: 'Permissioned Role',
      //     isDisable: true,
      //     label: 'Role'
      //   },
      //   {
      //     name: 'status',
      //     type: 'text',
      //     placeholder: 'Status',
      //     label: 'Status'
      //   },
      //   {
      //     name: 'lastName',
      //     type: 'text',
      //     placeholder: 'Last Name',
      //     label: 'Last Name'
      //   },
      //   {
      //     name: 'displayName',
      //     type: 'text',
      //     placeholder: 'Display Name',
      //     label: 'Last Name'
      //   },

      //   {
      //     name: 'userId',
      //     type: 'text',
      //     placeholder: 'User Id',
      //     label: 'User Id',
      //     isDisable: true,

      //   },
      //   {
      //     name: 'dob',
      //     type: 'date',
      //     placeholder: 'MM-DD-YYYY',
      //     label: 'Date Of Birth'
      //   },
      // ]
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getUserData();
  }

  componentWillUnmount = () => {
    this.props.onRef(null);
  }
  // get data from server based on Id
  getUserData = async () => {
    let prevsPros = this.props.locationProps;
    this.setState({ locationProps: prevsPros })
    if (localStorage.getItem('loginCredentials')) {
      let user = JSON.parse(localStorage.getItem('loginCredentials'));
      await this.setState({ userId: user._id });
      let Url = `${apiCalls.Employees}/${user._id}`;
      return fetch('GET', Url)
        .then(async (response) => {
          if (response && response.details) {
            user=  Object.assign(user, response.details)
            await localStorage.setItem('loginCredentials', JSON.stringify(user));
            if (response.details.photo) {
              this.updateTopbarData()
              this.setState({ pic: response.details.photo });
            }
            this.props.load(response.details);
          } else if (response && response.errorMessage) {
          }
        }).catch((err) => {
          return err;
        });
    }
    else {
      return;
    }
  }
  updateTopbarData = () => {
    let prevsPros = this.state.locationProps
    if (prevsPros && prevsPros.location && prevsPros.location.state && prevsPros.location.state.updateTopbarProfileData) {
      this.props.locationProps.location.state.updateTopbarProfileData()
    }
  }
  getFileName = (file) => {
    this.updateTopbarData()
    this.setState({ pic: file });
  }

  render() {
    const { handleSubmit, reset, t } = this.props;
    const profileFields = this.state.profileFields;
    return (
      <Col md={12} lg={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">Profile</h5>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div>
                <div className='row'>
                  {profileFields && profileFields.length > 0 ? profileFields.map((item, index) => (
                    <div className='col-sm-12 col-md-6 pb-2'>
                      <div className="form__form-group" >
                        <span className="form__form-group-label">{item.label}</span>
                        <div className="form__form-group-field">
                          {(item.type === 'text' || item.type === 'textarea' || item.type === 'password' || item.type === 'email' || item.type === 'url') ?
                            <Field
                              id={item.id}
                              name={item.name}
                              component={item.type === 'textarea' ? DefaultTextArea : renderField}
                              type={item.text}
                              placeholder={item.placeholder}
                              isDisable={item.isDisable ? item.isDisable :item.type === 'email'?true: false}
                            />
                            : item.type === 'date' ?
                              <div className='w-100 d-flex'>
                                <Field
                                  id={item.id}
                                  name={item.name}
                                  component={DatePicker}
                                  type={item.text}
                                  placeholder={item.placeholder}
                                  isDisable={item.isDisable ? item.isDisable : false}
                                />
                                <div className="iconstyle form__form-group-icon">
                                  <CalendarBlankIcon />
                                </div>
                              </div>
                              : null}


                        </div>
                      </div>
                    </div>
                  )) : null}
                  <div className='col-sm-12 col-md-6'>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Profile Image</span>
                      <div className="form__form-group-field">
                        <Field
                          name="photo"
                          component={RenderFileInputField}
                          onRef={(ref) => (this.profileUploadRef = ref)}
                          url={"uploads?uploadWhileCreate=true&uploadPath=employee"}
                          label='Upload photo'
                          type='profile'
                          acceptType="image/*"
                          getFileName={this.getFileName}
                        />
                      </div>
                      <div className='col-md-2' style={{ padding: '20px' }}>
                        <div style={{ justifyContent: 'center' }}>
                          {(this.state.pic) ?
                            <img src={`${config.imgUrl}employee/${this.state.pic}`} className='detailsImgStyle' />
                            : null
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-12 '>
                    <div className='float-right'>
                      <ButtonToolbar className="form__button-toolbar">
                        <Link to={'/employees'}>
                          <Button style={{ marginLeft: '50px' }} color='primary'
                          >Cancel</Button>
                        </Link>
                        <Button color="primary" type="submit">Submit</Button>
                      </ButtonToolbar>
                    </div>
                  </div>
                </div>

              </div>
            </form>
          </CardBody>
        </Card>
      </Col >
    );
  }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
Profile = reduxForm({
  form: "ProfileForm", // a unique identifier for this form
  enableReinitialize: true,
  validate
})(Profile);

// You have to connect() to any reducers that you wish to connect to yourself
Profile = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(Profile);

export default Profile;