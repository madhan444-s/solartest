import React from 'react';
import {
  Button, Modal, ModalHeader, ModalBody,
  Card, CardBody, ButtonToolbar, ButtonGroup, Row, Col, Badge
} from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import classNames from 'classnames';
import Moment from 'moment';
import moment from 'moment'
import { load as loadAccount } from './../../redux/reducers/commonReducer';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes, { element } from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PaginatorComponent from '../Cruds/CommonDataTable/PaginatorComponent';

//components 
import AutoComplete from './components/AutoComplete';
import CalendarBlankIcon from 'mdi-react/CalendarBlankIcon';
import Select from '../../shared/components/form/Select';
import RadioButton from '../../shared/components/form/RadioButton';
import DefaultInput from '../../shared/components/form/DefaultInput';
import DefaultTextArea from '../../shared/components/form/DefaultTextArea';
import DatePicker from '../../shared/components/form/DatePicker';
import TimePicker from '../../shared/components/form/TimePicker';
import renderRadioButtonField from '../../shared/components/form/RadioButton';
import UserPasswordResetModal from '../Cruds/CommonModals/UserPasswordResetModal';
import { Dropdown } from 'primereact/dropdown';
import RenderFileInputField from '../Form/components/FileUpload';
import CKEditor from 'ckeditor4-react';

import config from '../../config/config';
import configMessages from '../../config/configMessages';
import apiCalls from '../../config/apiCalls';
import fetchMethodRequest from '../../config/service';
import DataTables from '../Cruds/CommonDataTable/DataTable';
// Toaster message
import showToasterMessage from '../UI/ToasterMessage/toasterMessage';
import EyeIcon from 'mdi-react/EyeIcon';
import dateFormats from '../UI/FormatDate/formatDate';
import validate from '../Validations/validate';

// Multi select Dropdown
import MultiSelectDropDown from './components/MultiSelect';

// Loader
import Loader from '../App/Loader';
// Calendar
//session expiry modal
import DeleteRowModal from '../Cruds/CommonModals/DeleteRowModal';
import SessionExpiryModal from '../Cruds/CommonModals/SessionexpiryModal'
//import TicketCommentsInfo from '../Tables/PrimeReactTable/Tickets/components/TicketCommentsInfo';
import { th } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Scrollbar from 'react-smooth-scrollbar';

