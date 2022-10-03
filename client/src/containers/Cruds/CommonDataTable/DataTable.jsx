// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Button, Col, Row, Card, CardBody, CardHeader, Collapse, ButtonGroup, ButtonToolbar } from 'reactstrap';
import moment from 'moment';

import { Link } from 'react-router-dom';

import '../../../scss/dashboardStyles.css';
import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import { Redirect } from 'react-router';

import { Paginator } from 'primereact/paginator';
import { CSVLink } from "react-csv";
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { withTranslation } from 'react-i18next';
import { MultiSelect } from 'primereact/multiselect';
import { AutoComplete } from 'primereact/autocomplete';

//Modals
import ShowHideColumnsModal from '../CommonModals/ShowHideColumnsModal';
import FormModal from '../../Form/FormModal';
import DeleteRowModal from '../CommonModals/DeleteRowModal';
import ViewModal from '../CommonModals/viewModal';
import BulkUploadModal from '../CommonModals/BulkUploadModal';
import ConfirmationModal from '../CommonModals/ConfirmationModal';
import SessionExpiryModal from '../CommonModals/SessionexpiryModal';
import PreviewModal from '../CommonModals/PreviewModal';
import SendEmailModal from '../CommonModals/SendEmailModal';
// import UserPasswordResetModal from '../Modals/UserPasswordResetModal';
// fetch method for server call
import fetchMethodRequest from '../../../config/service';
import config from '../../../config/config';
import configImages from '../../../config/configImages';
import configMessages from '../../../config/configMessages';
import apiCall from '../../../config/apiCalls';
//Render Date picker
import RenderIntervalDatePickerField from '../../../shared/components/form/IntervalDatePicker';
// Permissions
// import RolePermissions from '../Modals/Permissions';

// Toaster message
import showToasterMessage from '../../UI/ToasterMessage/toasterMessage';

// Date Formate
import dateFormats from '../../UI/FormatDate/formatDate';
//Loader
import Loader from '../../App/Loader';
//store
import store from '../../App/store'
import validate from '../../Validations/validate'
import { reduxForm, } from 'redux-form'
import { connect } from 'react-redux'
import crypto from "crypto-js";

import PaginatorComponent from './PaginatorComponent';
import { element } from 'prop-types';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCog, faPrint, faGripHorizontal, faList } from "@fortawesome/free-solid-svg-icons";

library.add(faCog, faPrint, faGripHorizontal, faList);

// tooltip styles
const LightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: config.templateColor,
    color: '#fff',
    boxShadow: theme.shadows[10],
    fontSize: 14,
    fontWeight: '500',
    margin: 0,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
}))(Tooltip);

const AnotherLightTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: config.templateColor,
    color: '#fff',
    boxShadow: theme.shadows[10],
    fontSize: 14,
    fontWeight: '500',
    margin: 0,
  },
}))(Tooltip);

class DataTables extends React.Component {
  constructor(props) {
    super(props);
    this.closeMultiSelectDropdown = React.createRef();
    this.state = {
      allUsersData: [],
      deleteRowDataId: {},
      tableFields: this.props.getTableFields(),
      originalTableFields: this.props.getTableFields(),
      tablefieldsToShow: this.props.getTableFields(),
      isOpenShowHideColumnsModal: false,
      first: 0,
      rows: 20,
      sortified: false,
      direction: 'asc',
      filterCriteria: { limit: 20, page: 1, criteria: [], sortfield: 'created', direction: 'desc' },
      selectedRows: '',
      selectedRowsId: '',
      totalRecords: [],
      exportData: [],
      isOpenFormModal: false,
      openBulkUploadModal: false,
      openViewModal: false,
      isLoading: false,
      isOpenRolesModal: false,
      isOpenConfirmationModal: false,
      selectedScreenPermission: '',
      loginRole: 'Admin',
      startDate: '',
      endDate: '',
      apiUrl: this.props.apiUrl,
      totalRecordsLength: 0,
      tabType: this.props.tabType,

      sessionExpiryModal: false,
      mobileListFields: [],
      dateFormat: '',
      openTemplateModal: false,
      isOpenProductsModal: false,
      selectschool: '',
      roleType: '',
      openId: 1,
      redirecToLogin: false,
      openDeleteModal: false,
      blockFamily: false,
      selectActions: '',
      viewType: 'list',
      actions: '',
      displayViewOfForm: this.props.displayViewOfForm,
      displayBreadCrumbField: '',
      displayBreadCrumbValue: '',
      width: window.innerWidth,
      height: window.innerHeight,
      globalSearch: '',
      showMultiSelectDropDown: false,
      multiSelectTypes: '',
      actionsTypes: '',
      userStatus: '',
      selectedAutoCompleteValue: '',
      suggestions: [],
      confirmModalText: '',
      confirmType: '',
      openUserPasswordResetModal: false,
      isPreviewModal: false,
      emailTemplateData: '',
      redirectToRoute:false,
      searchInDateRangeField: this.props.searchInDateRangeField ? this.props.searchInDateRangeField : "created",
      openSendEmailModal: false,
    };
  }

  componentDidMount = async () => {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    // console.log(this.props.viewSelectedRecord , this.props.editSelectedRecord,this.props.addSelectedRecord)
    if (this.props.setData && (this.props.viewSelectedRecord || this.props.editSelectedRecord || this.props.addSelectedRecord)) {
      // console.log("projectDetails",projectDetails)
      let projectDetails = await this.props.setData(this.props)
      // console.log("projectDetails",projectDetails)
      if (projectDetails && projectDetails._id) {
        await this.getDataFromServer()
        if (this.props.editSelectedRecord) {
          let rowData = this.getAUserData(projectDetails._id, '_id')
          this.openFormModal(rowData, 'edit')
        } else if (this.props.viewSelectedRecord) {
          this.openViewModal(projectDetails, "view", "route")
        }  
      }else if (this.props.addSelectedRecord) {
        this.openFormModal('add')
      }
    }
    let loginCredentials = localStorage.loginCredentials ? JSON.parse(localStorage.loginCredentials) : false;
    window.addEventListener('resize', this.updateDimensions);
    document.addEventListener('mousedown', this.handleClickOutside)
    if (!loginCredentials) {
      await this.setState({ redirecToLogin: true })
    } else {
      await this.setState({
        redirecToLogin: false,
        displayViewOfForm: this.props.displayViewOfForm,
      })
    }
    let sessionexpired = await localStorage.getItem('sessionexpired')
    if (sessionexpired == "true") {
      await this.setState({ sessionExpiryModal: true })
    }
    await this.getTimeFormat()
    await this.getLoginRole();
    await this.getActions();
    // hari check where this should go
    if (this.props.getTableFields) {
      //let tablefields = await this.props.getTableFields();
      this.setState({
        tablefields: this.props.getTableFields(),
        originalTableFields: this.props.getTableFields(),
        isLoading: false,
        mobileListFields: this.props.getTableFields(),
      }, async () => {
        let colOrder = localStorage.getItem(`${this.props.type}_column_order`);
        let columns = await JSON.parse(colOrder);
        if (columns) {
          await this.getTableFieldsOrder();
        } else {
          await this.updateColumnsOrder(null);
        }
      });
    }
    this.getDataFromServer(this.state.filterCriteria);
    this.setState({
      formFields: this.props.formFields
    })
    this.setEncryptFields()
  }

  getActions = async () => {
    let selectedRows = this.state.selectedRows ? [... this.state.selectedRows] : [];
    let actionsTypes = this.props.actionsTypes ? [... this.props.actionsTypes] : [];
    console.log(actionsTypes)
    let result = [];
    if (actionsTypes && actionsTypes.length) {
      for (let i = 0; i < actionsTypes.length; i++) {
        if (actionsTypes[i]['options'] && actionsTypes[i]['options'].length > 0) {
          let options = actionsTypes[i]['options']
          for (let j = 0; j < options.length; j++) {
            if (options[j]['show'] === true) {
              if (selectedRows && selectedRows.length >= 2 && options[j]['multiple'] === true) {
                result.push({ "label": options[j]['label'], "value": options[j]['value'], "field": options[j]['field'], "action": actionsTypes[i]['action'] })
              } else if (selectedRows && selectedRows.length === 1) {
                result.push({ "label": options[j]['label'], "value": options[j]['value'], "field": options[j]['field'], "action": actionsTypes[i]['action'] })
              } else if (selectedRows && selectedRows.length === 0) {
                result.push({ "label": options[j]['label'], "value": options[j]['value'], "field": options[j]['field'], "action": actionsTypes[i]['action'] })
              }
            }
          }
        }
      }
    }
    await this.setState({
      actionsTypes: result
    })
  }

