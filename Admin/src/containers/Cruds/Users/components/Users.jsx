import React from 'react';
import DataTables from '../../CommonDataTable/DataTable';
import config from '../../../../config/config';
import apiCalls from '../../../../config/apiCalls'
import ViewModal from '../../CommonModals/viewModal';
import NewUserModal from '../../CommonModals/NewUserModal';
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';
import FormModal from '../../../Form/FormModal';
import store from '../../../App/store';
import filePath from "../../../../config/configSampleFiles";
import fetchMethodRequest from "../../../../config/service"
import RolePermissions from '../../CommonModals/Permissions';
// config file
export default class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: '',
      rolePermission: "",
      rolesList: [],
      editSelectedRecord: window.location.href.includes("edit"),
      addSelectedRecord: window.location.href.includes("create"),
      viewSelectedRecord: window.location.href.includes("view"),
    };
    this.getRoleListFromServer()
  }

  static getDerivedStateFromProps(props, state) {
    let storeData = store.getState()
    let languageData = storeData && storeData.settingsData && storeData.settingsData.settings && storeData.settingsData.settings.languageTranslation ? storeData.settingsData.settings.languageTranslation : ""
    return { languageData: languageData };
  }
  componentDidMount = () => {
    //Screen permisions value can be edit,view, no view
    let screenPermissions = RolePermissions.screenPermissions('User');
    if (screenPermissions) {
      this.setState({
        rolePermission: screenPermissions
      })
    }
    // this.getRoleListFromServer()
  }
  setData = (props) => {
    let rowData = {}
    if (props && props.match && props.match.params && props.match.params.id) {
      rowData["_id"] = JSON.parse(props.match.params.id)
      return rowData
    }
  }
  getRoleListFromServer = async () => {
    let filterCriteria = {},
      url;
    filterCriteria.direction = "asc";
    url = `roles?filter=${JSON.stringify(filterCriteria)}`;
    fetchMethodRequest('GET', url)
      .then(async (res) => {
        if (res && res.roles && res.roles.length > 0) {
          let rolesList = []
          for (let obj of res.roles) {
            if (obj.role) rolesList.push({ value: obj.role, label: obj.role });
          }

          await this.setState({ rolesList: rolesList });
        }
      }).catch((err) => { return err })
  };
  getTableFields = () => {
    let { languageData } = this.state
    let roleTypes = [
      {
        label: 'All',
        value: null
      },
      {
        label: 'Admin',
        value: 'Admin'
      },
      {
        label: 'Super Admin',
        value: 'Super Admin'
      },
      {
        label: 'User',
        value: 'User'
      },
    ];
    let StatusTypes = [
      {
        label: 'All',
        value: null
      },
      {
        label: 'Active',
        value: 'Active'
      },
      {
        label: 'Inactive',
        value: 'Inactive'
      },
      {
        label: 'Pending',
        value: 'Pending'
      }
    ];
    let data = [{ "textAlign": "center", "width": 47, "field": "Check Box", "label": "Check Box", "fieldType": "multiple", "header": "", "selectionMode": "multiple", "show": true, "mobile": true, "displayInSettings": true }, { "textAlign": "center", "width": 47, "field": "Sno", "label": "SNo", "header": "SNo", "filter": false, "sortable": false, "placeholder": "Search", "show": true, "mobile": true, "displayInSettings": true }, { "name": "name", "type": "text", "placeholder": "Name", "label": "Name", "header": "Name", "width": 110, "id": "name", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "fieldType": "Link", "textAlign": "Center", "globalSearchField": "true", "show": true, "field": "name", "mobile": true, "displayInSettings": true }, { "name": "createdBy", "type": "relateAutoComplete", "placeholder": "CreatedBy", "label": "CreatedBy", "width": 90, "disabled": true, "header": "CreatedBy", "derivedValue": "createdBy=undefined", "actions": [], "actionsNumber": [], "id": "createdBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "textAlign": "Center", "show": true, "field": "createdBy", "mobile": true, "displayInSettings": true }, { "name": "updatedBy", "type": "relateAutoComplete", "placeholder": "UpdatedBy", "label": "UpdatedBy", "width": 90, "header": "UpdatedBy", "derivedValue": "updatedBy=undefined", "actions": [], "actionsNumber": [], "id": "updatedBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "disabled": true, "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "textAlign": "Center", "show": true, "field": "updatedBy", "mobile": true, "displayInSettings": true }, { "name": "created", "type": "date", "placeholder": "Created", "label": "Created", "width": 90, "header": "Created", "derivedValue": "created=undefined", "actions": [], "actionsNumber": [], "id": "created", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "textAlign": "Center", "disabled": true, "show": true, "field": "created", "mobile": true, "displayInSettings": true }, { "name": "updated", "type": "date", "placeholder": "Updated", "label": "Updated", "width": 90, "header": "Updated", "derivedValue": "updated=undefined", "actions": [], "actionsNumber": [], "id": "updated", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "textAlign": "Center", "disabled": true, "show": true, "field": "updated", "mobile": true, "displayInSettings": true }, { "show": true, "textAlign": "center", "width": 60, "fieldType": "Actions", "field": "Actions", "header": "Actions", "label": "Actions", "filter": false, "sortable": false, "displayInSettings": true, "displayinServer": "false", "displayinlist": "true", "displayinaddForm": "false", "displayineditForm": "false", "mobile": true }, { "name": "email", "type": "email", "placeholder": "Email", "label": "Email", "width": "90px", "header": "Email", "derivedValue": "email=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "email", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "password", "type": "text", "placeholder": "Password", "label": "Password", "width": "90px", "header": "Password", "derivedValue": "password=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "password", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "password", "showOrHideFields": [], "mobile": true, "displayInSettings": true, "fieldType": "Link", "style": { "color": "#0e4768", "cursor": "pointer", "textTransform": "capitalize" } }, { "name": "status", "type": "dropDown", "placeholder": "Status", "label": "Status", "width": "90px", "header": "Status", "derivedValue": "status=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "status", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "false", "required": false, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "options": [{ "label": "Active", "value": "active", "color": "primary" }, { "label": "InActive", "value": "inActive", "color": "primary" }], "fieldType": "dropDown", "dependent": [], "textAlign": "Center", "show": true, "field": "status", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "companyId", "type": "text", "placeholder": "CompanyId", "label": "CompanyId", "width": "90px", "header": "CompanyId", "derivedValue": "companyId=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "companyId", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "companyId", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "role", "type": "dropDown", "placeholder": "Role", "label": "Role", "header": "Role", "derivedValue": "role=undefined", "actions": [], "width": 110, "actionsNumber": [], "id": "role", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "options": [], "textAlign": "Center", "show": true, "disabled": true, "field": "role", "mobile": true, "globalSearchField": "true", "required": true, "displayInSettings": true, "fieldType": "dropDown" }]
    return data;
  };

  getFormFields = () => {
    let { languageData } = this.state
    let statusTypes = [
      {
        label: 'Active',
        value: 'Active'
      },
      {
        label: 'Inactive',
        value: 'Inactive'
      },
      {
        label: 'Pending',
        value: 'Pending'
      },
    ];
    return ([{ "name": "name", "type": "text", "placeholder": "Name", "label": "Name", "width": 110, "id": "name", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "fieldType": "Link", "globalSearchField": "true", "show": true, "mobile": true, "displayInSettings": true, "isAddFormHidden": false, "isEditFormHidden": false }, { "name": "createdBy", "type": "relateAutoComplete", "placeholder": "CreatedBy", "label": "CreatedBy", "width": 90, "disabled": true, "derivedValue": "createdBy=undefined", "actions": [], "actionsNumber": [], "id": "createdBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "show": true, "mobile": true, "displayInSettings": true, "isAddFormHidden": true, "isEditFormHidden": true }, { "name": "updatedBy", "type": "relateAutoComplete", "placeholder": "UpdatedBy", "label": "UpdatedBy", "width": 90, "derivedValue": "updatedBy=undefined", "actions": [], "actionsNumber": [], "id": "updatedBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "disabled": true, "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "show": true, "mobile": true, "displayInSettings": true, "isAddFormHidden": true, "isEditFormHidden": true }, { "name": "created", "type": "date", "placeholder": "Created", "label": "Created", "width": 90, "derivedValue": "created=undefined", "actions": [], "actionsNumber": [], "id": "created", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "disabled": true, "show": true, "mobile": true, "displayInSettings": true, "isAddFormHidden": true, "isEditFormHidden": true }, { "name": "updated", "type": "date", "placeholder": "Updated", "label": "Updated", "width": 90, "derivedValue": "updated=undefined", "actions": [], "actionsNumber": [], "id": "updated", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "disabled": true, "show": true, "mobile": true, "displayInSettings": true, "isAddFormHidden": true, "isEditFormHidden": true }, { "name": "email", "type": "email", "placeholder": "Email", "label": "Email", "width": "90px", "derivedValue": "email=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "show": true, "showOrHideFields": [], "mobile": true, "displayInSettings": true, "isAddFormHidden": false, "isEditFormHidden": false }, { "name": "password", "type": "text", "placeholder": "Password", "label": "Password", "width": "90px", "derivedValue": "password=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "password", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "show": true, "showOrHideFields": [], "mobile": true, "displayInSettings": true, "fieldType": "Link", "style": { "color": "#0e4768", "cursor": "pointer", "textTransform": "capitalize" }, "isAddFormHidden": false, "isEditFormHidden": false }, { "name": "status", "type": "dropDown", "placeholder": "Status", "label": "Status", "width": "90px", "derivedValue": "status=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "status", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "false", "required": false, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "options": [{ "label": "Active", "value": "active", "color": "primary" }, { "label": "InActive", "value": "inActive", "color": "primary" }], "fieldType": "dropDown", "dependent": [], "show": true, "showOrHideFields": [], "mobile": true, "displayInSettings": true, "isAddFormHidden": false, "isEditFormHidden": false }, { "name": "companyId", "type": "text", "placeholder": "CompanyId", "label": "CompanyId", "width": "90px", "derivedValue": "companyId=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "companyId", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "show": true, "showOrHideFields": [], "mobile": true, "displayInSettings": true, "isAddFormHidden": false, "isEditFormHidden": false }, { "name": "role", "type": "dropDown", "placeholder": "Role", "label": "Role", "derivedValue": "role=undefined", "actions": [], "width": 110, "actionsNumber": [], "id": "role", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "options": [], "show": true, "disabled": true, "mobile": true, "globalSearchField": "true", "required": true, "displayInSettings": true, "fieldType": "dropDown", "isAddFormHidden": false, "isEditFormHidden": false }]);
  }

  submit = async (item) => {

    this.setState({ isOpenFormModal: true })
    await this.formModalRef.getRowData(item, 'edit');

    console.log("Submit Button in sode          ")
  }
  getMobileTableFields = () => {
    let data = [{ "textAlign": "center", "width": 47, "field": "Check Box", "label": "Check Box", "fieldType": "multiple", "header": "", "selectionMode": "multiple", "show": true, "mobile": true, "displayInSettings": true }, { "textAlign": "center", "width": 47, "field": "Sno", "label": "SNo", "header": "SNo", "filter": false, "sortable": false, "placeholder": "Search", "show": true, "mobile": true, "displayInSettings": true }, { "name": "name", "type": "text", "placeholder": "Name", "label": "Name", "header": "Name", "width": 110, "id": "name", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "fieldType": "Link", "textAlign": "Center", "globalSearchField": "true", "show": true, "field": "name", "mobile": true, "displayInSettings": true }, { "name": "createdBy", "type": "relateAutoComplete", "placeholder": "CreatedBy", "label": "CreatedBy", "width": 90, "disabled": true, "header": "CreatedBy", "derivedValue": "createdBy=undefined", "actions": [], "actionsNumber": [], "id": "createdBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "textAlign": "Center", "show": true, "field": "createdBy", "mobile": true, "displayInSettings": true }, { "name": "updatedBy", "type": "relateAutoComplete", "placeholder": "UpdatedBy", "label": "UpdatedBy", "width": 90, "header": "UpdatedBy", "derivedValue": "updatedBy=undefined", "actions": [], "actionsNumber": [], "id": "updatedBy", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": 1001, "searchField": "name", "disabled": true, "fieldType": "relateAutoComplete", "controllerName": "employee", "searchApi": "employees", "textAlign": "Center", "show": true, "field": "updatedBy", "mobile": true, "displayInSettings": true }, { "name": "created", "type": "date", "placeholder": "Created", "label": "Created", "width": 90, "header": "Created", "derivedValue": "created=undefined", "actions": [], "actionsNumber": [], "id": "created", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "textAlign": "Center", "disabled": true, "show": true, "field": "created", "mobile": true, "displayInSettings": true }, { "name": "updated", "type": "date", "placeholder": "Updated", "label": "Updated", "width": 90, "header": "Updated", "derivedValue": "updated=undefined", "actions": [], "actionsNumber": [], "id": "updated", "displayinaddForm": "false", "displayineditForm": "false", "displayinlist": "true", "globalSearchField": "false", "controllerId": null, "dateFormat": "DD-MM-YYYY", "textAlign": "Center", "disabled": true, "show": true, "field": "updated", "mobile": true, "displayInSettings": true }, { "show": true, "textAlign": "center", "width": 60, "fieldType": "Actions", "field": "Actions", "header": "Actions", "label": "Actions", "filter": false, "sortable": false, "displayInSettings": true, "displayinServer": "false", "displayinlist": "true", "displayinaddForm": "false", "displayineditForm": "false", "mobile": true }, { "name": "email", "type": "email", "placeholder": "Email", "label": "Email", "width": "90px", "header": "Email", "derivedValue": "email=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "email", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "password", "type": "text", "placeholder": "Password", "label": "Password", "width": "90px", "header": "Password", "derivedValue": "password=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "password", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "password", "showOrHideFields": [], "mobile": true, "displayInSettings": true, "fieldType": "Link", "style": { "color": "#0e4768", "cursor": "pointer", "textTransform": "capitalize" } }, { "name": "status", "type": "dropDown", "placeholder": "Status", "label": "Status", "width": "90px", "header": "Status", "derivedValue": "status=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "status", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "false", "required": false, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "options": [{ "label": "Active", "value": "active", "color": "primary" }, { "label": "InActive", "value": "inActive", "color": "primary" }], "fieldType": "dropDown", "dependent": [], "textAlign": "Center", "show": true, "field": "status", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "companyId", "type": "text", "placeholder": "CompanyId", "label": "CompanyId", "width": "90px", "header": "CompanyId", "derivedValue": "companyId=undefined", "capitalizeTableText": false, "sortable": false, "actions": [], "actionsNumber": [], "id": "companyId", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "isFieldRequired": "true", "required": true, "displayOptionsInActions": false, "globalSearchField": "true", "controllerId": null, "textAlign": "Center", "show": true, "field": "companyId", "showOrHideFields": [], "mobile": true, "displayInSettings": true }, { "name": "role", "type": "dropDown", "placeholder": "Role", "label": "Role", "header": "Role", "derivedValue": "role=undefined", "actions": [], "width": 110, "actionsNumber": [], "id": "role", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "controllerName": null, "options": [], "textAlign": "Center", "show": true, "disabled": true, "field": "role", "mobile": true, "globalSearchField": "true", "required": true, "displayInSettings": true, "fieldType": "dropDown" }]

    return data;
  };
  closeFormModal = async () => {
    this.setState({
      isOpenFormModal: false,
    })
  }
  // submit1 = item => {
  //   let x = usersFields
  //   let objusers = {}

  //   objusers["_id"] = item[0]["_id"]
  //   for (let x2 of x) {
  //     objusers[x2] = item[0][x2]
  //   }
  //   let formFields = this.getFormFields()

  //   formFields = formFields.filter(y => x.includes(y.name))

  //   this.setState({
  //     openNewUserModal: true,
  //     item: objusers,
  //     newFormFields: formFields
  //   });
  // }

  cancelReset = async (type) => {
    this.setState({
      openNewUserModal: false
    });
    window.location.reload();

    // if (type == "submit") {
    // type == "submit"
    //   ?
    // await this.dataTableRef.getDataFromServer(this.state.filterCriteria, "refresh");
    // }

    // : null;
  };
  getChangedRoleOptions = () => {
    let fields = this.getFormFields();
    if (fields && fields.length > 0) {
      for (let obj of fields) {
        if (obj.name == "role") {
          obj.options = this.state.rolesList && this.state.rolesList.length > 0 ? this.state.rolesList : [
            {
              "value": "Admin",
              "label": "Admin"
            },
            {
              "value": "User",
              "label": "User"
            },
            {
              "value": "Employee",
              "label": "Employee"
            }
          ]
        }
      }
    }
    return fields;
  }
  saveDataToServer = async (item, field, value) => {
    let body = item[0]
    body[field] = value
    let userBody = Object.assign({}, body);
    this.setState({
      isLoading: true
    });
    if (body) {
      let method, apiUrl;
      method = 'PUT';
      apiUrl = `${apiCalls.Users}/${body._id}`;
      return fetchMethodRequest(method, apiUrl, userBody)
        .then(async (response) => {
          // let sessionexpired = await localStorage.getItem('sessionexpired')
          // if (sessionexpired === "true") {
          //   await this.setState({ sessionExpiryModal: true })
          // }
          if (response && response.respCode) {
            showToasterMessage(response.respMessage, 'success');

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
  render() {
    return (
      <span>
        <DataTables
          {...this.props}
          onRef={ref => (this.dataTableRef = ref)}
          // MobileTableFields={this.getMobileTableFields}
          // getTableFields={this.getTableFields}
          // formFields={this.getFormFields}
          // 
          addRequired={this.state.rolePermission && this.state.rolePermission == 'Edit' ? true : false}
          editRequired={this.state.rolePermission && this.state.rolePermission == 'Edit' ? true : false}
          deleteRequired={this.state.rolePermission && this.state.rolePermission == 'Edit' ? true : false}
          viewRequired={this.state.rolePermission && this.state.rolePermission == 'Edit' ? true : false}
          exportRequired={this.state.rolePermission && this.state.rolePermission == 'Edit' ? true : false}
          sample={true}
          // globalSearch={'Display Name/Email'}
          // type='Users'
          // apiUrl={apiCalls.Users}
          getTableFields={this.getTableFields}
          formFields={this.getChangedRoleOptions}
          // exportRequried={true}

          printRequried={true}
          actionsTypes={[

            {
              'name': 'Delete',
              "options": [
                { 'label': 'Delete', 'value': 'Delete', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": true, },
              ]
            },

            // {
            //   'name': 'Block',
            //   "options": [
            //     { 'label': 'Block', 'value': 'Block', 'show': true, "multiple": false, }
            //   ]
            // },
            // {
            //   'name': 'ResetPassword',
            //   "options": [
            //     { 'label': 'ResetPassword', 'value': 'ResetPassword', 'show': true, "multiple": false, }
            //   ]
            // },
            // {
            //   'name': 'Submit',
            //   'action': this.submit,
            //   "options": [
            //     { 'label': 'Submit', 'value': 'Submit', 'show': true, "multiple": false },
            //   ]
            // },
            // {
            //   name: "newModel",
            //   action: this.submit1,
            //   options: [
            //     { label: "newModel", value: "newModel", show: true, multiple: false }
            //   ]
            // }

          ]}
          // addRequried={insertAdd}
          // editRequired={true}
          // deleteRequired={true}
          // viewRequired={true}
          settingsRequired={true}
          filterRequired={false}
          gridRequried={true}
          exportToCsv={true}
          dateSearchRequired={false}
          searchInDateRangeField={""}
          sampleFilePath={filePath.users}
          setData={this.setData}
          editSelectedRecord={this.state.editSelectedRecord}
          addSelectedRecord={this.state.addSelectedRecord}
          viewSelectedRecord={this.state.viewSelectedRecord}
          globalSearch={"name/email/password/status/companyId/role"}
          type='Users'
          routeTo={apiCalls.Users}
          displayViewOfForm='screen'
          apiResponseKey={apiCalls.Users}
          apiUrl={apiCalls.Users}

        />
        {this.state.isOpenFormModal ? (
          <FormModal
            onRef={(ref) => (this.formModalRef = ref)}
            formType="edit"
            openFormModal={this.state.isOpenFormModal}
            formFields={this.props.formFields}
          />

        ) : null}
        {this.state.openNewUserModal ? (
          <NewUserModal
            openNewUserModal={this.state.openNewUserModal}
            cancelReset={this.cancelReset}
            item={this.state.item}
            newFormFields={this.state.newFormFields}
            recordId={this.state.item._id}
            entityType="Users"
            apiUrl={apiCalls.Users}
          />
        ) : null}
      </span>
    );
  }
}