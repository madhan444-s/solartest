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
import CKEditor from 'ckeditor4-react';
import renderRadioButtonField from '../../../shared/components/form/RadioButton'
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
class SendEmailModal extends React.Component {
  constructor(props) {
    super(props);
    this.buttonActionType = null;
    this.state = {
      isLoginSuccess: false,
      isLoading: true,
      formFields: [{
        required: true,
        value: '',
        type: 'dropDown',
        name: 'email',
        label: 'To',
        id: 'email',
        placeholder: 'Email',
        options: [],
      },
      {
        required: true,
        value: '',
        type: 'text',
        name: 'subject',
        label: 'Subject',
        id: 'subject',
        placeholder: 'Subject'
      },
      // {
      //   required: true,
      //   value: '',
      //   type: 'radio',
      //   name: 'type',
      //   label: 'Type',
      //   id: 'type',
      //   options:[{label:"Custom",value:"Custom"},{label:"Templates",value:"Templates"}],
      //   placeholder: 'Type'
      // },
      {
        required: true,
        value: '',
        type: 'ckeditor',
        name: 'templateText',
        label: 'Body',
        id: 'emailTemplate',
        placeholder: 'name'
      }]
    };
  }

  componentDidMount() {
    // if (this.props.onRef) {
    //   this.props.onRef(null);
    // }
    this.setState({
      isLoading: false,
    });
    let options = [], formFields = this.state.formFields
    console.log("this.state.item", this.props.item)
    let item = this.props.item[0]
    for (let obj of this.props.parentFormFields) {
      if (obj.type == "email") {
        options.push({ label: obj.name, value: item[obj.name] })
      }
    }
    formFields[0].options = options
  }
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
            defaultValue={
              this.props.formType && this.props.formType === "add"
                ? item.defaultValue
                : null
            }
            placeholder={item.placeholder}
            isDisable={item.disable ? item.disable : false}
          />
        </div>
      </div>
    );
  }
  getCkEditor(i, item) {
    let self = this;
    return (
      <div id={item.id} className="col-sm-12">
        <div className="form__form-group">
          <label className="form__form-group-label">{item.label}</label>
          <CKEditor
            key={i}
            name={item.name}
            id={item.id}
            data={self.state[item.name] ? self.state[item.name] : null}
            onChange={this.onEditorChange}
          />
        </div>
      </div>
    )
  }
  onEditorChange = async (evt) => {
    this.setState({
      [evt.editor.name]: evt.editor.getData()
    });
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

  getItemField(i, item) {
    return item.type === "dropDown"
      ? this.getDropdown(i, item)
      : item.type === "date"
        ? this.getDates(i, item)
        : item.type === 'radio' ?
          this.getRadio(i, item)
          : item.type == "ckeditor" ?
            this.getCkEditor(i, item)
            : this.getDefault(i, item);
  }
  getItemField1 = () => {
    return this.state.formFields.map((item, i) => {
      return this.getItemField(i, item);
    });
  }

  // handle login user data
  handleUserData = async values => {
    await this.setState({
      isLoading: true
    });
    let url = `${this.props.apiUrl}/sendEmail`;
    fetch("PUT", url, values).then(async response => {
      if (response && response.respCode && response.respMessage) {
        showToasterMessage(response.respMessage, "success");
      } else if (response && response.errorMessage) {
        showToasterMessage(response.errorMessage, "error");
      }
      await this.setState({
        isLoading: false
      });
      await this.closeSendEmailModal("submit");
    });
  };
  submit = async values => {
    // console.log(values,this.state.templateText);
    values["templateText"] = this.state.templateText;
    await this.handleUserData(values);
  };

  closeSendEmailModal = async type => {
    await this.props.reset();
    await this.props.closeSendEmailModal(type);
  };

  render() {
    const { handleSubmit, openSendEmailModal } = this.props;

    return (
      <Modal
        isOpen={openSendEmailModal}
        toggle={this.closeSendEmailModal}
        centered
        className={`modal-dialog modal-dialog-centered modal-dialog--primary  modal-dialog--header`}
      >
        <ModalHeader className="modal__header">
          <button
            className="lnr lnr-cross modal__close-btn"
            type="button"
            onClick={this.closeSendEmailModal}
          />
          <p className="bold-text  modal__title"> {"Send Email"} </p>
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
                    onClick={this.closeSendEmailModal}
                  >
                    Cancel
                  </Button>

                  <Button color="primary" type="submit">
                    Send Email
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

SendEmailModal = reduxForm({
  form: "SendEmailModal", // a unique identifier for this form
  validate
})(SendEmailModal);

SendEmailModal = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(SendEmailModal);

export default withTranslation("common")(SendEmailModal);
