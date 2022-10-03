import React from 'react';
import DataTables from '../../CommonDataTable/DataTable';
import config from '../../../../config/config';
import apiCalls from '../../../../config/apiCalls'
import store from '../../../App/store';
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';

import RolePermissions from '../../CommonModals/Permissions';
import fetchMethodRequest from "../../../../config/service";
// config file
export default class Roles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: '',
      rolePermission: "",
      editSelectedRecord:window.location.href.includes("edit"),
      addSelectedRecord:window.location.href.includes("create"),
      viewSelectedRecord:window.location.href.includes("view"),	
    };
  }

  static getDerivedStateFromProps(props, state) {
    let storeData = store.getState()
    let languageData = storeData && storeData.settingsData && storeData.settingsData.settings && storeData.settingsData.settings.languageTranslation ? storeData.settingsData.settings.languageTranslation : ""
    return { languageData: languageData };
  }
  componentDidMount = async () => {
    let screenPermissions = RolePermissions.screenPermissions('Roles');
    if (screenPermissions) {
      this.setState({
        rolePermission: screenPermissions
      })
    }
    this.getMenuListFromServer();
  };
  setData = (props) => {
    let rowData = {}
    console.log(props.match)
    if (props && props.match && props.match.params && props.match.params.id) {
      rowData["_id"] = JSON.parse(props.match.params.id)
      return rowData
    }
  }
  getMenuListFromServer = async () => {
    let filterCriteria = {},
      url;
    filterCriteria.sortfield = "sequenceNo";
    filterCriteria.direction = "asc";
    url = `menus?filter=${JSON.stringify(filterCriteria)}`;
    fetchMethodRequest('GET', url)
      .then(async (res) => {
        if (res && res.menulists && res.menulists.length > 0) {
          let menuList = res.menulists;

          await this.setState({ menuList: menuList });
        }
      }).catch((err) => { return err })
  };
  getTableFields = () => {
    let { languageData } = this.state;
    let data = [
      {
        textAlign: "center",
        width: 47,
        field: "",
        fieldType: "multiple",
        header: "",
        selectionMode: "multiple",
        show: true,
        mobile: true
      },
      {
        show: true,
        textAlign: "center",
        width: 47,
        field: "Sno",
        header: "Sno",
        label:"Sno",
        filter: false,
        sortable: false,
        displayInSettings: true,
        placeholder: "Search"
      },

      {
        show: true,
        textAlign: "center",
        mobile: true,
        width: 300,
        field: "role",
        label:"Role",
        fieldType: "Link",
        header: "Role",
        filter: false,
        sortable: true,
        displayInSettings: true
      },

      {
        show: true,
        textAlign: "center",
        width: 80,
        field: "status",
        label:"Status",
        mobile: true,
        fieldType: "Badge",
        header: "Status",
        filter: false,
        displayInSettings: true,

        sortable: false,
        options: [
          { value: "Active", color: "success" },
          { value: "Inactive", color: "warning" },
          { value: "Pending", color: "danger" }
        ],
        filterElement: [
          { label: "All", value: null },
          { label: "Active", value: "Active" },
          { label: "Pending", value: "Pending" },
          { label: "Inactive", value: "Inactive" }
        ]
      },
      {"name":"roleType","type":"dropDown","placeholder":"RoleType","width":90,"label":"RoleType","header":"RoleType","derivedValue":"roleType=undefined","actions":[],"actionsNumber":[],"id":"roleType","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","fieldType":"dropDown","controllerName":null,"options":[{"label":"Employee","value":"Employee"},{"label":"Manager","value":"Manager"},{"label":"Admin","value":"Admin"}],"textAlign":"Center","show":true,"required":true,"disabled":true,"field":"roleType","mobile":true,"displayInSettings":true},{"actions":[],"actionsNumber":[],"controllerName":null,"derivedValue":"levels=undefined","displayinaddForm":"true","displayineditForm":"true","width":50,"displayinlist":"true","field":"levels","header":"Levels","id":"levels","label":"Levels","name":"levels","globalSearchField":"false","placeholder":"Levels","show":true,"textAlign":"Center","type":"number","disabled":true,"required":false,"mobile":true,"displayInSettings":true},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true},
    ];
    return data;
  };
  getFormFields = () => {
    let { languageData } = this.state;
    return [
      {
        value: "",
        type: "text",
        name: "role",
        label: "Role",
        id: "role",
        placeholder: "role",
        required: true
      },
      {
        required: true,
        value: "",
        type: "dropDown",
        name: "status",
        label: "Status",
        id: "status",
        options: config.formFieldStatusTypes,
        placeholder: "Status"
      },
      {
        value: "",
        type: "permission",
        name: "permission",
        label: "Permission",
        id: "permission",
        placeholder: "permission",
        required: true
      },
      {"name":"roleType","type":"dropDown","placeholder":"RoleType","width":90,"label":"RoleType","derivedValue":"roleType=undefined","actions":[],"actionsNumber":[],"id":"roleType","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","fieldType":"dropDown","controllerName":null,"options":[{"label":"Employee","value":"Employee"},{"label":"Manager","value":"Manager"},{"label":"Admin","value":"Admin"}],"show":true,"required":true,"disabled":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":false},{"actions":[],"actionsNumber":[],"controllerName":null,"derivedValue":"levels=undefined","displayinaddForm":"true","displayineditForm":"true","width":50,"displayinlist":"true","id":"levels","label":"Levels","name":"levels","globalSearchField":"false","placeholder":"Levels","show":true,"type":"number","disabled":true,"required":false,"mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":false},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},
    ];
  };

  getMobileTableFields = () => {
    let data = [{ "textAlign": "center", "width": 47, "field": "Sno", "header": "Sno", "filter": false, "sortable": false, "placeholder": "Search" },
    { "textAlign": "center", "width": 80, "field": "role", "header": "Role", "filter": false, "sortable": true },
    // { "textAlign": "center", "width": 80, "field": "permission", "header": "Permissions", "filter": true, "sortable": true },
    { "textAlign": "left", "width": 70, "field": "Actions", "header": "Actions", "filter": false, "sortable": false }, {"name":"roleType","type":"dropDown","placeholder":"RoleType","width":90,"label":"RoleType","header":"RoleType","derivedValue":"roleType=undefined","actions":[],"actionsNumber":[],"id":"roleType","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","fieldType":"dropDown","controllerName":null,"options":[{"label":"Employee","value":"Employee"},{"label":"Manager","value":"Manager"},{"label":"Admin","value":"Admin"}],"textAlign":"Center","show":true,"required":true,"disabled":true,"field":"roleType","mobile":true,"displayInSettings":true},{"actions":[],"actionsNumber":[],"controllerName":null,"derivedValue":"levels=undefined","displayinaddForm":"true","displayineditForm":"true","width":50,"displayinlist":"true","field":"levels","header":"Levels","id":"levels","label":"Levels","name":"levels","globalSearchField":"false","placeholder":"Levels","show":true,"textAlign":"Center","type":"number","disabled":true,"required":false,"mobile":true,"displayInSettings":true},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true},]

    return data;
  };
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
      apiUrl = `roles/${body._id}`;
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
      <DataTables
      {...this.props}
        // MobileTableFields={this.getMobileTableFields}
        getTableFields={this.getTableFields}
        formFields={this.getFormFields}

        actionsTypes={[{
          'name': 'Delete',
          "options": [
            { 'label': 'Delete', 'value': 'Delete', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": true, },
          ]
        },
        {
          'name': 'Admin',
          'action': this.saveDataToServer,
          "options": [
            { 'label': 'Admin', "field": "roleType", 'value': 'Admin', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": false, },
          ]
        },
        {
          'name': 'Manager',
          'action': this.saveDataToServer,
          "options": [
            { 'label': 'Manager', "field": "roleType", 'value': 'Manager', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": false, },
          ]
        },
        {
          'name': 'Employee',
          'action': this.saveDataToServer,
          "options": [
            { 'label': 'Employee', "field": "roleType", 'value': 'Employee', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": false, },
          ]
        },
        ]}
        exportRequired={true}
        printRequired={false}
        addRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
        // addRequried={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
        editRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
        deleteRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
        viewRequired={true}
        settingsRequired={true}
        filterRequired={false}
        gridRequried={true}
        sample={false}
        setData={this.setData}
        editSelectedRecord={this.state.editSelectedRecord}
        addSelectedRecord={this.state.addSelectedRecord}
        viewSelectedRecord={this.state.viewSelectedRecord}
        menuList={this.state.menuList}
        globalSearchFieldName='role'
        globalSearch={'Role'}
        type='Roles'
        dateSearchRequired={undefined}
        searchInDateRangeField={"undefined"}
        apiUrl={"roles"}
        routeTo='roles'
        statusValue={this.props.filterValue ? this.props.filterValue : null}
        displayViewOfForm='screen'
        apiResponseKey='roles'
        entityType='role'
      />
    );
  }
}