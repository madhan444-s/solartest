import React from "react";
import { Field, reduxForm } from "redux-form";
import { Button, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { connect } from "react-redux";
import { load as loadAccount } from "../../../redux/reducers/commonReducer";
import Select from "../../../shared/components/form/Select";
import CalendarBlankIcon from "mdi-react/CalendarBlankIcon";
// fecth method from service.js file
import fetch from "../../../config/service";
import config from "../../../config/config";
import configMessage from "../../../config/configMessages";
import AutoComplete from '../../../../src/containers/Form/components/AutoComplete';
import renderRadioButtonField from '../../../shared/components/form/RadioButton'
import TimePicker from '../../../shared/components/form/TimePicker';
// show message
import showToasterMessage from "../../UI/ToasterMessage/toasterMessage";
import DefaultInput from "../../../shared/components/form/DefaultInput";
import DefaultTextArea from "../../../shared/components/form/DefaultTextArea";
import DatePicker from "../../../shared/components/form/DatePicker";
import validate from "../../Validations/validate";
import Loader from "../../App/Loader";
import EyeIcon from "mdi-react/EyeIcon";
import { withTranslation } from "react-i18next";
import { ConsoleWriter } from "istanbul-lib-report";
import { lightBlue } from "@material-ui/core/colors";

const radioRequired = value => {
  let error = undefined;
  if (value || typeof value === "string") {
    error = undefined;
  } else {
    error = configMessage.fillRadio;
  }
  return error;
};
const required = value =>
  value || typeof value === "string" ? undefined : configMessage.fillField;
const normalizePhone = value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 3) {
    return onlyNums;
  }
  if (onlyNums.length <= 7) {
    return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  }
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`;
};
class NewUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.buttonActionType = null;
    this.state = {
      isLoginSuccess: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      newFormFields: this.props.newFormFields
    });

    // console.log("props 1", this.props);
    this.props.load(this.props.item);
  }

  // on value change in input
  // handleChange = etvent => {
  //   this.setState({
  //     [event.target.name]: event.target.value
  //   });
  // };

  // showPassword = (e) => {
  //     e.preventDefault();
  //     this.setState(prevState => ({
  //         showPassword: !prevState.showPassword
  //     }));
  // }

  // showConfirmPassword = (e) => {
  //     e.preventDefault();
  //     this.setState(prevState => ({
  //         showConfirmPassword: !prevState.showConfirmPassword
  //     }));
  // }

  // clear input data
  // clearInputFields = () => {
  //   this.props.reset();
  // };
  getDropdown(i, item) {
    return (
      <div id={item.id} className="col-sm-6">
        <div className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <Field
            key={i}
            name={item.name}
            component={Select}
            options={item.options}
            // onChange={
            //   item.dependent
            //     ? e => this.handleFnEnableControlsBasedOnValue(e, item.dependent)
            //     : null
            // }
            defaultValue={
              this.props.formType && this.props.formType === "add"
                ? item.defaultValue
                : null
            }
            placeholder={item.placeholder}
            isDisable={item.disable ? item.disable : false}
          // getCategoryProductType={this.getCategoryProductType}
          // updateClinicName={this.updateClinicName}
          // updateDistributorName={this.updateDistributorName}
          // getProjectDropDownValues={this.getProjectDropDownValues}
          />
        </div>
      </div>
    );
  }

  getDefault(i, item) {
    const { t } = this.props;
    return (
      <div id={item.id} className="col-sm-6">
        <div className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <Field
            key={i}
            name={item.name ? item.name : null}
            component={DefaultInput}
            isDisable={
              this.props.formType &&
                this.props.formType === "edit" &&
                (item.type === "email" || item.type === "password")
                ? true
                : item.disable
            }
            type={item.type ? item.type : "text"}
            id={item.id ? item.id : null}
            placeholder={item.placeholder ? t(item.placeholder) : null}
          // validate={[required]}
          // normalize={item.formatType === "US" ? normalizePhone : null}
          />
        </div>
      </div>
    );
  }
  getDates(i, item) {
    return (
      <div id={item.id} className="col-sm-6">
        <div key={i} className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <Field
            key={i}
            className="mb-2"
            name={item.name ? item.name : null}
            placeholder={item.placeholder ? item.placeholder : null}
            id={item.id ? item.id : null}
            component={DatePicker}
            minDate={this.state.minDate ? this.state.minDate : null}
            maxDate={this.state.maxDate ? this.state.maxDate : null}
            screen={this.props.type}
          />
          <div className="iconstyle form__form-group-icon">
            <CalendarBlankIcon />
          </div>
        </div>
        <div style={{ color: "#dc3545" }}>
          {item.message ? item.message : null}
        </div>
      </div>
    );
  }
  getRadio(i, item) {
    return (
      <div id={item.id} className="col-sm-6">
        <div key={i} className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>

          {item.options.map((option, ind) => {
            return <Field key={this.props.type + i + ind}
              name={item.name ? item.name : null}
              component={renderRadioButtonField}
              label={option.label}
              radioValue={option.value}
              disabled={false}
              defaultChecked={option.defaultChecked ? option.defaultChecked : null}
              validate={item.required ? radioRequired : null}
              showError={option.showError ? true : false}
            />
          })
          }
        </div >
      </div >
    )
  }
  getAutoComplete(i, item) {
    return (
      <div id={item.id} className="col-sm-6">
        <div className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <Field key={i}
            name={item.name ? item.name : null}
            component={AutoComplete}
            type={item.type}
            filterField={item.filterField}
            filterValue={item.filterValue}
            filterType={item.isNotEq}
            multiple={item.isMultiple}
            placeholder={item.placeholder ? item.placeholder : ''}
            searchApi={item.searchApi}
            searchField={item.searchField}
            // schoolName={this.state.schoolName}
            handleAutoCompleteData={(event) => this.handleAutoCompleteData(event, item.name)}
            // screen={this.props.type}
            // allow={this.state.allowDuplicates}
            filterFieldType={item.filterFieldType ? item.filterFieldType : null}
            disabled={item.disable ? item.disable : false}
          // formType={this.props.formType}
          />
        </div>
      </div>
    )
  }
  getTime(i, item) {
    return (
      <div id={item.id} className="col-sm-6">
        <div key={i} className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <Field key={i}
            name={item.name ? item.name : null}
            placeholder={item.placeholder ? item.placeholder : null}
            id={item.id ? item.id : null}
            component={TimePicker}
            screen={this.props.type}
          />
        </div>
        <div style={{ color: '#dc3545' }}>{item.message ? item.message : null}</div>
      </div>
    )
  }
  getItemField(i, item) {
    return item.type === "dropDown"
      ? this.getDropdown(i, item)
      : item.type === "date"
        ? this.getDates(i, item)
        : item.type === 'relateAutoComplete'
          ? this.getAutoComplete(i, item)
          : item.type === 'autoComplete'

            ? this.getAutoComplete(i, item)
            : item.type === 'time' ?
              this.getTime(i, item)
              : item.type === 'radio' ?
                this.getRadio(i, item)
                : this.getDefault(i, item);
  }
  getItemField1() {
    return this.props.newFormFields.map((item, i) => {
      return this.getItemField(i, item);
    });
  }

  // handle login user data
  handleUserData = async values => {
    await this.setState({
      isLoading: true
    });
    let recordId = this.props.recordId;
    let url = `${this.props.apiUrl}/${recordId}`;
    values.entityType = this.props.entityType;

    fetch("PUT", url, values).then(async response => {
      if (response && response.respCode && response.respMessage) {
        console.log("New values", response);
        showToasterMessage(response.respMessage, "success");
      } else if (response && response.errorMessage) {
        showToasterMessage(response.errorMessage, "error");
      }
      await this.setState({
        isLoading: false
      });
      await this.cancelReset("submit");
    });
  };
  submit = async values => {
    console.log(values);
    await this.handleUserData(values);
  };

  cancelReset = async type => {
    await this.props.reset();
    await this.props.cancelReset(type);
  };

  render() {
    const { handleSubmit, openNewUserModal } = this.props;

    return (
      <Modal
        isOpen={openNewUserModal}
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
          <p className="bold-text  modal__title"> {"User Details"} </p>
        </ModalHeader>
        <ModalBody className="p-2">
          <Loader loader={this.state.isLoading} />

          <form className="form" onSubmit={handleSubmit(this.submit)}>
            <div className="row mx-1 mt-3">
              {/* map function */}
              {this.getItemField1()}

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
    );
  }
}

NewUserModal = reduxForm({
  form: "NewUserModal", // a unique identifier for this form
  validate
})(NewUserModal);

NewUserModal = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(NewUserModal);

export default withTranslation("common")(NewUserModal);