  handleClickOutside = (event) => {
    if (
      this.closeMultiSelectDropdown.current &&
      !this.closeMultiSelectDropdown.current.contains(event.target)
    ) {
      this.setState({
        showMultiSelectDropDown: false
      });
    }
  };
  componentWillUnmount() {
    if (this.props.onRef) {
      this.props.onRef(null);
    }
    window.removeEventListener('resize', this.updateDimensions);
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
  updateDimensions = async () => {
    await this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  getTimeFormat = () => {
    // let store=store.getState()
    // let dateFormat=store && store.commonData && store.commonData.data && store.commonData.data.timeFormat?store.commonData.data.timeFormat:'DD-MM-YYYY'
    // console.log('timeFormat',dateFormat)
  }
  setEncryptFields = async () => {
    let encryptFields = [];
    for (let i = 0; i < this.state.tablefieldsToShow.length; i++) {
      //condition to match fieldType
      if (this.state.tablefieldsToShow[i].fieldType == "encryptedField") {
        encryptFields.push(this.state.tablefieldsToShow[i]['field']);
      }
    }
    this.setState({ encryptFields: encryptFields })
  }
  // Handle Table fields to show in datatable
  getTableFieldsOrder() {
    this.setState({
      tablefieldsToShow: [],
      isLoading: true,
    })

    let colOrder = localStorage.getItem(`${this.props.type}_column_order`);
    let columns = JSON.parse(colOrder);
    let tempTableFields = [];
    let newTableFields = [];
    let staticTableFields = [...this.state.originalTableFields];

    if (columns) {
      for (let i = 0; i < columns.length; i++) {
        for (let j = 0; j < staticTableFields.length; j++) {
          if (columns[i].field === staticTableFields[j].field && this.state.viewType === 'list') {
            let pushItem = staticTableFields[j];
            pushItem.show = columns[i].show;
            pushItem.displayInSettings = columns[i].displayInSettings;
            tempTableFields.push(pushItem);
            break;
          }
          if (columns[i].field === staticTableFields[j].field && this.state.viewType === 'grid') {
            let pushItem = staticTableFields[j];
            pushItem.displayInSettings = columns[i].displayInSettings;
            pushItem.mobile = columns[i].mobile;
            tempTableFields.push(pushItem);
            break;
          }
        }
      }
    } else {
      tempTableFields = this.state.originalTableFields
    }

    newTableFields = tempTableFields;

    let TableFieldsToShow = [];
    if (newTableFields && newTableFields.length > 0) {
      newTableFields.map(item => {
        // TableFieldsToShow.push(item)
        if (item.show && this.state.viewType === 'list') {
          TableFieldsToShow.push(item)
        }
        if (item.mobile && this.state.viewType === 'grid') {
          TableFieldsToShow.push(item)
        }
      })
    }

    this.setState({
      tablefieldsToShow: TableFieldsToShow,
      isLoading: false,
    })
  }
  changeCheckIcon = async (index, subIndex, key, value) => {
    let tablefieldsToShow = this.state.tablefieldsToShow;
    if (tablefieldsToShow[index]['options'][subIndex]['checkIcon'] === true) {
      let filterCriteria = Object.assign({}, this.state.filterCriteria);
      if (filterCriteria && filterCriteria['criteria'] && filterCriteria['criteria'].length > 0) {
        let obj = filterCriteria.criteria.find(x => x.key === key);
        let objIndex = filterCriteria.criteria.indexOf(obj)
        let objValue = obj.value.find(y => y === value)
        let i = obj.value.indexOf(objValue);
        filterCriteria.criteria[objIndex]['value'].splice(i, 1);
        let length = filterCriteria.criteria[objIndex]['value'] ? filterCriteria.criteria[objIndex]['value'].length : 0;
        if (length === 0) {
          filterCriteria.criteria.splice(objIndex, 1)
        }
      }
      tablefieldsToShow[index]['options'][subIndex]['checkIcon'] = !tablefieldsToShow[index]['options'][subIndex]['checkIcon'];
      await this.setState({
        tablefieldsToShow: tablefieldsToShow,
        filterCriteria: filterCriteria
      })
      await this.onMultiSelectFilterChange(key, value, 'pop', index)
    } else {
      let filterCriteria = Object.assign({}, this.state.filterCriteria);
      tablefieldsToShow[index]['options'][subIndex]['checkIcon'] = !tablefieldsToShow[index]['options'][subIndex]['checkIcon'];
      await this.setState({
        tablefieldsToShow: tablefieldsToShow
      })
      if (filterCriteria && filterCriteria['criteria'] && filterCriteria['criteria'].length > 0) {
        let obj = filterCriteria.criteria.find(x => x.key === key);
        let objIndex = filterCriteria.criteria.indexOf(obj);
        await this.onMultiSelectFilterChange(key, value, 'push', objIndex)
      } else {
        await this.onMultiSelectFilterChange(key, value, 'push', index)
      }

    }
  }
  changeViewType = async (viewType) => {
    await this.setState({ viewType: viewType })
    await this.getTableFieldsOrder()
  }
  // Handle Table fields order of display in DataTable
  updateColumnsOrder(currentOrder) {
    this.setState({
      isLoading: true,
    })
    let originalTableFields = [...this.state.originalTableFields];
    let order = currentOrder ? currentOrder : null;
    let updatedOrder = [];
    let unmatchedTableFields = [...this.state.originalTableFields];

    if (order && order.length > 0) {
      order.map(async item => {
        if (item && item.props && item.props.field) {
          originalTableFields.map(col => {
            if (item.props.field === col.field) {
              updatedOrder.push(
                {
                  field: col.field,
                  show: col.show,
                  header: col.header,
                  displayInSettings: col.displayInSettings,
                  mobile: col.mobile,
                  label:col.label?col.label:col.header
                }
              )
            }
          })
        }
      })

      order.map(async item => {
        if (item && item.props && item.props.field) {
          for (let i = 0; i < unmatchedTableFields.length; i++) {
            if (item.props.field === unmatchedTableFields[i].field) {
              unmatchedTableFields.splice(i, 1)
            }
          }
        }
      })

      if (unmatchedTableFields && unmatchedTableFields.length > 0) {
        unmatchedTableFields.map(col => {
          updatedOrder.push(
            {
              field: col.field,
              show: false,
              header: col.header,
              displayInSettings: col.displayInSettings,
              mobile: false,
              label:col.label?col.label:col.header
            }
          )
        })
      }
    } else {
      originalTableFields.map(async col => {
        updatedOrder.push(
          {
            field: col.field,
            show: col.show,
            header: col.header,
            displayInSettings: col.displayInSettings,
            mobile: col.mobile,
            label: col.label?col.label:col.header
          }
        )
      });
    }

    localStorage.setItem(`${this.props.type}_column_order`, JSON.stringify(updatedOrder));
    this.getTableFieldsOrder(this.state.originalTableFields);
  }

  static getDerivedStateFromProps(props, state) {
    let storeData = store.getState()
    //console.log('store Data', storeData)
    let dateFormat = storeData && storeData.settingsData && storeData.settingsData.settings && storeData.settingsData.settings.dateFormat ? storeData.settingsData.settings.dateFormat : "DD-MM-YYYY"
    //console.log('timeFormat', dateFormat)
    if (state.dateFormat != dateFormat) {
      return { dateFormat: dateFormat };

    }
    return { dateFormat: dateFormat };

  }

  getLoginRole() {
    let loginData = localStorage.getItem('loginCredentials');
    if (loginData) {
      loginData = JSON.parse(loginData);
      if (loginData && loginData.role) {
        this.setState({
          loginRole: loginData.role
        })
      }
    }
  }

  updateSlNoToData(itemdata) {
    let modifiedData = [];
    itemdata.forEach((item, index) => {
      if (this.props.flags) {
        let flags = this.props.flags
        if (item[flags['label']] == flags['value']) {
          modifiedData.push(item);
        }
      } else {
        if (this.state.first) {
          item.Sno = (index + 1) + this.state.first;
        } else {
          item.Sno = index + 1;
        }

        modifiedData.push(item);
      }
    });
    return modifiedData;
  }

  updateDateFormat(itemdata, dateFormat) {
    let modifiedData = [];
    for (let i = 0; i < itemdata.length; i++) {
      for (let k = 0; k < this.state.tablefieldsToShow.length; k++) {
        if ("Date" == this.state.tablefieldsToShow[k]['fieldType']) {
          itemdata[i][this.state.tablefieldsToShow[k]['field']] =
            dateFormats.formatDate(
              itemdata[i][this.state.tablefieldsToShow[k]['field']],
              this.state.tablefieldsToShow[k]['dateFormat'] ? this.state.tablefieldsToShow[k]['dateFormat'] : dateFormat);
        }
      }
      modifiedData.push(itemdata[i])
    }
    return modifiedData;
  }

  //get table list data from server with filters if any
  getDataFromServer = async (filterCriteria, type) => {
    let url = this.getAPIUrl();
    //let url = this.props.apiUrl;
    let dateFormat = this.state.dateFormat
    if (url) {
      let apiUrl;
      this.setState({
        isLoading: true,
        selectedRows: '',
      });
      if (type == 'refresh') {
        if (document.getElementById("globalSearch") && document.getElementById('globalSearch').value) {
          document.getElementById('globalSearch').value = '';
        }
        let tablefieldsToShow = this.state.tablefieldsToShow;
        if (tablefieldsToShow && tablefieldsToShow.length > 0) {
          for (let i = 0; i < tablefieldsToShow.length; i++) {
            let options = tablefieldsToShow[i].options;
            if (options && options.length) {
              for (let j = 0; j < options.length; j++) {
                options[j]['checkIcon'] = false
              }
            }
          }
        }
        await this.setState({
          globalSearch: '',
          allUsersData: [],
          status: '',
          selectschool: '',
          roleType: '',
          tablefieldsToShow: tablefieldsToShow
        });

      }
      if (!filterCriteria || !filterCriteria['criteria']) {
        let filterCriteria = {};
        filterCriteria = { limit: 20, page: 1, criteria: [], direction: 'desc', softfield: 'created' };
      }
      if (filterCriteria && filterCriteria['criteria'] && filterCriteria['criteria'].length > 0) {
        delete filterCriteria['sortfield'];
        delete filterCriteria['direction'];
      }
      if (type === 'refresh' && filterCriteria) {
        delete filterCriteria.globalSearch;
        filterCriteria['criteria'] = [];
        filterCriteria['direction'] = 'desc';
        filterCriteria['sortfield'] = 'created';
      }
      if (this.props.params) {
        console.log(this.props.params)
        let params = this.props.params
        for (let i in params) {
          console.log(i)
          if (i) {
            let obj = {}
            obj['key'] = i
            obj['value'] = params[i]
            obj['type'] = 'regexOr'
            filterCriteria['criteria'].push(obj)
            console.log(obj)
          }
        }
      }
      //applyng filter when a row item is deleted 
      if (filterCriteria == undefined) {
        filterCriteria = { limit: 20, page: 1, criteria: [], direction: 'desc', softfield: 'created' };
        apiUrl = `${url}?filter=${JSON.stringify(filterCriteria)}`;
      }
      if (this.props.filterExtension) {
        apiUrl = `${url}?filter=${JSON.stringify(filterCriteria)}&&${this.props.filterExtension}`
      }
      else if (this.props.hasQueryInCall) {
        console.log('hi')
        apiUrl = `${url}&filter=${JSON.stringify(filterCriteria)}`;
      }
      else {
        // apiUrl = this.getFilterUrl(filterCriteria, type);
        apiUrl = `${url}?filter=${JSON.stringify(filterCriteria)}`;
      }

      return fetchMethodRequest('GET', apiUrl)
        .then(async (response) => {
          let apiResponseKey = this.props.apiResponseKey;
          let sessionexpired = await localStorage.getItem('sessionexpired')
          if (sessionexpired == "true") {
            await this.setState({ sessionExpiryModal: true })
          }
          let responseData = [], totalRecordsLength = this.state.totalRecordsLength;

          if (response && response.details && response.details.length > 0) {
            responseData = response.details;
            totalRecordsLength = response.details.length;
          } else {
            if (response && response[apiResponseKey] && response[apiResponseKey].length && response[apiResponseKey].length >= 0) {
              if (response.pagination && response.pagination.totalCount) {
                totalRecordsLength = response.pagination.totalCount;
              }
              responseData = this.updateSlNoToData(response[apiResponseKey]);
              responseData = this.updateDateFormat(responseData, this.state.dateFormat);
            } else {
              if (response.pagination && (response.pagination.totalCount || response.pagination.totalCount == 0)) {
                totalRecordsLength = response.pagination.totalCount;
              }
            }
          }
          if (this.state.encryptFields && this.state.encryptFields.length > 0 && responseData && responseData.length > 0) {
            for (let field of this.state.encryptFields) {
              for (let data of responseData) {
                if (data[field]) {
                  let decrypt = await crypto.AES.decrypt(data[field].toString(), config.sourceKey);
                  data[field] = decrypt.toString(crypto.enc.Utf8)
                }
              }
            }
            // console.log(this.state.encryptFields)
          }
          await this.setState({
            allUsersData: responseData,
            isLoading: false,
            totalRecordsLength: totalRecordsLength
          })
          return responseData;
        }).catch((err) => {
          return err;
        });
    }
  }


  getAPIUrl() {
    return this.props.apiUrl;
  }
  getFilterUrl(filterCriteria, type) {
    return this.props.apiUrl;
  }

  //Get all data of current screen with filters applied from server to export to CSV
  getDataToExport = async () => {
    this.setState({ isLoading: true })
    let filterCriteria = this.state.filterCriteria;
    delete filterCriteria['limit'];
    delete filterCriteria['page'];
    let url = this.getAPIUrl();
    let apiUrl;
    apiUrl = `${this.state.apiUrl}?filter = ${JSON.stringify(filterCriteria)}&type=exportToCsv`;
    return fetchMethodRequest('GET', apiUrl)
      .then(async (response) => {
        let sessionexpired = await localStorage.getItem('sessionexpired')
        if (sessionexpired == "true") {
          await this.setState({ sessionExpiryModal: true })
        }
        if (response && response[url]) {
          let exportData = response[url];
          exportData.forEach((item) => {
            for (let key in item) {
              if (item[key] && item[key].name) {
                item[key] = item[key].name;
              }
            }
          });
          this.setState({
            exportData: exportData,
            isLoading: false
          }, () => {
            // click the CSVLink component to trigger the CSV download
            this.csvLinkRef.link.click();
          });
        }
      }).catch((err) => {
        this.setState({
          isLoading: false
        });
        return err;
      });
  }

  //open Form modal
  openFormModal = async (rowData, type) => {
    await this.setState({
      isOpenFormModal: true,
      formType: type ? type : 'add',
      selectedRows: ''
    });
    if (type === 'view') {
      if (this.state.isOpenFormModal && this.formModalRef) {
        await this.formModalRef.getViewData(rowData);
      }
    }
    if (type == 'edit') {
      if (this.state.isOpenFormModal && this.formModalRef) {
        await this.formModalRef.getRowData(rowData, 'edit');
      }
    }
  }

  //close form modal
  closeFormModal = async () => {
    this.setState({
      isOpenFormModal: false,
      redirectToRoute:true,
    })
  }
  submitActionsData = async (method, url, body) => {
    return fetchMethodRequest(method, url, body)
      .then(async (response) => {
        let sessionexpired = localStorage.getItem('sessionexpired')
        if (sessionexpired == "true") {
          this.setState({ sessionExpiryModal: true })
        }
        await this.setState({
          openDeleteModal: false,
          actions: '',
          selectedRows: '',
          selectedRowsId: ''
        });
        if (response && response.respCode) {
          showToasterMessage(response.respMessage, 'success');
          this.getDataFromServer();
        } else if (response && response.errorMessage) {
          showToasterMessage(response.errorMessage, 'error');
        }
      }).catch((err) => {
        return err;
      });
  }
  handleActions = async (apiType) => {
    console.log(apiType)
    let apiUrl = this.state.apiUrl;
    let method, url, body = {}
    if (this.state.confirmType === 'Delete' || this.state.confirmType === 'Block' || this.state.confirmType === 'UnBlock') {
      url = `${apiUrl}/${apiType}`;
      method = 'POST';
      body = {
        selectedIds: this.state.selectedRowsId
      }
    }
    this.submitActionsData(method, url, body)
  }
  // delete selected row
  deleteSelectedRow = async () => {
    if (this.state.confirmType === 'Delete') {
      this.handleActions('multiDelete')
    } else if (this.state.confirmType === 'Block') {
      this.handleActions('multiblock?block=true')
    } else if (this.state.confirmType === 'UnBlock') {
      this.handleActions('multiblock?unblock=true')
    } else if (this.state.confirmType === 'ResetPassword') {
      await this.setState({
        openUserPasswordResetModal: true,
        openDeleteModal: false,
        selectedRows: this.state.selectedRows
      })
    }
  }

  //close delete modal
  closeDeleteModal = async () => {
    this.setState({
      openDeleteModal: false,
      actions: ''
    })
  }
  setDeleteRecords = async (rowData, selectActions) => {
    let selectedRowsId = [];
    selectedRowsId.push(rowData)
    await this.setState({
      selectedRows: selectedRowsId,
      confirmType: "Delete"
    })
    this.deleteConfirmAction(rowData, selectActions)
  }

  // conformation for delete item
  deleteConfirmAction = async (rowData, selectActions) => {
    let selectedRowsId = [];
    // console.log(selectActions)
    let selectedRows = [...this.state.selectedRows]
    // console.log(selectedRows)
    if (selectedRows && selectedRows.length && selectedRows.length > 0) {
      selectedRows.forEach((item, index) => {
        selectedRowsId.push(item._id)
      })
      await this.setState({
        selectedRowsId: selectedRowsId,
        openDeleteModal: true,
        selectActions: selectActions,
      })
    }
    if (rowData) {
      this.setState({
        deleteRowDataId: rowData,
        openDeleteModal: true,
        selectActions: selectActions,
      });
    }
  }

  //change dropdown elememt
  changeDropDownElement = (event) => {
    this.dt.filter(event.target.value, event.target.name, 'equals');
    this.setState({
      [event.target.name]: event.value
    });
  }


  getTableFieldItem(field) {
    for (let i = 0; i < this.state.tablefieldsToShow.length; i++) {
      if (this.state.tablefieldsToShow[i].field == field) {
        return this.state.tablefieldsToShow[i];
      }
      //condition to match fieldType
      if (this.state.tablefieldsToShow[i].fieldType == field) {
        return this.state.tablefieldsToShow[i]['field'];
      }
    }
    return null;
  }

  getColorFromOptions(options, name) {
    if (options) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value == name) {
          return options[i].color;
        }
      }
    }
    return 'success';
  }
  getUserData(_id, type) {
    let data = this.state.allUsersData;
    for (let i = 0; i < data.length; i++) {
      if (data[i]['_id'] === _id) {
        return i
      }
    }
  }
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
  getAUserData(_id, type) {
    let data = this.state.allUsersData;
    for (let i = 0; i < data.length; i++) {
      if (data[i]['_id'] === _id) {
        return data[i]
      }
    }
  }
  openViewModal = async (rowData, type,from) => {
    let rowDataIndex = this.getUserData(rowData['_id'], '_id');
    if(from == "route") { rowData = this.getAUserData(rowData['_id'], '_id')}
    let _id = rowData['_id'];
    let status = rowData['status'] ? rowData['status'] : ''
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
      if (this.state.displayViewOfForm === 'modal') {
        await this.setState({
          // openViewModal: true
          isOpenFormModal: true,
          userStatus: status,
          formType: type,
        });
        // await this.viewModalRef.getRowData(formFields);
        await this.formModalRef.getViewData(formFields, 'view', rowDataIndex, rowData, _id);
      } else if (this.state.displayViewOfForm === 'screen') {
        let displayBreadCrumbField = this.getTableFieldItem('Link');
        await this.setState({
          isOpenFormModal: true,
          formType: type,
          displayBreadCrumbValue: rowData[displayBreadCrumbField],
          displayBreadCrumbField: displayBreadCrumbField,
          userStatus: status
        });
        await this.formModalRef.getViewData(formFields, 'view', rowDataIndex, rowData, _id);
      }
    }
    await this.getDataFromServer();

  }

  closeViewModal = async () => {
    this.setState({
      openViewModal: false
    });
  }
  //on changing pagination
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
    this.getDataFromServer(filterCriteria)
  }

  onPageChangeAccordion = async (event) => {
    let filterCriteria = this.state.filterCriteria;
    let id = this.state.openId;
    if (event && event.rows) {
      let currentPage = event.page + 1;
      filterCriteria['limit'] = event.rows;
      filterCriteria['page'] = currentPage;
      this.setState({
        [`rows${id}`]: event.rows,
        page: event.page,
        [`first${id}`]: event.first
      })
    }
    // this.getDataFromServer(filterCriteria)
  }
  //sorting fields
  sortChange = (event) => {
    this.setState({ selectedRows: '' })
    let sortCount = this.state.sortCount;
    if (event && event['sortField']) {
      sortCount = sortCount == 0 ? sortCount + 1 : 0;
      let sortField = event['sortField'];
      let filterCriteria = {
        direction: sortCount == 0 ? "desc" : 'asc',
        sortfield: sortField,
      }
      this.setState({
        sortCount: sortCount,
        isLoading: true
      });
      this.getDataFromServer(filterCriteria);
    }
  }
  confirmActionType = async (type) => {
    console.log(type)
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
        openDeleteModal: false,
        selectedRows: this.state.selectedRows
      })
      // this.deleteConfirmAction()
    } else if (type === 'Send Email') {
      await this.setState({
        openSendEmailModal: true,
        // selectedRows: this.state.selectedRows
      })
      // this.deleteConfirmAction()
    }
  }

  //onActionsChange
  onActionsChange = async (event, type) => {
    console.log(event)
    if (type == 'dropdownFilter') {
      await this.setState({
        [event.target.name]: event.target.value,
      })
      console.log(this.state.actionsTypes)
      for (let i in this.state.actionsTypes) {
        if (this.state.actionsTypes[i].value === event.target.value) {
          if (this.state.actionsTypes[i].action) {
            this.state.actionsTypes[i].action(this.state.selectedRows, this.state.actionsTypes[i].field, this.state.actionsTypes[i].value)
            return;
          }
        }
      }
      this.confirmActionType(event.target.value)
    }
  }

  onMultiSelectFilterChange = async (key, value, type, index) => {
    let filterCriteria = this.state.filterCriteria;
    if (filterCriteria && type === 'push') {
      let v = [], length = '';
      if (filterCriteria['criteria'] && filterCriteria['criteria'][index] && filterCriteria['criteria'][index]["value"]) {
        v = [...filterCriteria['criteria'][index]["value"]];
        length = v.length;
        v[length] = value;
        filterCriteria['criteria'][index]["value"] = v;
      } else {
        v[0] = value
        filterCriteria['criteria'].push({
          key: key,
          value: v,
          type: 'in'
        });
      }

      await this.setState({
        filterCriteria: filterCriteria
      })
      await this.getDataFromServer(this.state.filterCriteria)
    } else {
      this.getDataFromServer(this.state.filterCriteria)
    }
  }
  // on search get data from server
  onFilterChange = async (event, type) => {
    this.setState({
      isLoading: true,
      selectedRows: ''
    })
    console.log(type)
    if (type === 'dropdownFilter' || type === 'date') {
      await this.setState({
        [event.target.name]: event.target.value
      })
    }
    let fieldName = '', filterCriteria = this.state.filterCriteria,
      selectedFilterValue, selectedFilter, selecterFilterType, formattedTime, formattedDate, isDateFilter = false;
    if (event) {
      if (event.filters && !type) {
        if (Object.keys(event.filters) && Object.keys(event.filters)[0]) {
          fieldName = Object.keys(event.filters)[0];
        }
        let field = event.filters;
        selectedFilter = field[fieldName];
        if (fieldName == 'date' || fieldName == 'created' || fieldName == 'updated') {
          isDateFilter = true;
          selectedFilterValue = selectedFilter && selectedFilter.value && selectedFilter.value.length == 10 ?
            selectedFilter.value : null;
          let date = dateFormats.addDaysToDate(selectedFilter.value, 1);
          formattedDate = dateFormats.formatDate(date, config.dayYearDateFormat);
          selecterFilterType = 'eq'
        } else {
          selecterFilterType = 'regexOr'
          selectedFilterValue = selectedFilter && selectedFilter.value ? selectedFilter.value : null;
        }
      } else {
        fieldName = event.target.name;
        selectedFilterValue = event && event.target && event.target.value ? event.target.value : null;
        this.setState({ globalSearch: selectedFilterValue })
      }
      if (type == 'dropdownFilter') {
        selecterFilterType = 'in'
      }
      if ((type == 'dropdownFilter' && selectedFilterValue && selectedFilterValue.length && selectedFilterValue.length > 0) || (type !== 'date' && selectedFilterValue && selectedFilterValue.length && selectedFilterValue.length >= 3)) {
        if (fieldName == 'createdBy') {
          fieldName = 'createdBy.name';
        }
        if (fieldName == 'phone') {
          fieldName = 'phone';
        }
        if (fieldName == 'globalSearch') {
          filterCriteria.globalSearch = {
            value: selectedFilterValue,
            type: 'user'
          }
          console.log(event.target.value.length)
          if (event.target.value.length == 0) {
            console.log('delete')
            delete filterCriteria.globalSearch;
          }
          // this.setState({ globalSearch: selectedFilterValue })
        } else {
          if (selecterFilterType == 'gte') {
            let obj = filterCriteria.criteria.find(x => x.key == fieldName);
            let index = filterCriteria.criteria.indexOf(obj);
            if (index != -1) {
              filterCriteria['criteria'].splice(index, 1, {
                key: fieldName,
                value: formattedDate,
                type: 'eq'
              });
            } else {
              filterCriteria['criteria'].push({
                key: fieldName,
                value: formattedDate,
                type: 'eq'
              });
            }
          } else {
            if (fieldName == 'updated') {
              fieldName = 'updated.name'
            }
            if (filterCriteria['criteria'].length == 0 && selecterFilterType != 'lte') {
              filterCriteria['criteria'].push({
                key: fieldName,
                value: selectedFilterValue,
                type: selecterFilterType
              });
            } else {
              let obj = filterCriteria.criteria.find(x => x.key == fieldName);
              let index = filterCriteria.criteria.indexOf(obj);
              if (selecterFilterType == 'lte') {
                if (selectedFilterValue.length == 10) {
                  filterCriteria['criteria'].splice(0, 1, ({
                    key: fieldName,
                    value: selectedFilterValue.substring(6, 10) + '-' + selectedFilterValue.substring(3, 5) + '-' + selectedFilterValue.substring(0, 2) + 'T23:59:59Z',
                    type: selecterFilterType
                  }));
                }
              }
              if (index != -1 && selecterFilterType != 'lte') {
                filterCriteria['criteria'].splice(index, 1, {
                  key: fieldName,
                  value: selectedFilterValue,
                  type: selecterFilterType
                });
              } else if (selecterFilterType != 'lte') {
                filterCriteria['criteria'].push({
                  key: fieldName,
                  value: selectedFilterValue,
                  type: selecterFilterType
                });
              }
            }
          }
          await this.setState({
            filterCriteria: filterCriteria
          });
        }

        await this.getDataFromServer(this.state.filterCriteria)
      } else if (type === 'date' && selectedFilterValue && selectedFilterValue.length && selectedFilterValue.length > 0) {
        if (selectedFilterValue.length == 2) {
          let startDate = (moment(selectedFilterValue[0]).format('YYYY-MM-DD'));
          let eDate = selectedFilterValue[1] ? JSON.parse(JSON.stringify(selectedFilterValue[1])) : JSON.parse(JSON.stringify(selectedFilterValue[0]))
          eDate = new Date(eDate)
          let endDate = eDate.setDate(eDate.getDate() + 1)
          endDate = (moment(endDate).format('YYYY-MM-DD'));
          filterCriteria['limit'] = 20;
          filterCriteria['page'] = 1;
          filterCriteria.criteria.push({ 'key': fieldName, 'value': startDate, 'type': 'gte' })
          filterCriteria.criteria.push({ 'key': fieldName, 'value': endDate, 'type': 'lte' })
        }
        await this.setState({
          filterCriteria: filterCriteria
        });
        await this.getDataFromServer(filterCriteria)
      } else {
        if (selectedFilterValue == null && !isDateFilter) {
          let obj = filterCriteria.criteria.find(x => x.key == fieldName);
          let index = filterCriteria.criteria.indexOf(obj);
          filterCriteria.criteria.splice(index, 1);
          if (fieldName == 'globalSearch') {
            filterCriteria.globalSearch = {}
            delete filterCriteria.globalSearch
          }
          await this.setState({
            filterCriteria: filterCriteria
          });
          await this.getDataFromServer(filterCriteria)
        }
      }
      this.setState({
        isLoading: false
      })
    }
  }

  //open Bulk Modal
  bulkUploadMoadal = () => {
    this.setState({ openBulkUploadModal: true })
  }

  //close Bulk Modal
  closeBulkModal = async () => {
    // this.setState({
    //   openBulkUploadModal: false
    // }, () => {
    //   this.bulkUploadMoadalRef.handleClickCount();
    // })
    this.setState({
      openBulkUploadModal: false
    })
  }

  //select multiple rows to delete
  onSelectRowsUpdate = async (event) => {
    await this.setState({ selectedRows: event.value })
    await this.getActions()
  }

  //openConfirmationModal
  openConfirmationModal = async (rowData, status, type) => {
    this.setState({
      isOpenFormModal: false
    }, async () => {
      this.setState({
        isOpenFormModal: false,
        openConfirmationModal: true,
        leaveStatus: status,
        item: rowData,
        confirmText: type
      })
    })
  }

  closeConfirmationModal() {
    this.setState({
      openConfirmationModal: false
    })
  }
  setFilterCriteriaForActivities = async (editRowDataID) => {
    let filterCriteria = this.state.filterCriteria;
    filterCriteria['criteria'].push(
      { key: 'contextId', value: editRowDataID, type: 'eq' }
    )
    await this.setState({
      filterCriteria: filterCriteria
    })
  }
  getTooltipFromOtptions(options, name) {
    if (options) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === name) {
          return options[i].tooltip;
        }
      }
    }
    return '';
  }
  //change table body values//
  // hari need to move to derived class or controller
  changeFieldValues = (item, column) => {
    let self = this, tableItem;
    tableItem = self.getTableFieldItem(column.field);
    if (tableItem.fieldType == "Link") {
      return <div className='textElipses'>
         <span
          // onClick={() => this.openViewModal(item, 'view')}
           title={item[column.field]}>
          <a href={`/view_${this.props.routeTo}/${JSON.stringify(item._id)}`} >  {item[column.field]}</a>
          </span>
      </div >
    } else if (tableItem.fieldType == "WebSite") {
      return <div className='textElipses'>
        <a href={item[column.field]} title={item[column.field]} target="_blank">{item[column.field]}</a>
      </div >
    } else if (tableItem.fieldType == "Download") {
      return <div className='textElipses'>
        <a href={item["duplicateFileDownloadUrl"]} title={item[column.field]} target="_blank">{item[column.field]}</a>
      </div >
    }
    else if (tableItem.fieldType == "dropDown") {
      let mcolor = self.getColorFromOptions(tableItem.options, item[column.field]);
      return <Badge color={mcolor} pill style={tableItem.style}>{item[column.field]}</Badge>
    } else if (tableItem.fieldType == "Badge") {
      let mcolor = self.getColorFromOptions(tableItem.options, item[column.field]);
      return <Badge color={mcolor} pill style={tableItem.style}>{item[column.field]}</Badge>
    } else if (tableItem.fieldType == "Role") {
      let mcolor = self.getColorFromOptions(tableItem.options, item[column.field]);
      return <Badge color={mcolor} style={tableItem.style}>{item[column.field]}</Badge>
    } else if (tableItem.fieldType === "icon") {
      let mcolor = self.getColorFromOptions(tableItem.options, item[column.field]);
      let tooltip = self.getTooltipFromOtptions(tableItem.options, item[column.field]);
      return <FontAwesomeIcon
        style={{ color: mcolor, cursor: tooltip ? 'pointer' : '' }}
        color='white'
        icon={tableItem.iconName}
        data-toggle="tool-tip"
        title={tooltip}
      />
    } else if (tableItem.fieldType === "Array") {
      let val = this.flattenArray(item[column.field]);
      return <span style={tableItem.style} title={val}>
        {val}
      </span>
    } else if (tableItem.fieldType === "Complex") {
      let data = this.ObjectbyString(item, column.field)
      return <span>
        {data}
      </span>
    } else if (tableItem.fieldType == "Actions") {
      return (
        <div className='row'
          style={{ justifyContent: 'center' }}>
          <div>
            {(this.props.preview) ? <FontAwesomeIcon
              className='genderIconAlignment'
              color='#17a2b8'
              icon='file'
              data-toggle="tool-tip"
              title='Preview'
              style={{ color: '#17a2b8', width: '15', cursor: 'pointer', marginRight: 9 }}
              onClick={() => this.openPreviewModal(item)} /> : ''}
            {(this.props.editRequired) ? <FontAwesomeIcon
              className='genderIconAlignment'
              color='white'
              icon='edit'
              data-toggle="tool-tip" title="Edit"
              style={{ color: '#024a88', width: '15', cursor: 'pointer' }}
              onClick={() => this.openFormModal(item, 'edit')} /> : ''}
            {(this.props.deleteRequired) ?
              <FontAwesomeIcon
                className='genderIconAlignment'
                color='white'
                icon='trash-alt'
                data-toggle="tool-tip"
                title="Delete"
                style={{ color: '#bf1725', width: '13', marginLeft: 10, cursor: 'pointer' }}
                onClick={() => this.setDeleteRecords(item, "Delete")} />
              : null}
          </div>
          {/* } */}
        </div >
      )
    } else if (tableItem.fieldType == "relateAutoComplete") {
      if (tableItem.isMultiple) {
        let data = ""
        if (tableItem.searchField && item[column.field] && item[column.field].length > 0) {
          for (let obj of item[column.field]) {
            data = obj[tableItem.searchField] + "," + data
          }
        }
        return <span style={tableItem.style} title={data} >
          {data}
        </span >
      } else {
        return tableItem.searchField && item[column.field] && item[column.field][tableItem.searchField] ?
          <span style={tableItem.style} title={item[column.field][tableItem.searchField]} >
            {item[column.field][tableItem.searchField]}
          </span >
          : null;
      }

    } else if (tableItem.fieldType == "RACSubField") {
      return tableItem.parentField && item[tableItem.parentField] && item[tableItem.parentField][tableItem.subFieldName] ?
        <span style={tableItem.style} title={item[tableItem.parentField][tableItem.subFieldName]} >
          {item[tableItem.parentField][tableItem.subFieldName]}
        </span >
        : null;
    } else {
      // if (item[column.field] === 0) {
      //   return item[column.field];
      // }
      if ((item[column.field]) && typeof item[column.field] !== 'object') {
        return <span style={tableItem.style} title={item[column.field]} >
          {item[column.field]}
        </span >
      }
    }
  }
  clickConfirm() {
    this.closeConfirmationModal();
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
  rowClassName(item) {
    if (item.status === 'Blocked') {
      return (
        { 'p-highlightRow': (item.status === 'Blocked') }
      )
    }
  }
  openPreviewModal = async (item) => {
    this.setState({
      isPreviewModal: true,
      emailTemplateData: item ? item : item
    })
  }
  closePreviewModal = () => {
    this.setState({
      isPreviewModal: false,
      emailTemplateData: ''
    })
  }
  closeSendEmailModal = () => {
    this.setState({
      openSendEmailModal: false,
      actions: '',
    })
  }
  handleDateInterval(startDate, endDate) {
    if (startDate) {
      this.setState({
        startDate: startDate
      })
    }
    if (endDate) {
      this.setState({
        endDate: endDate
      })
    }
  }
  // ShowHideColumns Button Click Handler
  //Settings Modal open
  openShowHideColumnsModal = () => {
    this.setState({
      isOpenShowHideColumnsModal: true,
    })
  }
  getSettings = async () => {
    this.props.getSettings();
  }

  // Called When Clicked on Cancel or Confirm in ShowHideColumnsModal
  closeShowHideColumnsModal = async (type, columnFields, changedTableFields) => {
    if (type && type === 'confirm' && columnFields) {
      let updatedOrder = [];
      let fields = [...changedTableFields];

      this.setState({
        isOpenShowHideColumnsModal: false,
      })
      if (this.state.viewType === 'grid') {
        fields.map(async item => {
          Object.entries(columnFields).forEach(async ([key, value]) => {
            if (item.field === key) {
              return item.mobile = value;
            }
          });
        })
      }
      if (this.state.viewType === 'list') {
        fields.map(async item => {
          Object.entries(columnFields).forEach(async ([key, value]) => {
            if (item.field === key) {
              return item.show = value;
            }
          });
        })
      }
      fields.map(async col => {
        updatedOrder.push(
          {
            field: col.field,
            show: col.show,
            header: col.header,
            displayInSettings: col.displayInSettings,
            mobile: col.mobile,
            label: col.label?col.label:col.header
          }
        )
      });

      localStorage.setItem(`${this.props.type}_column_order`, JSON.stringify(updatedOrder));
      await this.getTableFieldsOrder(this.state.originalTableFields);
    } else if (type && type === 'confirm') {
      let fields = [...changedTableFields];
      this.setState({
        isOpenShowHideColumnsModal: false,
      })
      localStorage.setItem(`${this.props.type}_column_order`, JSON.stringify(fields));

      await this.getTableFieldsOrder(this.state.originalTableFields);
    } else {
      this.setState({
        isOpenShowHideColumnsModal: false,
      })
    }
  }
  searchInDateRange() {
    if (this.state.startDate && this.state.endDate) {
      let filterCriteria = {};
      let startDate = (moment(this.state.startDate).format(config.dateDayMonthFormat));
      let endDate = (moment(this.state.endDate).format(config.dateDayMonthFormat));
      filterCriteria['limit'] = 20;
      filterCriteria['page'] = 1;
      filterCriteria['criteria'] = [
        {
          'key': 'date',
          'value': startDate,
          'type': 'gte'
        },
        {
          'key': 'date',
          'value': endDate,
          'type': 'eq'
        }];
      this.setState({ filterCriteria: filterCriteria });
      this.getDataFromServer(filterCriteria);
    } else {
      alert('no dates selected');
    }
  }
  toggle = async (id) => {
    let openId = this.state.openId;
    this.setState({ openId: openId == id ? '' : id });
  }

  print = () => {
    window.print();
  }
  toogleMultiSelect = async () => {
    await this.setState({
      showMultiSelectDropDown: !this.state.showMultiSelectDropDown
    })
  }
  onGlobalSearchChange = async (e) => {
    let suggestions = this.state.suggestions;
    suggestions[0] = { "label": `Search By First Name ${e.query}` }
    await this.setState({ suggestions: suggestions })

  }
  getScreenHeader() {
    const { t } = this.props;
    return (
      // <div className="row">
      //   {/* global Search */}
      //   <div className='col-6'>
      //   </div>
      //   <div className='col-6'>
      //     <div className='serachAlignment float-right' >
      //       <div className="p-inputgroup">
      //         <span className="p-inputgroup-addon">
      //           <i className="pi pi-search" ></i>
      //         </span>
      //         <InputText
      //           type="search"
      //           name='globalSearch'
      //           onChange={(e) => this.onFilterChange(e)}
      //           placeholder={this.props.globalSearch ? this.props.globalSearch : 'search'}
      //           size="30" />
      //       </div>
      //     </div>
      //   </div>
      // </div >

      <div>

        <h4><span className='postionRelative pt-2'>
          <b
          ><a onClick={()=>this.closeFormModal}>
          {t(this.props.type)}
        </a>{this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? ` / ${this.state.formType} ` : null}
          </b>
        </span>
        </h4>
        <div className="row">
          {/* global Search */}
          <div className={(this.props.dateSearchRequired) ? "col-9" : 'col-6'}>
            {(this.props.dateSearchRequired) ?
              <div className='row'>
                <RenderIntervalDatePickerField handleDateValueInParent={this.handleSearchDateInterval}>
                </RenderIntervalDatePickerField>
                <Button className="col-sm-2 mb-0" color="primary" onClick={this.searchInDateRanges}>{t('dataTable.table_head.search')}</Button>
              </div>
              : null}
          </div>
          {!this.state.isOpenFormModal && this.props.globalSearch ?
            <div className={(this.props.dateSearchRequired) ? "col-3" : 'col-6'}>
              <div className='serachAlignment float-right' >
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    < i className="pi pi-search" ></i >
                  </span>
                  <InputText
                    type="search"
                    name='globalSearch'
                    id='globalSearch'
                    value={this.state['globalSearch']}
                    onChange={(e) => this.onFilterChange(e)}
                    placeholder={this.props.globalSearch ? (this.props.globalSearch) : 'search'}
                    size="25" />
                </div>
              </div>
            </div> : null
          }
        </div >
        <div className='row'>
          {/* global Search */}
          <div className='col-sm-12'>

            {/* {this.props.dateSearchRequired ? < span >
              <div >
                <RenderIntervalDatePickerField handleDateValueInParent={this.handleSearchDateInterval}>
                </RenderIntervalDatePickerField>
                <Button className="col-sm-2 mb-0" color="primary" onClick={this.searchInDateRanges}>Search</Button>
              </div>
            </span> : null}
            <span className='float-right pl-3 '>
              {!this.state.isOpenFormModal && this.props.globalSearch && <div>
                <div
                  className="p-inputgroup"
                >
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-search" ></i>
                  </span>
                  <InputText
                    type="search"
                    name='globalSearch'
                    id='globalSearch'
                    value={this.state['globalSearch']}
                    onChange={(e) => this.onFilterChange(e)}
                    placeholder={this.props.globalSearch ? t(this.props.globalSearch) : t('Search')}
                    size="30" />
                </div>
              </div>}
            </span> */}

          </div>
          <div className='col-12  pb-1'>
            <span className='float-right pt-2'>
              <div className='col-12 px-0 pb-1'>
                {!this.state.isOpenFormModal && config.paginationPosition == 'top' ? this.getPaginator() : null}
              </div>
            </span>
            <span className='pt-2'>
              {/* Export to csv */}
              <span className='float-left pt-2' >
                {this.props.filterRequired ? <span className='mr-3' ref={this.closeMultiSelectDropdown}>
                  <span className='multiSelectDropDownCard '>
                    <span onClick={this.toogleMultiSelect}>
                      {t('Filters')}
                    </span>
                    <span onClick={this.toogleMultiSelect}>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className='ml-1'
                        color='grey'
                      />
                    </span>
                    {
                      this.state.showMultiSelectDropDown ?
                        <Card className=' itemsWarperCard' >
                          {
                            this.state.tablefieldsToShow && this.state.tablefieldsToShow.length > 0 ? this.state.tablefieldsToShow.map((item, index) => {
                              return (
                                item.displayInFilter && item.show && < div >
                                  <p className='multiSelectDropDownCardUl'>{t(item.header)}</p>
                                  <ul className='pl-0'>
                                    {
                                      item.options && item.options.length > 0 ? item.options.map((optionsItem, optinsIndex) => {
                                        return (
                                          <div className='multiSelectWrapperItems' onClick={() => this.changeCheckIcon(index, optinsIndex, item.field, optionsItem.value)}>
                                            <span className='chekcIconAdjust'>
                                              <Checkbox
                                                // onChange={e => setChecked(e.checked)}
                                                checked={optionsItem.checkIcon}>
                                              </Checkbox>
                                              {/* <FontAwesomeIcon
                                                icon='check'
                                                color={optionsItem.checkIcon ? 'grey' : 'white'}
                                              /> */}
                                            </span>
                                            <span className='chekcIconAdjustLabel'>
                                              {t(optionsItem.label)}
                                            </span>
                                          </div>
                                        )
                                      }) : null
                                    }
                                  </ul>
                                  <hr className='my-0'></hr>
                                </div>
                              )
                            }) : null
                          }
                        </Card>
                        : null}
                  </span>

                </span> : null}
                {/* {!this.state.isOpenFormModal ? <MultiSelect
                  style={{
                    lineHeight: 0,
                    position: 'relative',
                    top: 4,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 1,
                    paddingRight: 1,
                  }}
                  appendTo={document.body}
                  className='mr-3'
                  name='multiActions'
                  placeholder={'Filters'}
                  maxSelectedLabels={2}
                  selectedItemsLabel='Aldfdefel'
                  value={this.state['multiActions'] ? this.state['multiActions'] : null}
                  options={this.props.actionsTypes}
                  onChange={(e) => this.onFilterChange(e, 'dropdownFilter')}
                /> : null} */}

                {!this.state.isOpenFormModal && this.state.actionsTypes && this.state.actionsTypes.length > 0 ? <Dropdown
                  style={{ minWidth: '10%', lineHeight: 1.3, marginTop: '2px' }}
                  className='mr-3'
                  // appendTo={document.body}
                  name='actions'
                  value={this.state.actions}
                  disabled={this.state.selectedRows && this.state.selectedRows.length > 0 ? false : true}
                  options={this.state.actionsTypes}
                  placeholder={t('Actions')}
                  onChange={(e) => this.onActionsChange(e, 'dropdownFilter')}
                /> : null}

                {!this.state.isOpenFormModal && this.props.printRequried ?
                  <Button color="primary"
                    size="sm"
                    className="p-1 ml-auto  mb-0 mt-1"
                    onClick={() => this.print()}
                  >
                    <FontAwesomeIcon
                      icon='print'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Print")}
                      onClick={() => this.print()}
                    />
                  </Button>
                  : null}
                {!this.state.isOpenFormModal && this.props.exportRequired && <Button color="primary"
                  className='p-1 ml-auto mb-0 mt-1'
                  size={'sm'} onClick={this.getDataToExport}>
                  <FontAwesomeIcon
                    icon='file'
                    data-toggle="tool-tip" title={t("Export To CSV")}
                    className='pl-1' size='lg' />
                </Button>}
                {!this.state.isOpenFormModal && this.props.exportRequired && <CSVLink
                  data={this.state.exportData}
                  filename={`${this.props.type}.csv`}
                  className="hidden text-white"
                  ref={(r) => this.csvLinkRef = r}
                  target="_blank" >
                </CSVLink>}
                {!this.state.isOpenFormModal && this.props.sample ?
                  <Button color="primary"
                    size="sm"
                    className="p-1 mt-1 mb-0"
                    onClick={() => this.bulkUploadMoadal()}>
                    <FontAwesomeIcon
                      icon='upload'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Bulk Upload")}
                      onClick={() => this.bulkUploadMoadal()} />
                  </Button>
                  : null}

                {!this.state.isOpenFormModal && this.props.gridRequried ? <ButtonGroup className='mb-0 mr-3'>
                  <Button color="primary"
                    outline={this.state.viewType === 'grid' ? false : true}
                    size="sm"
                    className="p-1 ml-auto mt-1 mb-0"
                    onClick={() => this.changeViewType('grid')}
                  >
                    <FontAwesomeIcon
                      icon='grip-horizontal'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Grid")}
                      onClick={() => this.changeViewType('grid')}
                    />
                  </Button>
                  <Button color="primary"
                    size="sm"
                    outline={this.state.viewType === 'list' ? false : true}
                    className="p-1 ml-auto mt-1 mb-0"
                    onClick={() => this.changeViewType('list')}
                  >
                    <FontAwesomeIcon
                      icon='list'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("List")}
                      onClick={() => this.changeViewType('list')}
                    />
                  </Button>
                </ButtonGroup> : null}

                {!this.state.isOpenFormModal && this.props.settingsRequired ? <Button color="primary"
                  size="sm"
                  className="p-1 ml-auto mt-1 mb-0"
                  onClick={() => this.openShowHideColumnsModal()}
                >
                  <FontAwesomeIcon
                    icon='cog'
                    className='pl-1' size='lg'
                    data-toggle="tool-tip" title={t("Settings")}
                    onClick={() => this.openShowHideColumnsModal()}
                  />
                </Button> : null}

                {/* Add button */}
                {this.props.addRequired && !this.state.isOpenFormModal ?
                     <a href={`/create_${this.props.routeTo}`}  > 
                     <Button color="primary"
                        size="sm"
                        className="p-1 ml-auto mt-1 mb-0"
                          // onClick={() => this.openFormModal('add')}
                        >
                        <FontAwesomeIcon
                          icon='plus'
                          className='pl-1' size='lg'
                          data-toggle="tool-tip" title={t("Add")}
                          // onClick={() =>   this.openFormModal('add')}
                        />
                      </Button>
                      </a>
                  : null}

                {/* priority  in Issues*/}
                {!this.state.isOpenFormModal && <Button
                  color="secondary"
                  size="sm"
                  // className="p-1 ml-auto"
                  className={this.props.addRequired ? "p-1 mt-1 mb-0" : 'p-1 ml-auto mt-1 mb-0'}
                  onClick={() => this.getDataFromServer(this.state.filterCriteria, 'refresh')}>
                  <FontAwesomeIcon
                    icon='sync-alt'
                    size='lg'
                    data-toggle="tool-tip" title={t("Refresh")}
                    color={config.templateColor}
                    className='refreshIcon pl-1' />
                </Button>}
              </span>
            </span>
          </div>
        </div>

      </div >
    )
  }
  onGlobalSerachFilterChange = async (event) => {
    if (event) {
      await this.setState({
        [event.target.name]: event.target.value
      })
      await this.onFilterChange(event)
    }

  }
  getHeader() {
    const { t } = this.props;
    return (
      // <div className="row">
      //   {/* global Search */}
      //   <div className='col-6'>
      //   </div>
      //   <div className='col-6'>
      //     <div className='serachAlignment float-right' >
      //       <div className="p-inputgroup">
      //         <span className="p-inputgroup-addon">
      //           <i className="pi pi-search" ></i>
      //         </span>
      //         <InputText
      //           type="search"
      //           name='globalSearch'
      //           onChange={(e) => this.onFilterChange(e)}
      //           placeholder={this.props.globalSearch ? this.props.globalSearch : 'search'}
      //           size="30" />
      //       </div>
      //     </div>
      //   </div>
      // </div >

      <div>
        <h4><span className='postionRelative pt-2'>
          <b
          ><a onClick={()=> this.closeFormModal} >
          {t(this.props.type)}
        </a>{this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? ` / ${this.state.formType} ` : null}
          </b>
        </span>
        </h4>
        <div className="row">
          {/* global Search */}
          <div className={(this.props.dateSearchRequired) ? "col-9" : 'col-6'}>
            {(this.props.dateSearchRequired) ?
              <div className='row'>
                <RenderIntervalDatePickerField handleDateValueInParent={this.handleSearchDateInterval}>
                </RenderIntervalDatePickerField>
                <Button className="col-sm-2 mb-0" color="primary" onClick={this.searchInDateRanges}>{t('dataTable.table_head.search')}</Button>
              </div>
              : null}
          </div>
          {this.props.globalSearch ?
            <div className={(this.props.dateSearchRequired) ? "col-3" : 'col-6'}>
              <div className='serachAlignment float-right' >
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    < i className="pi pi-search" ></i >
                  </span>
                  <InputText
                    type="search"
                    name='globalSearch'
                    id='globalSearch'
                    value={this.state['globalSearch']}
                    onChange={(e) => this.onFilterChange(e)}
                    placeholder={this.props.globalSearch ? (this.props.globalSearch) : 'search'}
                    size="25" />
                </div>
              </div>
            </div> : null
          }
        </div >
        <div className='row'>
          {/* global Search */}
          <div className='col-sm-12'>
            {/* <h4 >
              <span className='postionRelative pt-2'>
                <b
                ><Link to={(this.props.routeTo)} onClick={this.closeFormModal}>
                    {t(this.props.type)}
                  </Link>{this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? ` / ${this.state.formType} ` : null}
                </b>
              </span>
              {this.props.dateSearchRequired ? < span >
                <div >
                  <RenderIntervalDatePickerField handleDateValueInParent={this.handleSearchDateInterval}>
                  </RenderIntervalDatePickerField>
                  <Button className="col-sm-2 mb-0" color="primary" onClick={this.searchInDateRanges}>Search</Button>
                </div>
              </span> : null}
              <span className='float-right pl-3 '>
                {this.props.globalSearch && <div>
                  <div
                    className="p-inputgroup"
                  >
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-search" ></i>
                    </span>
                    <InputText
                      type="search"
                      name='globalSearch'
                      id='globalSearch'
                      value={this.state['globalSearch']}
                      onChange={(e) => this.onFilterChange(e)}
                      placeholder={this.props.globalSearch ? (this.props.globalSearch) : 'search'}
                      size="30" />

                  

                  </div>
                </div>}
              </span>
            </h4> */}
          </div>
          <div className='col-12  pb-1'>
            <span className='float-right pt-2'>
              <div className='col-12 px-0 pb-1'>
                {config.paginationPosition == 'top' ? this.getPaginator() : null}
              </div>
            </span>
            <span className='pt-2'>
              {/* Export to csv */}
              <span className='float-left pt-2' >
                {this.props.filterRequired ?
                  <span className='mr-3' ref={this.closeMultiSelectDropdown}>
                    <span className='multiSelectDropDownCard '>
                      <span onClick={this.toogleMultiSelect}>
                        {t('Filters')}
                      </span>
                      <span onClick={this.toogleMultiSelect}>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className='ml-1'
                          color='grey'
                        />
                      </span>
                      {
                        this.state.showMultiSelectDropDown ?
                          <Card className=' itemsWarperCard' >
                            {
                              this.state.tablefieldsToShow && this.state.tablefieldsToShow.length > 0 ? this.state.tablefieldsToShow.map((item, index) => {
                                return (
                                  item.displayInFilter && item.show && < div >
                                    <p className='multiSelectDropDownCardUl'>{t(item.header)}</p>
                                    <ul className='pl-0'>
                                      {
                                        item.options && item.options.length > 0 ? item.options.map((optionsItem, optinsIndex) => {
                                          return (
                                            <div className='multiSelectWrapperItems' onClick={() => this.changeCheckIcon(index, optinsIndex, item.field, optionsItem.value)}>
                                              <span className='chekcIconAdjust'>
                                                <Checkbox
                                                  // onChange={e => setChecked(e.checked)}
                                                  checked={optionsItem.checkIcon}>
                                                </Checkbox>
                                                {/* <FontAwesomeIcon
                                           icon='check'
                                           color={optionsItem.checkIcon ? 'grey' : 'white'}
                                         /> */}
                                              </span>
                                              <span className='chekcIconAdjustLabel'>
                                                {t(optionsItem.label)}
                                              </span>
                                            </div>
                                          )
                                        }) : null
                                      }
                                    </ul>
                                    <hr className='my-0'></hr>
                                  </div>
                                )
                              }) : null
                            }
                          </Card>
                          : null}
                    </span>

                  </span>
                  : null}


                {/* {!this.state.isOpenFormModal ? <MultiSelect
                  style={{
                    lineHeight: 0,
                    position: 'relative',
                    top: 4,
                    paddingTop: 9,
                    paddingBottom: 9,
                    paddingLeft: 1,
                    paddingRight: 1,
                  }}
                  appendTo={document.body}
                  className='mr-3'
                  name='multiActions'
                  placeholder={'Filters'}
                  maxSelectedLabels={2}
                  selectedItemsLabel='Aldfdefel'
                  value={this.state['multiActions'] ? this.state['multiActions'] : null}
                  options={this.props.actionsTypes}
                  onChange={(e) => this.onFilterChange(e, 'dropdownFilter')}
                /> : null} */}

                <Dropdown
                  style={{ minWidth: '10%', lineHeight: 1.3, marginTop: '2px' }}
                  className='mr-3'
                  // appendTo={document.body}
                  name='actions'
                  value={this.state.actions}
                  disabled={this.state.selectedRows && this.state.selectedRows.length > 0 ? false : true}
                  options={this.state.actionsTypes}
                  placeholder={t('Actions')}
                  onChange={(e) => this.onActionsChange(e, 'dropdownFilter')}
                />

                {this.props.printRequried ?
                  <Button color="primary"
                    size="sm"
                    className="p-1 ml-auto  mb-0 mt-1"
                    onClick={() => this.print()}
                  >
                    <FontAwesomeIcon
                      icon='print'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Print")}
                      onClick={() => this.print()}
                    />
                  </Button>
                  : null}
                {this.props.exportRequired && <Button color="primary"
                  className='p-1 ml-auto mb-0 mt-1'
                  size={'sm'} onClick={this.getDataToExport}>
                  <FontAwesomeIcon
                    icon='file'
                    data-toggle="tool-tip" title={t("Export To CSV")}
                    className='pl-1' size='lg' />
                </Button>}
                {this.props.exportRequired && <CSVLink
                  data={this.state.exportData}
                  filename={`${this.props.type}.csv`}
                  className="hidden text-white"
                  ref={(r) => this.csvLinkRef = r}
                  target="_blank" >
                </CSVLink>}
                {this.props.sample ?
                  <Button color="primary"
                    size="sm"
                    className="p-1 mt-1 mb-0"
                    onClick={() => this.bulkUploadMoadal()}>
                    <FontAwesomeIcon
                      icon='upload'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Bulk Upload")}
                      onClick={() => this.bulkUploadMoadal()} />
                  </Button>
                  : null}

                {this.props.gridRequried && <ButtonGroup className='mb-0 mr-3'>
                  <Button color="primary"
                    outline={this.state.viewType === 'grid' ? false : true}
                    size="sm"
                    className="p-1 ml-auto mt-1 mb-0"
                    onClick={() => this.changeViewType('grid')}
                  >
                    <FontAwesomeIcon
                      icon='grip-horizontal'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("Grid")}
                      onClick={() => this.changeViewType('grid')}
                    />
                  </Button>
                  <Button color="primary"
                    size="sm"
                    outline={this.state.viewType === 'list' ? false : true}
                    className="p-1 ml-auto mt-1 mb-0"
                    onClick={() => this.changeViewType('list')}
                  >
                    <FontAwesomeIcon
                      icon='list'
                      className='pl-1' size='lg'
                      data-toggle="tool-tip" title={t("List")}
                      onClick={() => this.changeViewType('list')}
                    />
                  </Button>
                </ButtonGroup>}
                {this.props.settingsRequired && <Button color="primary"
                  size="sm"
                  className="p-1 ml-auto mt-1 mb-0"
                  onClick={() => this.openShowHideColumnsModal()}
                >
                  <FontAwesomeIcon
                    icon='cog'
                    className='pl-1' size='lg'
                    data-toggle="tool-tip" title={t("Settings")}
                    onClick={() => this.openShowHideColumnsModal()}
                  />
                </Button>}

                {/* Add button */}
                {this.props.addRequired ?
                  <a href={`/create_${this.props.routeTo}`} >
                    <Button color="primary"
                      size="sm"
                      className="p-1 ml-auto mt-1 mb-0"
                    // onClick={() => this.openFormModal('add')}
                    >
                      <FontAwesomeIcon
                        icon='plus'
                        className='pl-1' size='lg'
                        data-toggle="tool-tip" title={t("Add")}
                      // onClick={() => this.openFormModal('add')}
                      />
                    </Button></a>
                  : null}

                {/* priority  in Issues*/}
                <Button
                  color="secondary"
                  size="sm"
                  // className="p-1 ml-auto"
                  className={this.props.addRequired ? "p-1 mt-1 mb-0" : 'p-1 ml-auto mt-1 mb-0'}
                  onClick={() => this.getDataFromServer(this.state.filterCriteria, 'refresh')}>
                  <FontAwesomeIcon
                    icon='sync-alt'
                    size='lg'
                    data-toggle="tool-tip" title={t("Refresh")}
                    color={config.templateColor}
                    className='refreshIcon pl-1' />
                </Button>

              </span>
            </span>
          </div>
        </div>

      </div >
    )
  }
  getCardHeader() {
    return (
      // <CardHeader className='cardHeader'>
      <div className="row m-0">
        {/* table name */}
        <div className='col-3 pl-0 pt-2'>
          <h4><b>{this.props.type}{this.props.type == 'Activiti' ? 'es' : ''}</b></h4>
        </div>
        <span className='col-9 text-right'>
          <Row>
            {/* Export to csv */}
            {/* <Button color="primary"
                    className='p-1 ml-auto'
                    size={'sm'} onClick={this.getDataToExport}>
                    <FontAwesomeIcon
                      icon='file'
                      data-toggle="tool-tip" title="Export To CSV"
                      className='pl-1' size='lg' />
                  </Button>
                  <CSVLink
                    data={this.state.exportData}
                    filename={`${this.props.type}.csv`}
                    className="hidden text-white"
                    ref={(r) => this.csvLinkRef = r}
                    target="_blank" >
                  </CSVLink> */}
            {/* {this.props.sample ?
              <Button color="primary"
                size="sm"
                className="p-1"
                onClick={this.bulkUploadMoadal}>
                <FontAwesomeIcon
                  icon='upload'
                  className='pl-1' size='lg'
                  data-toggle="tool-tip" title="Bulk Upload"
                  onClick={this.bulkUploadMoadal} />
              </Button>
              : null} */}
            {/* Add Settings Button */}
            {this.props.settingsRequired ?
              <Button color="primary"
                size="sm"
                className="p-1 ml-auto mt-1"
                onClick={() => this.openShowHideColumnsModal()}
              >
                <FontAwesomeIcon
                  icon='cog'
                  className='pl-1' size='lg'
                  data-toggle="tool-tip" title="Settings"
                  onClick={() => this.openShowHideColumnsModal()}
                />
              </Button>
              : null}
            {/* Add button */}
            {this.props.addRequired ?
              <a href={`/create_${this.props.routeTo}`} >
                <Button color="primary"
                  size="sm"
                  className="p-1 ml-auto"
                // onClick={() => this.openFormModal('add')}
                >
                  <FontAwesomeIcon
                    icon='plus'
                    className='pl-1' size='lg'
                    data-toggle="tool-tip" title="Add"
                  //  onClick={() => this.openFormModal('add')}
                  />
                </Button></a>
              : null}
            {/* priority  in Issues*/}
            <Button
              color="secondary"
              size="sm"
              // className="p-1 ml-auto"
              className={this.props.addRequired ? "p-1" : 'p-1 ml-auto'}
              onClick={() => this.getDataFromServer(this.state.filterCriteria, 'refresh')}>
              <FontAwesomeIcon
                icon='sync-alt'
                size='lg'
                data-toggle="tool-tip" title="Refresh"
                color={config.templateColor}
                className='refreshIcon pl-1' />
            </Button>
          </Row>
        </span>

      </div>
      // </CardHeader>
    )
  }
  cancelUserPwdResetModal = async () => {
    await this.setState({
      openUserPasswordResetModal: false,
      actions: ''
    })
  }
  handleSearchDateInterval = (startDate, endDate) => {
    if (startDate) {
      this.setState({ startDate: startDate })
    }
    if (endDate) {
      this.setState({ endDate: endDate })
    }
  }

  searchInDateRanges = () => {
    if (this.state.startDate && this.state.endDate) {
      let filterCriteria = {};
      let startDate = (moment(this.state.startDate).format('YYYY-MM-DD'));
      let endDate = (moment(this.state.endDate).format('YYYY-MM-DD'));
      filterCriteria['limit'] = 20;
      filterCriteria['page'] = 1;
      filterCriteria['criteria'] = [
        { 'key': this.state.searchInDateRangeField, 'value': startDate, 'type': 'gte' },
        { 'key': this.state.searchInDateRangeField, 'value': endDate, 'type': 'lte' }];
      // this.setState({ filterCriteria: filterCriteria });
      this.getDataFromServer(filterCriteria);
    }
    else {
      alert('no dates selected');
    }
  }

  getColumns(e, d) {
    const { t } = this.props
    const self = this;
    self.e = e;
    self.d = d;
    if (this.state.tablefieldsToShow && this.state.tablefieldsToShow.length > 0) {
      return this.state.tablefieldsToShow.map((item, i) => {
        let column = (item.show &&
          <Column key={item.field + i}
            style={{
              maxwidth: item.width,
              padding: 2,
            }}
            bodyStyle={item.capitalizeTableText ? {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textTransform: 'capitalize',
              textAlign: item.field == 'status' || item.field == 'role' ? 'center' : item.textAlign
            } : {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: item.field == 'status' || item.field == 'role' ? 'center' : item.textAlign
            }}
            field={item.field}
            editRequired={self.e}
            deleteRequired={self.d}
            header={t(item.header)}
            changeFieldName={item.changeFieldName}
            body={self.changeFieldValues}
            headerStyle={{
              padding: 4, fontWeight: 500, width: item.width, fontSize: 13,
              // color: config.whiteColor, backgroundColor: config.templateColor
            }}
            filter={item.filter ? item.filter : false}
            sortable={item.sortable ? true : false}
            filterPlaceholder={item.placeholder ? item.placeholder : 'search'}
            filterElement={item.filterElement && item["type"] == "dropDown" ?
              <div style={{ height: 26 }}>
                <MultiSelect style={{ width: '85%', lineHeight: 1.15, height: '25px' }}
                  appendTo={document.body}
                  name={item.field}
                  placeholder={item.placeholder}
                  maxSelectedLabels={2}
                  // selectedItemsLabel='Aldfdefel'
                  value={this.state[item.field] ? this.state[item.field] : item.defaultValues ? item.defaultValues : null}
                  options={item.filterElement}
                  onChange={(e) => this.onFilterChange(e, 'dropdownFilter')} />
                {/* <Dropdown
                  style={{ minWidth: '10%', lineHeight: 1.1 }}
                  appendTo={document.body}
                  name={item.field}
                  value={this.state[item.field]}
                  options={item.filterElement}
                  onChange={(e) => this.onFilterChange(e, 'dropdownFilter')} /> */}
              </div>
              : item["type"] == "date" ? <div style={{ height: 26 }}>
                <Calendar style={{ zindex: 1004, width: '100%', lineHeight: 1.15, height: '25px' }}
                  appendTo={document.body}
                  name={item.field}
                  value={this.state[item.field]}
                  autoZIndex={true} baseZIndex={0}
                  selectionMode="range"
                  onChange={(e) => this.onFilterChange(e, 'date')}></Calendar>
              </div> : null
            }
            selectionMode={item.selectionMode}
          />
        )

        return column;
      })
    }

  }

  getDataTable() {
    let self = this;
    self.editRequired = this.props.editRequried;
    self.deleteRequired = this.props.deleteRequried;

    return (
      <DataTable
        rowClassName={this.rowClassName}
        ref={(el) => this.dt = el}
        value={this.state.allUsersData}
        // header={this.getHeader()}
        totalRecords={this.state.totalRecordsLength}
        paginator={false}
        lazy={true}
        resizableColumns={true}
        columnResizeMode="expand"
        onSort={this.sortChange}
        globalFilter={this.state.globalFilter}
        onFilter={this.onFilterChange}
        scrollable={true}
        // selection={false}
        onSelectionChange={e => this.onSelectRowsUpdate(e)}
        scrollHeight='1000px'
        // style={{ marginTop: 0 }}
        emptyMessage={configMessages.noRecords}
        sortMode="single"
        // sortField="fname"
        // sortOrder={-1}
        selection={this.state.selectedRows}
        // selectionMode={'multiple'}
        metaKeySelection={false}
        loading={this.state.isLoading}
        style={this.state.allUsersData && this.state.allUsersData.length == 0 ?
          { textAlign: 'center' }
          : null}
      >
        {self.getColumns(self.editRequired, self.deleteRequired)}
      </DataTable>
    )
  }
  getTabInfo() {
    //console.log('from datatable  getTabinfo');
    return null;
  }

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

  //getGridView
  getGridView() {
    console.log(this.state.allUsersData)
    console.log(this.state.tablefieldsToShow)
    return (
      <div className='row   ml-lg-0 pr-1'>
        {
          this.state.allUsersData && this.state.allUsersData.length > 0 ?
            this.state.allUsersData.map((item, i) => {
              return (
                <div className='col-sm-6 col-md-4 col-lg-3 px-1' key={i}>
                  <Card className='pb-2' >
                    <CardBody className='tableCardBody'>
                      {
                        this.state.tablefieldsToShow && this.state.tablefieldsToShow.length && this.state.tablefieldsToShow.length > 0 ?
                          this.state.tablefieldsToShow.map((elememt, index) => {
                            return (
                              <div className={(elememt.displayInSettings === true) ? `col-12  ` : 'd-none'} key={index}>
                                <div >
                                  {/* {this.changeFieldValues(item, element)} */}
                                  {
                                    elememt.fieldType === 'Link' ?
                                      <div className='d-flex'>
                                        <span
                                          style={elememt.style}
                                          onClick={() => this.openViewModal(item, 'view')}>
                                          <b> {item[elememt.field]}</b>
                                        </span>
                                      </div>
                                      :
                                      elememt.fieldType === 'Badge' ?
                                        <div style={elememt.style}>
                                          <Badge color={item.status == 'Active' ? 'success' : item.status == 'Inactive' ? 'warning' : item.status == 'Pending' ? 'danger' : item.status == 'Reject' ? 'error' : item.status == 'Completed' ? 'primary' : 'info'}>
                                            {item[elememt.field]}
                                          </Badge>
                                        </div> :
                                        elememt.fieldType === 'Role' ?
                                          <div style={elememt.style}>
                                            <Badge pill
                                              color='success'
                                            >
                                              {item[elememt.field]}
                                            </Badge>
                                          </div>
                                          : elememt.fieldType === 'Date' ?
                                            <div>
                                              {dateFormats.formatDate(item[elememt.field], config.dateDayMonthFormat)}
                                            </div>
                                            : elememt.fieldType === 'Time' ?
                                              <div>
                                                {dateFormats.formatDate(item[elememt.field], config.timeFormat)} - ${dateFormats.formatDate(item['toTime'], config.timeFormat)}
                                              </div>
                                              : elememt.fieldType === 'Array' ?
                                                <span style={element.style}>
                                                  {this.flattenArray(item[elememt.field])}
                                                </span>
                                                : elememt.fieldType === "dropDown" ?
                                                  <div style={elememt.style}>
                                                    {this.getBadgeData(elememt, item[elememt.field])}
                                                  </div> : elememt.fieldType === "relateAutoComplete" ?
                                                    < span style={elememt.style}>
                                                      {item[elememt.field] && elememt.searchField && item[elememt.field][elememt.searchField] ? item[elememt.field][elememt.searchField] : null}
                                                    </span>
                                                    : <div style={elememt.style}>
                                                      <span
                                                      >{item[elememt.field]}</span></div>
                                  }
                                </div>
                              </div>
                            )
                          }) : null
                      }
                    </CardBody>
                  </Card>
                </div>

              )
            }) : null
        }
      </div>
    )
  }
  getBadgeData(element, value) {
    let mcolor = this.getColorFromOptions(element.options, value);
    return (<Badge color={mcolor} pill >{value}</Badge>)
  }

  getTotalCard() {
    //   console.log(this.state.displayViewOfForm)
    if (this.state.viewType === 'list') {
      return (
        <Card className='cardForListMargin' >
          <CardBody className='tableCardBody'>
            {!this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? this.getScreenHeader() : this.state.displayViewOfForm === 'modal' ? this.getHeader() : null}
            {this.getTabInfo()}
            {!this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen'
              ? this.getDataTable() : this.state.displayViewOfForm === 'modal' ? this.getDataTable() : null}
            {this.state.isOpenFormModal ? this.getFormModal() : null}
            {config.paginationPosition == 'bottom' ? this.getPaginator() : null}
          </CardBody>
        </Card>
      )
    } else if (this.state.viewType === 'grid') {
      return (
        <div>
          <Card
            className={' pb-2 cardForGridMargin'}>
            <CardBody className='tableCardBody pb-0'>
              {!this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? this.getScreenHeader() : this.state.displayViewOfForm === 'modal' ? this.getHeader() : null}
              {this.getTabInfo()}
              {this.state.isOpenFormModal ? this.getFormModal() : null}
            </CardBody>
          </Card>
          {!this.state.isOpenFormModal && this.state.displayViewOfForm === 'screen' ? this.getGridView() : this.state.displayViewOfForm === 'modal' ? this.getGridView() : null}
        </div>
      )
    }
  }

  getMobileCard() {
    return (
      <div>
        <Loader loader={this.state.isLoading} />
        {this.state.isOpenFormModal ? null : <div className='row mr-0 ml-0'>
          <div className='col-sm-12 px-0 pb-2'>
            <h4><span className='mobileScreenHaederView'><b >{this.props.type}</b></span>
              <span className='float-right'>
                <Button color="primary"
                  size="sm"
                  className="p-1 ml-auto mt-1 mb-0"
                  onClick={() => this.openShowHideColumnsModal()}
                >
                  <FontAwesomeIcon
                    icon='cog'
                    className='pl-1' size='lg'
                    data-toggle="tool-tip" title="Settings"
                    onClick={() => this.openShowHideColumnsModal()}
                  />
                </Button>
              </span>
            </h4>
          </div>
        </div>}
        {this.state.isOpenFormModal ? this.getMobileForm() : this.getGridView()}
        {!this.state.isOpenFormModal ? <PaginatorComponent
          totalRecords={this.state.totalRecordsLength}
          first={this.state.first}
          rows={this.state.rows}
          onPageChange={this.onPageChange}
          isWeb={false}
        /> : null}
      </div >
    )
  }

  flattenArray = (arrayVal) => {
    let val = '';
    if (arrayVal) {
      val = JSON.stringify(arrayVal);
      val = val.replace(/"/g, '')
        .replace(/\[/g, '')
        .replace(/]/g, '')
        .replace(/{/g, '')
        .replace(/}/g, '')
        .replace(/,/g, ' , ')
        .replace(/:/g, ' : ');
    }
    return val;
  }
  getMobileForm() {
    return (
      <div className='row'>
        <div className='col-sm-12 px-1'>
          <Card className='pb-0'>
            <CardBody className='tableCardBody pb-0'>
              {/* {this.getScreenHeader()} */}
              {this.getFormModal()}
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }
  getFormFields = () => {
    this.formModalRef.getFormFields()
  }
  getFormModal() {
    return (
      <FormModal
        onRef={(ref) => this.formModalRef = ref}
        openFormModal={this.state.isOpenFormModal}
        allUsersData={this.state.allUsersData}
        totalRecords={this.state.totalRecordsLength}
        first={this.state.first}
        rows={this.state.rows}
        closeFormModal={this.closeFormModal}
        closeRejectModal={this.closeRejectModal}
        type={this.props.type}
        tablefieldsToShow={this.state.tablefieldsToShow}
        originalTableFields={this.state.originalTableFields}
        formType={this.state.formType}
        formFields={this.props.formFields}
        getDataFromServer={this.getDataFromServer}
        editRequired={this.props.editRequired}
        getEditInfoKeys={this.props.getEditInfoKeys}
        filterExtension={this.props.filterExtension}
        idNotRequired={this.props.idNotRequired}
        apiUrl={this.props.formUrl ? this.props.formUrl : this.state.apiUrl}
        role={this.state.loginRole}
        tabType={this.state.tabType}
        getDoctorPostingFields={this.props.getDoctorPostingFields}
        categoryNames={this.props.categoryNames}
        companiesList={this.props.companiesList}
        getSettings={this.getSettings}
        filterCriteria={this.state.filterCriteria}
        menuList={this.props.menuList}
        routeTo={this.props.routeTo}
        displayViewOfForm={this.state.displayViewOfForm}
        displayBreadCrumbValue={this.state.displayBreadCrumbValue}
        displayBreadCrumbField={this.state.displayBreadCrumbField}
        userStatus={this.state.userStatus}
        addSelectedRecord={this.props.addSelectedRecord}
        actionsTypes={this.state.actionsTypes}
        entityType={this.props.entityType}
        setFilterCriteriaForActivities={this.setFilterCriteriaForActivities}
        getColorFromOptions={this.getColorFromOptions}
      />
    )
  }

  getViewModal() {
    return (
      <ViewModal
        type={this.props.type}
        openViewModal={this.state.openViewModal}
        displayViewOfForm={this.state.displayViewOfForm}
        rowData={this.state.rowData}
        formFields={this.props.formFields}
        onRef={(ref) => (this.viewModalRef = ref)}
        closeViewModal={this.closeViewModal}
        locationId={this.state.locationId}
        drawers={this.state.drawers}
      />
    )
  }

  getOpenShowHideColumnsModal() {
    return (
      <ShowHideColumnsModal
        viewType={this.state.viewType}
        isOpenShowHideColumnsModal={this.state.isOpenShowHideColumnsModal}
        closeShowHideColumnsModal={this.closeShowHideColumnsModal}
        tableFields={this.state.originalTableFields}
        type={this.props.type}
      />
    )
  }
  getDeleteRowModal() {
    return (
      <DeleteRowModal
        openDeleteModal={this.state.openDeleteModal}
        closeDeleteModal={this.closeDeleteModal}
        selectActions={this.state.selectActions}
        deleteSelectedRow={this.deleteSelectedRow}
        confirmModalText={this.state.confirmModalText}
      />
    )
  }
  getPreviewModal() {
    return (
      <PreviewModal
        isPreviewModal={this.state.isPreviewModal}
        closePreviewModal={this.closePreviewModal}
        emailTemplateData={this.state.emailTemplateData}
        type={this.props.type}
      />
    )
  }
  getSendEMailFields() {
    return ([{
      required: true,
      value: '',
      type: 'text',
      name: 'email',
      label: 'To',
      id: 'email',
      placeholder: 'Email'
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
    }])
  }
  getSendEmailModal() {
    return (
      <SendEmailModal
        onRef={(ref) => this.SendEmailModalRef = ref}
        openSendEmailModal={this.state.openSendEmailModal}
        closeSendEmailModal={this.closeSendEmailModal}
        type={this.props.type}
        item={this.state.selectedRows}
        formFields={this.getSendEMailFields}
        parentFormFields={this.props.formFields()}
        apiUrl={this.props.routeTo}
      />
    )
  }
  getBulkUploadModal() {
    return (
      <BulkUploadModal
        onRef={(ref) => this.bulkUploadMoadalRef = ref}
        bulkApi={this.props.bulkApi}
        type={this.props.type}
        sample={this.props.sample}
        sampleFilePath={this.props.sampleFilePath}
        openBulkUploadModal={this.state.openBulkUploadModal}
        closeBulkModal={this.closeBulkModal}
        reload={this.getDataFromServer}
      />
    )
  }

  getConfirmatioinModal() {
    return (
      <ConfirmationModal
        formType={this.state.formType}
        onRef={(ref) => (this.confirmRef = ref)}
        openConfirmationModal={this.state.openConfirmationModal}
        closeConfirmationModal={this.closeConfirmationModal}
        confirm={this.clickConfirm}
        text={this.state.confirmText}
      />
    )
  }

  getSessionExpiryModal() {
    return (
      <SessionExpiryModal
        SOpen={this.state.sessionExpiryModal}
      />
    )
  }

  render() {
    return (
      <div >
        {this.state.width <= 576 && this.getMobileCard()}
        {this.state.width >= 577 && this.getTotalCard()}
        {this.state.isOpenShowHideColumnsModal ? this.getOpenShowHideColumnsModal() : null}
        {this.state.openDeleteModal ? this.getDeleteRowModal() : null}
        {this.state.openViewModal ? this.getViewModal() : null}
        {this.props.sample ? this.getBulkUploadModal() : null}
        {this.state.openConfirmationModal ? this.getConfirmatioinModal() : null}
        {this.state.sessionExpiryModal ? this.getSessionExpiryModal() : null}
        {this.state.isPreviewModal ? this.getPreviewModal() : null}
        {this.state.redirectToRoute ? <Redirect to={`/${this.props.routeTo}`} /> : null}
        {this.state.openSendEmailModal ? this.getSendEmailModal() : null}
      </div >
    );
  }
}

const mapStateToProps = state => {
  return { articles: state.articles };
};
const List = connect(mapStateToProps)(DataTables);

export default withTranslation('common')(DataTables);