const radioRequired = value => {
  let error = undefined;
  if (value || typeof value === 'string') {
    error = undefined
  } else {
    error = configMessages.fillRadio
  }
  return error
}
const required = value => (value || typeof value === 'string' ? undefined : configMessages.fillField);
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
class FormModal extends React.Component {
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
      formFields: [],
      formValues: {},
      colored: false,
      header: true,
      isLoading: false,
      filterCriteria: { limit: 10, page: 1, criteria: [], sortfield: 'created', direction: 'desc' },
      sessionExpiryModal: false,
      menuList: this.props.menuList ? this.props.menuList : [],
      defaultValue: true,
      roleOptions: [],
      slno: 0,
      userName: '',
      rowData: '',
      formType: this.props.formType,
      userData: '',
      displayBreadCrumbValue: this.props.displayBreadCrumbValue,
      displayBreadCrumbField: this.props.displayBreadCrumbField,
      originalTableFields: this.props.originalTableFields,
      userStatus: this.props.userStatus,
      openUserPasswordResetModal: false,
      actions: '',
      confirmType: '',
      confirmModalText: '',
      openDeleteModal: false,
      activitiesData: [],
      totalRecordsLength: 0,
      first: 0,
      rows: 10,
      showorHideLevelsField: false,
      showPassword: false
    };
  }

  componentDidMount = async () => {
    if (this.props.formType === 'add') {
      await this.props.reset();
      await this.props.load({})
    }
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    let sessionexpired = await localStorage.getItem('sessionexpired')
    if (sessionexpired === "true") {
      await this.setState({ sessionExpiryModal: true })
    }
    this.setState({
      formType: this.props.formType,
      displayBreadCrumbValue: this.props.displayBreadCrumbValue,
      displayBreadCrumbField: this.props.displayBreadCrumbField,
      userStatus: this.props.userStatus,
    })
    this.getFormFields();
    this.getActivities();
    if (this.props.addSelectedRecord) {
      setTimeout(() => {
        this.getFormFields();
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(null);
    }
  }

  onPageChange = async (event) => {
    let filterCriteria = this.state.filterCriteria;
    if (event && event.rows) {
      let currentPage = event.page + 1;
      filterCriteria['limit'] = event.rows;
      filterCriteria['page'] = currentPage;
      this.setState({
        rows: event.rows,
        page: event.page,
        first: event.first
      })
    }
    this.getActivities()
  }
  getTableFields = () => {
    let data = [
      {
        show: true,
        mobile: true,
        textAlign: 'center',
        width: 100,
        field: 'created',
        fieldType: 'Date',
        type: 'date',
        header: 'Created',
        filter: true,
        sortable: true,
        dateFormat: config.dateDayMonthFormat
      },
      {
        show: true,
        mobile: true,
        textAlign: 'center',
        width: 100,
        field: 'contextType',
        header: 'Context Type',
        filter: true,
        sortable: true
      },
      {
        show: true,
        mobile: true,
        textAlign: 'left',
        width: 250,
        fieldType: 'Array',
        field: 'description',
        header: 'Description',
        filter: true,
        sortable: true
      },
      // {
      //     textAlign: 'center',
      //     width: 100,
      //     field: 'ipAddress',
      //     header: 'Ip Address',
      //     filter: true,
      //     sortable: true
      // },
      // {
      //     textAlign: 'center',
      //     width: 100,
      //     field: 'deviceType',
      //     header: 'Device Type',
      //     filter: true,
      //     sortable: true
      // },
      // {
      //     textAlign: 'center',
      //     width: 100,
      //     field: 'browserName',
      //     header: 'Browser',
      //     filter: true,
      //     sortable: true
      // },
      // {
      //     textAlign: 'center',
      //     width: 100,
      //     field: 'osName',
      //     header: 'Os Name',
      //     filter: true,
      //     sortable: true
      // },
      // {
      //     textAlign: 'center',
      //     width: 100,
      //     field: 'osVersion',
      //     header: 'Os Version',
      //     filter: true,
      //     sortable: true
      // },


    ];
    return data;
  };
  getPaginator() {
    return (
      <PaginatorComponent
        totalRecords={this.state.totalRecordsLength}
        first={this.state.first}
        rows={this.state.rows}
        onPageChange={this.onPageChange}
        isWeb={true}
      />
    )
  }
  getActivities = async () => {
    let filterCriteria = this.state.filterCriteria;
    filterCriteria['criteria'] = [{ key: 'contextId', value: this.state.editRowDataID, type: 'eq' }]
    let url = `activities?filter=${JSON.stringify(filterCriteria)}`
    return fetchMethodRequest('GET', url).then(async (response) => {
      if (response) {
        let responseData = '', totalRecordsLength = this.state.totalRecordsLength;
        if (response && response['activities'] && response['activities'].length && response['activities'].length >= 0) {
          if (response.pagination && response.pagination.totalCount) {
            totalRecordsLength = response.pagination.totalCount;
          }
          responseData = this.updateDateFormat(response['activities'], this.state.dateFormat);
        } else {
          if (response.pagination && (response.pagination.totalCount || response.pagination.totalCount == 0)) {
            totalRecordsLength = response.pagination.totalCount;
          }
        }
        await this.setState({
          activitiesData: responseData,
          totalRecordsLength: totalRecordsLength,
          filterCriteria: filterCriteria
        })
      }
    }).catch((err) => {
      return err
    })
  }

  getTableFieldItem = async (field) => {
    for (let i = 0; i < this.props.tablefieldsToShow.length; i++) {
      if (this.props.tablefieldsToShow[i].field == field) {
        return this.props.tablefieldsToShow[i];
      }
    }
    return null;
  }
  getFormFields = async () => {
    if (this.props.formFields) {
      let formFields = await this.props.formFields();
      await this.setState({ formFields: formFields, });
    }
  }

  getFormFieldItem = async (key) => {
    let formFields = await this.props.formFields();
    for (let i = 0; i < formFields.length; i++) {
      if (formFields[i].name === key) {
        return formFields[i];
      }
    }
    return null;
  }
  //close delete modal
  closeDeleteModal = async () => {
    this.setState({
      openDeleteModal: false,
      actions: ''
    })
  }
  handleNextAndBackActions = async () => {
    let { allUsersData } = this.props;
    let { slno } = this.state;
    let data = '';
    data = allUsersData[slno];
    if (this.state.formType === 'view') {
      await this.setState({
        editRowDataID: data['_id']
      })
      await this.handleViewDisplay(data, 'view');

    } else {
      await this.getRowData(data, 'edit')
    }
    await this.setState({
      filterCriteria: { limit: 10, page: 1, criteria: [], sortfield: 'created', direction: 'desc' },
      first: 0,
      rows: 10,
      totalRecordsLength: 0,
    })
    await this.getActivities();
  }

  getViewData = async (rowData, type, rowDataIndex, userData, _id) => {
    await this.setState({
      rowData: rowData,
      editRowDataID: _id,
      formType: type,
      slno: rowDataIndex,
      userData: userData
    });
  };
  getIconValue(rowData, labelKey) {
    if (labelKey && labelKey.options && labelKey.options.length > 0) {
      for (let i = 0; i < labelKey.options.length; i++) {
        if (labelKey.options[i].value === rowData[labelKey.field]) {
          return labelKey.options[i].displayText;
        }
      }
    }
    return '';
  }
  handleViewDisplay = async (rowData, type) => {
    await this.props.getDataFromServer(this.props.filterCriteria)
    let _id = rowData['_id'];
    let rowDataIndex = this.getUserData(rowData['_id'])
    let keys = Object.keys(rowData);
    let formFields = [];
    if (formFields) {
      if (this.props.type) {
        if (rowData) {
          let values, fieldType, searchField, self = this, icon = false;

          // hari get all the labels from 
          keys.forEach(async function (key) {
            let labelKey = await self.getTableFieldItem(key);
            if (labelKey == null) {
              labelKey = key;
            } else {
              let val = rowData[key];
              if (labelKey.fieldType === 'icon') {
                val = self.getIconValue(rowData, labelKey);
                icon = true;
              }
              fieldType = labelKey.fieldType ? labelKey.fieldType : null
              searchField = labelKey.searchField ? labelKey.searchField : null
              let options = labelKey.options ? labelKey.options : []
              labelKey = labelKey.header
              if (val) {
                if (fieldType && searchField && fieldType == "relateAutoComplete") {
                  values = {
                    label: labelKey,
                    value: icon ? val : rowData[key][searchField],
                    fieldType: fieldType
                  }
                } else {
                  values = {
                    label: labelKey,
                    value: icon ? val : rowData[key],
                    fieldType: fieldType,
                    options: options
                  }
                }
                formFields.push(values);
                icon = false;
              }
            }
            // if (key == 'fromTime' || key == 'toTime') {
            //   let date = dateFormats.addDaysToDate(rowData[key], 1);
            //   date = dateFormats.formatDate(date, config.timeFormat);
            //   values = {
            //     label: key,
            //     value: date
            //   }
            //   formFields.push(values);
            // }
          });
        }
      }

      await this.setState({
        formType: 'view',
        userData: rowData,
        displayBreadCrumbValue: rowData[this.state.displayBreadCrumbField],
        userStatus: rowData['status']
      });
      await this.getViewData(formFields, 'view', rowDataIndex, rowData, _id);
    }
  }
  getUserData(_id) {
    let data = this.props.allUsersData;
    for (let i = 0; i < data.length; i++) {
      if (data[i]['_id'] === _id) {
        return i
      }
    }
  }
  updateDateFormat(itemdata, dateFormat) {
    let modifiedData = [];
    let tablefieldsToShow = this.getTableFields();
    for (let i = 0; i < itemdata.length; i++) {
      for (let k = 0; k < tablefieldsToShow.length; k++) {
        if ("Date" == tablefieldsToShow[k]['fieldType']) {
          itemdata[i][tablefieldsToShow[k]['field']] =
            dateFormats.formatDate(
              itemdata[i][tablefieldsToShow[k]['field']],
              tablefieldsToShow[k]['dateFormat']);
        }
      }
      modifiedData.push(itemdata[i])
    }
    return modifiedData;
  }
  //Get From Fields data on Edit
  getRowData = async (selectedRowInfo, type) => {
    let keys = Object.keys(selectedRowInfo);
    for (let i = 0; i < keys.length; i++) {
      let fieldItem = await this.getFormFieldItem(keys[i]);
      if (fieldItem) {
        if ((fieldItem.type === 'multipleprofile' || fieldItem.type === 'ckeditor' || fieldItem.type === 'profile') && selectedRowInfo[fieldItem.name]) {
          this.setState({
            [fieldItem.name]: selectedRowInfo[fieldItem.name]
          })
        }
        if (fieldItem.type === 'dropDown' && fieldItem.isMultiSelect) {
          selectedRowInfo[fieldItem.name] = selectedRowInfo[fieldItem.name]
        } else if (fieldItem.type === 'dropDown' && fieldItem.dependent && fieldItem.dependent.length > 0) {
          let formFields = this.state.formFields;
          if (fieldItem.dependent && fieldItem.dependent.length > 0) {
            for (let i = 0; i < fieldItem.dependent.length; i++) {
              if (selectedRowInfo && selectedRowInfo[fieldItem.name] === Object.keys(fieldItem.dependent[i])[0]) {
                if (fieldItem.dependent[i][Object.keys(fieldItem.dependent[i])[0]] && fieldItem.dependent[i][Object.keys(fieldItem.dependent[i])[0]].length > 0) {
                  formFields = await this.showField(formFields, fieldItem.dependent[i][Object.keys(fieldItem.dependent[i])[0]], true);
                }
              }
            }

            await this.setState({ formFields: formFields });
          }
        }
      }
    }
    if (this.props.type && this.props.type == "Roles" && selectedRowInfo.roleType && selectedRowInfo.roleType == "Manager") {
      this.setState({ showorHideLevelsField: true })
    }

    if (selectedRowInfo['permissions']) {
      let permissionsArray = []
      let permissions = selectedRowInfo['permissions']
      if (permissions) {
        let keys = Object.keys(permissions);
        keys.forEach((element) => {
          if (element) {
            selectedRowInfo[element] = permissions[element];
            let permissonObj = {
              title: element,
            }
            if (type === 'edit') {
              if (selectedRowInfo[element] === 'Edit') {
                permissonObj.Edit = false;
              } else if (selectedRowInfo[element] === 'View') {
                permissonObj.View = false;
              } else if (selectedRowInfo[element] === 'NoView') {
                permissonObj.NoView = false;
              }
            } else {
              if (selectedRowInfo[element] === 'Edit' || selectedRowInfo[element] === 'View') {
                selectedRowInfo[element] = 'NoView';
                permissonObj.NoView = false;
              }
            }
            permissionsArray.push(permissonObj);
          }
        });
      }
      await this.setState({
        menuList: permissionsArray
      })
    }
    if (this.props.load) {
      this.props.load(selectedRowInfo);
    }
    this.setState({
      isLoading: false,
      editRowDataID: selectedRowInfo._id,
      displayBreadCrumbValue: selectedRowInfo[this.state.displayBreadCrumbField],
      formType: type,
      userData: selectedRowInfo
    });
  }

  closeFormModal = async () => {
    this.clearFormFields();
    this.props.reset();
    this.props.getDataFromServer(this.props.filterCriteria);
    this.props.closeFormModal();
  }

  flattenArray = (arrayVal) => {
    let val = '';
    if (arrayVal) {
      val = JSON.stringify(arrayVal);
      val = val.replace(/"/g, '')
        .replace(/\[/g, '')
        .replace(/]|\\/g, '')
        .replace(/{/g, '')
        .replace(/}/g, '')
        .replace(/,/g, ' , ')
        .replace(/:/g, ' : ');
    }
    return val;
  }
  getActivtiesTableFieldItem = (field) => {
    let tablefieldsToShow = this.getTableFields()
    for (let i = 0; i < tablefieldsToShow.length; i++) {
      if (tablefieldsToShow[i].field == field) {
        return tablefieldsToShow[i];
      }
    }
    return null;
  }
  // hari need to move to derived class or controller
  changeFieldValues = (item, column) => {
    let self = this, tableItem;
    tableItem = self.getActivtiesTableFieldItem(column.field);
    if (tableItem.fieldType === "Array") {
      let val = this.flattenArray(item[column.field]);
      return <span style={tableItem.style} title={val}>
        {val}
      </span>
    } else {
      // if (item[column.field] === 0) {
      //   return item[column.field];
      // }
      if ((item[column.field]) && typeof item[column.field] !== 'object') {
        return item[column.field];
      }
    }
  }
  // changeFieldValues = async (item, column) => {
  //   let self = this, tableItem;
  //   tableItem = self.getActivtiesTableFieldItem(column.field);
  //   if (tableItem.fieldType === "Array") {
  //     let val = self.flattenArray(item[column.field]);
  //     return <span style={tableItem.style} title={val}>
  //       {val}
  //     </span>
  //   } else {
  //     // if (item[column.field] === 0) {
  //     //   return item[column.field];
  //     // }
  //     if ((item[column.field]) && typeof item[column.field] !== 'object') {
  //       return item[column.field];
  //     }
  //   }
  // }
  // form Submit
  submit = (values) => {
    if (values && Object.keys(values).length > 0) {
      this.saveDataToServer(values);
    } else {
      return;
    }
  }

  clearFormFields = async () => {
    if (this.props.load) {
      this.props.load({});
    }
    let formData = [...this.state.formFields];
    formData.forEach((item) => {
      item.value = '';
      item.invalid = false;
      item.message = ''
    });
    await this.setState({
      formFields: formData
    })
    this.getFormFields();
  }

  onEditorChange = async (evt) => {
    this.setState({
      [evt.editor.name]: evt.editor.getData()
    });
  }
  ObjectbyString = (o, s) => {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
  //send data to server
  saveDataToServer = async (formValues) => {
    let userBody = Object.assign({}, formValues);
    let validationExists;
    this.setState({
      isLoading: true
    });
    if (!validationExists) {
      if (formValues) {
        let method, apiUrl;
        if (this.state.formType === 'edit') {
          delete userBody.email
          delete userBody.password;
          method = 'PUT';
          apiUrl = `${this.props.apiUrl}/${this.state.editRowDataID}`;
        } else if (this.state.formType === 'view') {
          delete userBody.email
          delete userBody.password;
          method = 'PUT';
          apiUrl = `${this.props.apiUrl}/${this.state.editRowDataID}`;
        } else {
          method = 'POST';
          apiUrl = this.props.apiUrl;
        }

        for (let i = 0; i < this.state.formFields.length > 0; i++) {
          if (this.state.formFields[i].show === false)
            continue;
          if (this.state.formFields[i].type === 'autoComplete') {
            if (this.state.formFields[i]["options"] && this.state.formFields[i]["options"].length > 0) {
              for (let j = 0; j < this.state.formFields[i]["options"].length; j++) {
                let keys = Object.keys(this.state.formFields[i]["options"][j])
                let values = Object.values(this.state.formFields[i]["options"][j]);
                if (keys && keys[0] && values && values[0] && formValues[this.state.formFields[i]["name"]][values[0]]) {
                  userBody[keys[0]] = formValues[this.state.formFields[i]["name"]][values[0]]
                }
              }
            }
          }
          if (this.state.formFields[i].type === 'multipleprofile' || this.state.formFields[i].type === 'ckeditor' || this.state.formFields[i].type === 'profile') {
            userBody[this.state.formFields[i].name] = this.state[this.state.formFields[i].name];
          }
          if (this.state.formFields[i].type === 'permission') {
            let permissions = {};
            let keys = Object.keys(formValues);
            this.state.menuList.forEach((item, index) => {
              keys.forEach((key) => {
                if (item.title === key) {
                  permissions[item.title] = formValues[key]
                }
              })
            })
            userBody.permissions = { ...permissions }
          }
        }

        return fetchMethodRequest(method, apiUrl, userBody)
          .then(async (response) => {
            let sessionexpired = await localStorage.getItem('sessionexpired')
            if (sessionexpired === "true") {
              await this.setState({ sessionExpiryModal: true })
            }
            if (response && response.respCode) {
              await this.props.getDataFromServer(this.props.filterCriteria);
              showToasterMessage(response.respMessage, 'success');
              if (this.props.displayViewOfForm === 'modal') {
                this.props.closeFormModal('save', response.quantityId);
              } else {
                if (this.state.formType !== 'add') {
                  await this.setState({
                    formType: 'view'
                  })
                  await this.handleNextAndBackActions();
                } else {
                  this.props.closeFormModal('save', response.quantityId);
                }

              }
              this.clearFormFields();
              this.props.reset();
            } else if (response && response.errorMessage) {
              showToasterMessage(response.errorMessage, 'error');
            }
            this.setState({
              isLoading: false
            });
          }).catch((err) => {
            return err;
          });
      } else {
        return;
      }
    }
  }

  //getStores
  getRecords = (valve, key, apiUrl, name) => {
    let filterCriteria = {}
    filterCriteria['criteria'] = [{ key: key, value: valve, type: 'eq' }];
    let url = `${apiUrl}?filter=${JSON.stringify(filterCriteria)}`
    fetchMethodRequest('GET', url).then(async (response) => {
      if (response) {
        let states = response[apiUrl];
        let roleOptions = [];
        if (states && states.length > 0) {
          for (let i = 0; i < states.length; i++) {
            roleOptions.push({ label: states[i][name], value: states[i][name] })
          }
          await this.setState({
            roleOptions: roleOptions
          })
        } else {
          await this.setState({
            roleOptions: []
          })
        }
      }
    }).catch((err) => {
      return err
    })
  }

  // //Handle auto complete data
  handleAutoCompleteData = async (value, name) => {

  }

  getDropdownMultiselect(i, item) {
    return (
      <div className="form__form-group-field mb-2">
        <Field key={i}
          name={item.name}
          component={MultiSelectDropDown}
          id={item.id}
          validate={[required]}
          filterElement={this.state.roleOptions && this.state.roleOptions.length > 0 ? this.state.roleOptions : item.options ? item.options : null}
          maxSelectedLabels={this.state.maxSelectedLabels ? this.state.maxSelectedLabels : null}
        />
      </div>
    )
  }

  async handleFnEnableControlsBasedOnValue2(e, dependent) {
    let formFields = this.state.formFields;
    if (dependent && dependent.length > 0) {
      for (let i = 0; i < dependent.length; i++) {
        if (e && e === Object.keys(dependent[i])[0]) {
        }
        else {
          if (dependent[i][Object.keys(dependent[i])[0]] && dependent[i][Object.keys(dependent[i])[0]].length > 0) {
            formFields = await this.showField(formFields, dependent[i][Object.keys(dependent[i])[0]], false)
          }
        }
      }
      for (let i = 0; i < dependent.length; i++) {
        if (e && e === Object.keys(dependent[i])[0]) {
          if (dependent[i][Object.keys(dependent[i])[0]] && dependent[i][Object.keys(dependent[i])[0]].length > 0) {
            formFields = await this.showField(formFields, dependent[i][Object.keys(dependent[i])[0]], true);
          }
        }
      }
      await this.setState({ formFields: formFields });
    }
  }
  async handleFnEnableControlsBasedOnValue(e, dependent) {
    if (e && e == "Manager") {
      this.setState({ showorHideLevelsField: true })
    } else {
      this.setState({ showorHideLevelsField: false })
    }
  }

  getDropdown(i, item) {
    return (
      <div className="form__form-group-field mb-2">
        <Field key={i}
          name={item.name}
          component={Select}
          options={item.options}
          onChange={this.props.type && this.props.type == "Roles" ? (e) => this.handleFnEnableControlsBasedOnValue(e, item.dependent) : (e) => this.handleFnEnableControlsBasedOnValue2(e, item.dependent)}
          defaultValue={this.props.formType && this.props.formType === 'add' ? item.defaultValue : null}
          placeholder={item.placeholder}
          isDisable={item.disable ? item.disable : false}
          getCategoryProductType={this.getCategoryProductType}
          updateClinicName={this.updateClinicName}
          updateDistributorName={this.updateDistributorName}
          getProjectDropDownValues={this.getProjectDropDownValues}
        />
      </div>
    )
  }

  showField(formFields, itemNames, show = true) {
    let value = true;
    if (show === false)
      value = show;

    for (let i = 0; i < formFields.length; i++) {
      for (let itemName of itemNames) {
        if (formFields[i].name === itemName) {
          formFields[i].show = value;
          //await this.setState({ formFields: formFields });  
          // break;
        }
      }
    }
    return formFields;
  }

  getRolePermissions() {
    return (
      <div className="form form--horizontal">
        <div className="form__form-group row">
          <div className='col-sm-6' style={{ paddingLeft: '119px' }}>
            <span className='pr-4 pl-5'>{'Edit'}</span>
            <span className='pr-3 pl-2'>{'View'}</span>
            <span className='pr-2 '>{'No View'}</span>
          </div>
          <div className='col-sm-6' style={{ paddingLeft: '119px' }}>
            <span className='pr-4 pl-5'>{'Edit'}</span>
            <span className='pr-3 pl-2'>{'View'}</span>
            <span className='pr-2 '>{'No View'}</span>
          </div>
        </div>

        {this.state.menuList && this.state.menuList.length > 0 ?
          this.state.menuList.map((item, index) => {
            return <div key={index} className="form__form-group col-sm-6">
              <span className="form__form-group-label ">{item.title}</span>
              <div className="form__form-group-field ">
                <Field
                  name={item.title}
                  component={renderRadioButtonField}
                  radioValue={!item.Edit ? 'Edit' : ''} />
                <Field
                  name={item.title}
                  component={renderRadioButtonField}
                  radioValue={!item.View ? 'View' : ''}
                // defaultChecked={this.state.defaultValue && index === 0 ? true : false}
                />
                <Field
                  name={item.title}
                  component={renderRadioButtonField}
                  radioValue={!item.NoView ? 'NoView' : ''}
                // defaultChecked={this.state.defaultValue && index > 0 ? true : false}
                />
              </div>
            </div>
          }) : null
        }
      </div>
    );
  }

  getProfile(i, item) {
    return (
      <div key={i}>
        <Field key={i}
          onRef={(ref) => (this.profileUploadRef = ref)}
          name={item.name ? item.name : null}
          component={RenderFileInputField}
          label={item.label}
          type='profile'
          id={item.id}
          acceptType="image/*"
          url={`uploads?uploadWhileCreate=true&uploadPath=${item.imagePath}`}
          getFileName={(file) => this.getFileName(file, item)}
          imagePath={item.imagePath}
        />
        <div className='col-md-2' style={{ padding: '20px' }}>
          <div style={{ justifyContent: 'center' }}>
            {(this.state[item.name]) ?
              <img
                src={`${config.imgUrl}${item.imagePath}/${this.state[item.name]}`}
                className='detailsImgStyle' />
              : null
            }
          </div>
        </div>
      </div>
    )
  }

  getFileName = async (file, item) => {
    let image = file;
    await this.setState({
      [item.name]: image
    });
  }

  getDate(i, item) {
    return (
      <div key={i} className="form__form-group">
        <div className="form__form-group-field mb-2">
          <Field key={i}
            className='mb-2'
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
        <div style={{ color: '#dc3545' }}>{item.message ? item.message : null}</div>
      </div>
    )
  }

  getTime(i, item) {
    return (
      <div key={i} className="form__form-group">
        <div className="form__form-group-field">
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

  getCkEditor(i, item) {
    let self = this;
    return (
      <CKEditor
        key={i}
        name={item.name}
        id={item.id}
        data={self.state[item.name] ? self.state[item.name] : null}
        onChange={this.onEditorChange}
      />
    )
  }

  getRadio(i, item) {
    return (
      <div className='mb-0 ml-3'>
        <div className='row'>
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
        schoolName={this.state.schoolName}
        handleAutoCompleteData={(event) => this.handleAutoCompleteData(event, item.name)}
        screen={this.props.type}
        allow={this.state.allowDuplicates}
        filterFieldType={item.filterFieldType ? item.filterFieldType : null}
        disabled={item.disable ? item.disable : false}
        formType={this.props.formType}
      />
    )
  }

  getTextArea(i, item) {
    return (
      <Field key={i}
        name={item.name ? item.name : null}
        component={DefaultTextArea}
        type={item.type ? item.type : null}
        placeholder={item.placeholder ? item.placeholder : null}
        validate={!this.state.isTaskSet && item.name === 'otherTask' ? [required] : null}
      />
    )
  }

  getButtonGroup(i, item) {
    return (
      <ButtonToolbar className='mt-0'>
        <ButtonGroup size="sm" >
          {item.options.map((button) => {
            return <Button style={{ paddingTop: 3, paddingBottom: 3 }}
              color="primary"
              outline size="sm"
              active={this.state[`is${button.label}ReOrder`]}
              onClick={() => this.handleReOrdering(button.value)}>{button.label}</Button>
          })
          }
        </ButtonGroup>
      </ButtonToolbar>
    )
  }

  getDefault(i, item) {
    const { t } = this.props;
    return (
      <div>
        <Field key={i}
          name={item.name ? item.name : null}
          component={DefaultInput}
          isDisable={(this.props.formType && this.props.formType === 'edit' && (item.type === "email" || item.type === "password")) ? true : item.disable}
          type={item.type ? item.type : "text"}
          id={item.id ? item.id : null}
          placeholder={item.placeholder ? t(item.placeholder) : null}
          validate={item.required ? [required] : null}
          normalize={item.formatType === 'US' ? normalizePhone : null}
        />
      </div>
    )
  }

  getPassword(i, item) {
    const { t } = this.props;
    return (
      <div class='row'>
        <Field key={i}
          name={item.name ? item.name : null}
          component={DefaultInput}
          isDisable={(this.props.formType && this.props.formType === 'edit' && (item.type === "password")) ? true : item.disable}
          type={this.state.showPassword ? 'text' : "password"}
          id={item.id ? item.id : null}
          placeholder={item.placeholder ? t(item.placeholder) : null}
          validate={[required]}
          normalize={item.formatType === 'US' ? normalizePhone : null}
        />
        <button
          type="button"
          className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
          onClick={e => this.showPassword(e)}
        ><EyeIcon />
        </button>
      </  div>
    )
  }
  showPassword = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  }


  getButtonToolbar() {
    const { t } = this.props;
    return (
      <div className='d-flex'>
        <div className='col-12 px-0'>
          <span className='float-right'>
            <ButtonToolbar>
              {this.props.displayViewOfForm === 'modal' && this.state.formType === 'add' ? <Button color='primary' type="button" onClick={() => this.closeFormModal()}>
                {t('Back') ? t('Back') : 'Back'}
              </Button> : this.state.formType !== 'add' ? <Button color='primary' type="button" onClick={() => this.setState({ formType: 'view' })}>
                {t('Back') ? t('Back') : 'Back'}
              </Button> : this.state.formType === 'add' ? <Button color='primary' type="button" onClick={() => this.closeFormModal()}>
                {t('Back') ? t('Back') : 'Back'}
              </Button> : null}
              <Button color='primary' outline type="submit">
                {this.state.formType && this.state.formType === 'add' ?
                  t('Save') ? t('Save') : 'Save'
                  : t('Update') ? t('Update') : 'Update'
                }
              </Button>
            </ButtonToolbar>
          </span>
        </div>
      </div>
    )
  }
  getEditButton() {
    const { t } = this.props;
    return (
      <div className='d-flex'>
        <div className='col-12 px-0'>
          <span className='float-right'>
            <a href={`/edit_${this.props.routeTo}/${JSON.stringify(this.state.userData._id)}`} >
              <ButtonToolbar>
                <Button color='primary' outline type="submit"
                // onClick={() =>   
                // this.getRowData(this.state.userData, 'edit')
                // }
                >
                  {
                    t('Edit') ? t('Edit') : 'Edit'
                  }
                </Button>
              </ButtonToolbar>
            </a>
          </span>
        </div>
      </div>
    )
  }
  getModalHeader() {
    const { t } = this.props;
    return (
      <ModalHeader className="modal__header">
        <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.closeFormModal} />
        <p className="bold-text  modal__title">
          {this.state.formType &&
            this.state.formType === 'edit' ?
            t('Edit') ? t('Edit') : 'Edit' :
            this.state.formType &&
              this.state.formType === 'view' ?
              t('View') ? t('View') : 'View' : t('Add') ? t('Add') : 'Add'
          }{' '}
          {this.props.type ? this.props.type : null}
        </p>
      </ModalHeader>
    )
  }

  getDependentFields(type, formType) {
    return null;
  }

  getMultiplePhotoUpload(i, item) {
    return (
      <div>
        <Field key={i}
          onRef={(ref) => (this.profileUploadRef = ref)}
          name={item.name ? item.name : null}
          component={RenderFileInputField}
          label={item.label}
          type='profile'
          id={'photo'}
          acceptType={'image/*'}
          url={apiCalls.LocationImagePath}
          getMulipleFileName={(file) => this.getMulipleFileName(file, item)}
          multiple={true}
        />
        <Scrollbar>
          <div className='mindivForMultipleupload' >
            {this.state[item.name] && this.state[item.name].length > 0 ? this.state[item.name].map((imagLocationItem, imagLocationIndex) => (<div className='col-md-2' style={{ padding: '20px' }}>
              <div key={imagLocationIndex} style={{ justifyContent: 'center' }}>
                <img
                  key={imagLocationIndex}
                  src={`${config.imgUrl}${item.imagePath}/${imagLocationItem['file']}`}
                  className='detailsImgStyle' />
                <FontAwesomeIcon icon='times-circle' className='timesCircleIcon'
                  onClick={() => this.removeMultipleUploadedImages(imagLocationIndex, item)}
                />
              </div>
            </div>)) : null
            }
          </div>
        </Scrollbar>
      </div>
    )
  }
  getDeleteRowModal() {
    return (
      <DeleteRowModal
        openDeleteModal={this.state.openDeleteModal}
        closeDeleteModal={this.closeDeleteModal}
        selectActions={this.state.selectActions}
        deleteSelectedRow={this.handleActions}
        confirmModalText={this.state.confirmModalText}
      />
    )
  }
  // Store selected Images in state
  getMulipleFileName = async (file, item) => {
    let multipleLocationImage = this.state[item.name];
    multipleLocationImage.push({ "file": file })
    await this.setState({
      [item.name]: multipleLocationImage
    });
  }

  // Remove selected image from state
  removeMultipleUploadedImages = async (imagLocationIndex, item) => {
    let multipleLocationImage = this.state[item.name];
    multipleLocationImage.splice(imagLocationIndex, 1);
    await this.setState({
      [item.name]: multipleLocationImage
    })
  }

  getItemField(item, i) {
    const { t } = this.props;
    return (
      <div id={item.name} key={this.props.type + i}
        className={(item.isAddFormHidden && this.state.formType === 'add') ? 'd-none' :
          item.name == "levels" && this.props.type == "Roles" && !this.state.showorHideLevelsField ? 'd-none' :
            (item.isEditFormHidden && this.state.formType === 'edit') ? 'd-none' : (item.type === 'ckeditor' || item.type === 'permission' || item.type === 'multipleprofile' ? 'col-sm-12' : (
              (item.type === 'autoComplete' && item.name === 'assignedTo') ||
                item.name === 'closebutton' ? 'col-sm-4' : 'col-sm-6'))}
      >
        <div className="form__form-group mb-3 ml-1" >
          <label className="form__form-group-label">
            {t(item.label)}
          </label>
          {item.type === 'dropDown' && item.isMultiSelect ?
            this.getDropdownMultiselect(i, item)
            : item.type === 'dropDown' ?
              this.getDropdown(i, item)
              : item.name === 'closebutton' ?
                this.getCloseButton(i, item)
                : item.type === 'profile' ?
                  this.getProfile(i, item)
                  : item.type === 'date' ?
                    this.getDate(i, item)
                    : item.type === 'time' ?
                      this.getTime(i, item)
                      : item.type === 'ckeditor' ?
                        this.getCkEditor(i, item)
                        : item.type === 'empty' ?
                          <div> </div>
                          : item.type === 'radio' ?
                            this.getRadio(i, item)
                            : item.type === 'permission' ?
                              this.getRolePermissions()
                              : item.type === 'autoComplete' ?
                                this.getAutoComplete(i, item)
                                : item.type === 'relateAutoComplete' ?
                                  this.getAutoComplete(i, item)
                                  : item.type === 'textarea' ?
                                    this.getTextArea(i, item)
                                    : item.type === 'buttonGroup' ?
                                      item.options && item.options.length > 0 ? this.getButtonGroup(i, item) : null
                                      : item.type === 'multipleprofile' ?
                                        this.getMultiplePhotoUpload(i, item) :
                                        item.type == "password" ?
                                          this.getPassword(i, item)
                                          : this.getDefault(i, item)

          }
        </div>
      </div>

    )
  }

  getFields() {
    let allFields = <div></div>
    let item;
    for (let i = 0; i < this.state.formFields.length; i++) {
      item = this.state.formFields[i];
      if (item.show === false || (item.isAddFormHidden === true && this.state.formType === 'add') || (item.isEditFormHidden === true && this.state.formType === 'edit')) {

      } else {
        allFields = <>{allFields}{this.getItemField(item, i)}</>
      }
    }
    return allFields;
  }
  setSlno = async (actionType) => {
    const { totalRecords, first, rows, onPageChange, isWeb } = this.props;
    let slno = this.state.slno;
    if (actionType === 'back') {
      if (slno !== 0) {
        await this.setState({ slno: slno - 1 })
        this.handleNextAndBackActions(actionType)
      } else {
        await this.setState({ slno: slno + 1 })
      }
    } else if (actionType === 'next') {
      let total = '';
      total = this.props.allUsersData.length
      if (slno !== total) {
        await this.setState({ slno: slno + 1 })
        this.handleNextAndBackActions(actionType)
      } else {
        await this.setState({ slno: slno })
      }
    }
  }
  getPaginationWithIcons() {
    const { totalRecords, first, rows, onPageChange, isWeb } = this.props;
    const { slno } = this.state;
    return (
      <Row>
        <Col sm={12} className='pb-2 text-right'>
          <span className='showingNumber'>
            {slno === 0 ? 1 : slno + 1} / {this.props.allUsersData.length}&nbsp;&nbsp;
          </span>
          <span>
            <ButtonGroup className='mb-0'>
              <Button color="primary"
                outline
                disabled={slno === 0 ? true : false}
                size="sm"
                className="p-1 ml-auto mt-1 mb-0"
                onClick={() => this.setSlno('back')}
              >
                <FontAwesomeIcon
                  icon='chevron-left'
                  className='pl-1' size='lg'
                  data-toggle="tool-tip" title="List"

                />
              </Button>
              <Button color="primary"
                outline
                disabled={slno === this.props.allUsersData.length - 1 ? true : false}
                size="sm"
                className="p-1 ml-auto mt-1 mb-0"
                onClick={() => this.setSlno('next')}
              >
                <FontAwesomeIcon
                  icon='chevron-right'
                  className='pl-1' size='lg'
                  data-toggle="tool-tip" title="List"

                />
              </Button>
            </ButtonGroup>
          </span>
        </Col>
      </Row>
    )
  }

  //getModalBody
  getModalBody(handleSubmit) {
    return (
      <ModalBody className="modal__body mb-0 ">
        <Card className='pb-0 cardForListMargin'>
          <CardBody className='tableCardBody'>
            <form key={this.props.type} onSubmit={handleSubmit(this.submit)} autoComplete={'off'}>
              <Loader loader={this.state.isLoading} />
              <div className="row form" >
                {this.getFields()}
                {this.state.sessionExpiryModal ?
                  <SessionExpiryModal
                    SOpen={this.state.sessionExpiryModal}
                  />
                  : null
                }
                {this.props.getDependentFields && this.props.getDependentFields(this.props.type, this.props.formType)}
              </div>
              {this.getButtonToolbar()}
            </form>
          </CardBody>
        </Card>
      </ModalBody>
    )
  }

  //getScreenBody
  getScreenBody(handleSubmit) {
    return (
      <form key={this.props.type} onSubmit={handleSubmit(this.submit)} autoComplete={'off'}>
        <Loader loader={this.state.isLoading} />
        <div className={this.props.formType === 'add' ? "row form pt-3" : "row form "}>
          {this.getFields()}
          {this.state.sessionExpiryModal ?
            <SessionExpiryModal
              SOpen={this.state.sessionExpiryModal}
            />
            : null
          }
          {this.props.getDependentFields && this.props.getDependentFields(this.props.type, this.props.formType)}
        </div>
        {this.getButtonToolbar()}
      </form>
    )
  }

  //getModalView
  getModalView() {
    const { handleSubmit } = this.props;
    const modalClass = classNames({
      'modal-dialog--colored': this.state.colored,
      'modal-dialog--header': this.state.header,
    });
    return (
      <Modal
        isOpen={this.props.openFormModal}
        className={`modal-dialog-centered modal-dialog--primary  ${modalClass}`}
      >
        {this.getModalHeader()}
        {this.state.formType === 'view' ?
          <ModalBody className="modal__body mb-0 pt-1">
            <Card className='pb-0 cardForListMargin'>
              <CardBody className='tableCardBody'>
                {this.getViewBody()}
                {this.getEditButton()}
              </CardBody>
            </Card>
          </ModalBody> : this.getModalBody(handleSubmit)}
      </Modal>
    )
  }
  cancelUserPwdResetModal = async () => {
    await this.setState({
      openUserPasswordResetModal: false,
      actions: ''
    })
  }
  getUserPasswordResetModal = () => {
    return (
      <UserPasswordResetModal
        openUserPasswordResetModal={this.state.openUserPasswordResetModal}
        userId={this.state.editRowDataID}
        cancelReset={this.cancelUserPwdResetModal}
        entityType={this.props.entityType}
      />
    )
  }
  getHeader() {
    const { t } = this.props;
    return (
      <div className='d-flex'>
        <div className='col-12 px-0 pb-1'>
          <span className='float-left pt-2'>
            <h4 style={{ textTransform: 'capitalize' }}><b><Link to={(this.props.routeTo)} onClick={this.closeFormModal}>
              {t(this.props.type)}
            </Link>
              {this.state.formType !== 'add' && this.state.displayBreadCrumbValue ? ` / ${this.state.displayBreadCrumbValue} ` : null}
            </b> </h4>
          </span>
        </div>
      </div>
    )
  }
  submitActionsData = async (method, url) => {
    return fetchMethodRequest(method, url)
      .then(async (response) => {
        let sessionexpired = localStorage.getItem('sessionexpired')
        if (sessionexpired == "true") {
          this.setState({ sessionExpiryModal: true })
        }
        await this.setState({
          openDeleteModal: false,
          actions: '',
        });
        if (response && response.respCode) {
          showToasterMessage(response.respMessage, 'success');
          await this.props.getDataFromServer(this.props.filterCriteria);
          await this.props.closeFormModal()
          await this.handleNextAndBackActions();
          // this.props.closeFormModal('save');
        } else if (response && response.errorMessage) {
          showToasterMessage(response.errorMessage, 'error');
        }
      }).catch((err) => {
        return err;
      });
  }

  handleActions = async () => {
    let apiUrl = this.props.apiUrl, url = '', method = '';
    if (this.state.confirmType === 'Delete') {
      method = 'DELETE';
      url = `${apiUrl}/${this.state.editRowDataID}`;
      this.submitActionsData(method, url)
    }
    if (this.state.confirmType === 'Block') {
      method = 'PUT';
      url = `${apiUrl}/block/${this.state.editRowDataID}?block=true`;
      this.submitActionsData(method, url)
    }
    if (this.state.confirmType === 'ResetPassword') {
      await this.setState({
        openUserPasswordResetModal: true,
        openDeleteModal: false
      })
    }

  }
  // conformation for delete item
  deleteConfirmAction = async (rowData, selectActions) => {
    this.setState({
      openDeleteModal: true,
      selectActions: selectActions,
    });
  }
  confirmActionType = async (type) => {
    if (type === 'Delete') {
      await this.setState({
        confirmType: type,
        confirmModalText: 'Are you sure want to Delete',
      })
      this.deleteConfirmAction()
    } else if (type === 'Block') {
      await this.setState({
        confirmType: type,
        confirmModalText: 'Are you sure want to Block',
      })
      this.deleteConfirmAction()
    } else if (type === 'ResetPassword') {
      await this.setState({
        confirmType: type,
        confirmModalText: 'Are you sure want to Reset Password',
        openUserPasswordResetModal: true,
        openDeleteModal: false
      })
      // this.deleteConfirmAction()
    }
  }

  //onActionsChange
  onActionsChange = async (event, type) => {
    if (type == 'dropdownFilter') {
      await this.setState({
        [event.target.name]: event.target.value,
      })
      this.confirmActionType(event.target.value)
    }
  }
  getViewBody() {
    const { t } = this.props;
    return (<div>

      <div className='row'>
        <div className='col-sm-4 pb-2'>
          {this.props.actionsTypes && this.props.actionsTypes.length > 0 ? <Dropdown
            style={{ minWidth: '10%', lineHeight: 1.3, }}
            className='mr-3'
            // appendTo={document.body}
            name='actions'
            value={this.state.actions}
            options={this.props.actionsTypes}
            placeholder={t('Actions')}
            onChange={(e) => this.onActionsChange(e, 'dropdownFilter')}
          /> : null}
        </div>
        <div className='col-sm-8 text-lg-right'>
          {this.state.originalTableFields && this.state.originalTableFields.length > 0 ? this.state.originalTableFields.map((item, index) => {
            return item.fieldType === 'Badge' && item.options && item.options.length > 0 ? item.options.map((optionsItem, optionsIndex) => {
              return (
                <Button key={optionsIndex} color='primary' onClick={() => this.saveDataToServer({ "status": optionsItem.value })} disabled={this.state.userStatus === optionsItem.value ? true : false}>{optionsItem.value}</Button>
              )
            }) : null
          }) : null}
        </div>
      </div>
      {this.state.rowData && this.state.rowData.length > 0 ?
        <div className="row form" >
          {this.state.rowData.map((item, i) => {
            return (
              item.value !== "" && item.value !== null && item.label !== 'SNo' ?
                <div className="col-sm-6 col-12" key={i}>
                  <div className="row" style={{ margin: "auto" }}>
                    <div
                      className="col-5 paddingRowDataCol"
                    >
                      <span className='fontWeight' style={{ fontWeight: "bold" }}>
                        {t(item.label)}
                      </span>
                    </div>

                    <div className="col-7 paddingOfRowData"
                    >
                      <span>{item.fieldType && item.fieldType == 'dropDown' ?
                        this.getBadgeData(item, item.value) : item.value
                      }</span>
                    </div>
                  </div>
                </div> : null
            );
          })}
        </div>
        : null
      }
    </div>

    )
  }
  getBadgeData(element, value) {
    let mcolor = this.props.getColorFromOptions(element.options, value);
    return (<Badge color={mcolor} pill >{value}</Badge>)
  }
  //sorting fields
  sortChange = (event) => {
    this.setState({ selectedRows: '' })
    let sortCount = this.state.sortCount;
    if (event && event['sortField']) {
      sortCount = sortCount == 0 ? sortCount + 1 : 0;
      let sortField = event['sortField'];
      let filterCriteria = this.state.filterCriteria;
      filterCriteria['direction'] = sortCount == 0 ? "desc" : 'asc';
      filterCriteria['sortfield'] = sortField;
      this.setState({
        sortCount: sortCount,
        filterCriteria: filterCriteria
      });
      this.getActivities();
    }
  }
  getColumns(e, d) {
    const { t } = this.props
    const self = this;
    self.e = e;
    self.d = d;
    let tablefieldsToShow = this.getTableFields();
    if (tablefieldsToShow && tablefieldsToShow.length > 0) {
      return tablefieldsToShow.map((item, i) => {
        let column = (item.show &&
          <Column key={item.field + i}
            style={{
              maxwidth: item.width,
              padding: 2,
            }}
            bodyStyle={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: item.field == 'status' || item.field == 'role' ? 'center' : item.textAlign
            }}
            field={item.field}
            header={t(item.header)}
            body={self.changeFieldValues}
            headerStyle={{
              padding: 4, fontWeight: 500, width: item.width, fontSize: 13,
              color: config.whiteColor, backgroundColor: config.templateColor
            }}
            filter={false}
            sortable={item.sortable ? true : false}
            filterPlaceholder={item.placeholder ? item.placeholder : 'search'}

            selectionMode={item.selectionMode}
          />
        )
        return column;
      })
    }
  }
  getDataTable() {
    let self = this;

    return (
      <DataTable
        ref={(el) => this.dt = el}
        value={this.state.activitiesData}
        totalRecords={this.state.totalRecordsLength}
        paginator={false}
        lazy={true}
        resizableColumns={true}
        columnResizeMode="expand"
        onSort={this.sortChange}
        globalFilter={this.state.globalFilter}
        onFilter={this.onFilterChange}
        scrollable={true}
        selection={false}
        scrollHeight='1000px'
        // style={{ marginTop: 0 }}
        emptyMessage={configMessages.noRecords}
        sortMode="single"
        // sortField="fname"
        // sortOrder={-1}
        // selectionMode={'multiple'}
        metaKeySelection={false}
        loading={this.state.isLoading}
        style={this.state.activitiesData && this.state.activitiesData.length == 0 ?
          { textAlign: 'center' }
          : null}
      >
        {self.getColumns()}
      </DataTable>
    )
  }
  getActivitiesHeader() {
    const { t } = this.props
    return (
      <div className='col-12  pb-1'>
        <span className='float-left pt-2'>
          <h4 style={{ textTransform: 'capitalize' }}><b><Link to={(this.props.routeTo)} onClick={this.closeFormModal}>
            {t('Activities')}
          </Link>
            {this.state.formType !== 'add' && this.state.displayBreadCrumbValue ? ` / ${this.state.displayBreadCrumbValue} ` : null}
          </b> </h4>
        </span>
        <span className='float-right pt-2'>
          {this.getPaginator()}
        </span>
      </div>
    )
  }
  //getScreenView
  getScreenView() {
    const { handleSubmit, } = this.props;
    return (
      <div>
        {this.props.openFormModal ? <div
        >
          <div className='row'>
            <div className='col-sm-12 pb-2'>
              <span className='float-left'>
                {this.getHeader()}
              </span>
              <span className='float-right'>
                {this.state.formType !== 'add' && this.getPaginationWithIcons()}
              </span>
            </div>
          </div>
          {this.state.formType !== 'view' ? this.getScreenBody(handleSubmit) : this.getViewBody()}
          {this.state.formType === 'view' && this.props.editRequired ? this.getEditButton() : null}
          {this.state.formType !== 'add' ?

            < div >
              <div className='row'>
                {this.getActivitiesHeader()}
              </div>
              <div className='row'>
                <div className='col-sm-12'>
                  {this.getDataTable()}
                </div>
              </div>
            </div> : null
          }
        </div> : null
        }
      </div>
    );
  }


  render() {
    const { displayViewOfForm } = this.props;
    return (
      <div>
        {displayViewOfForm === 'modal' ?
          this.getModalView() : displayViewOfForm === 'screen' ?
            this.getScreenView() : null
        }
        {this.state.openDeleteModal ? this.getDeleteRowModal() : null}
        {this.state.openUserPasswordResetModal ? this.getUserPasswordResetModal() : null}
      </div>
    );
  }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
FormModal = reduxForm({
  form: "Common Form Modal", // a unique identifier for this form
  validate,
  enableReinitialize: true,
})(FormModal);

// You have to connect() to any reducers that you wish to connect to yourself
FormModal = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),
  { load: loadAccount } // bind account loading action creator
)(FormModal);

export default withTranslation('common')(FormModal);