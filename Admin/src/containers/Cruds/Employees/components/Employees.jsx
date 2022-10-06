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
      editSelectedRecord:window.location.href.includes("edit"),
      addSelectedRecord:window.location.href.includes("create"),
      viewSelectedRecord:window.location.href.includes("view"),	
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
    let screenPermissions = RolePermissions.screenPermissions('Employee');
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
    let data = [{"textAlign":"center","width":47,"field":"Check Box","label":"Check Box","fieldType":"multiple","header":"","selectionMode":"multiple","show":true,"mobile":true,"displayInSettings":true},{"textAlign":"center","width":47,"field":"Sno","label":"SNo","header":"SNo","filter":false,"sortable":false,"placeholder":"Search","show":true,"mobile":true,"displayInSettings":true},{"name":"name","type":"text","placeholder":"Name","label":"Name","header":"Name","width":110,"id":"name","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"fieldType":"Link","textAlign":"Center","displayinregisterForm":"true","disabled":true,"globalSearchField":"true","show":true,"field":"name","mobile":true,"displayInSettings":true},{"name":"email","type":"email","placeholder":"Email","label":"Email","id":"email","width":150,"displayinaddForm":"true","displayineditForm":"false","displayinlist":"true","controllerName":null,"textAlign":"Center","displayinregisterForm":"true","disabled":true,"show":true,"globalSearchField":"true","field":"email","header":"Email","mobile":true,"displayInSettings":true},{"name":"address","type":"textarea","placeholder":"Address","label":"Address","id":"address","width":180,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"textAlign":"Center","show":true,"disabled":true,"globalSearchField":"true","field":"address","header":"Address","mobile":true,"displayInSettings":true},{"name":"role","type":"dropDown","placeholder":"Role","label":"Role","header":"Role","derivedValue":"role=undefined","actions":[],"width":110,"actionsNumber":[],"id":"role","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"options":[],"textAlign":"Center","show":true,"disabled":true,"field":"role","mobile":true,"globalSearchField":"true","required":true,"displayInSettings":true,"fieldType":"dropDown"},{"name":"phone","type":"text","placeholder":"Phone","label":"Phone","id":"phone","width":110,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"textAlign":"Center","displayinregisterForm":"true","show":true,"disabled":true,"field":"phone","header":"Phone","mobile":true,"displayInSettings":true,"fieldType":"Link","style":{"color":"#0e4768","cursor":"pointer","textTransform":"capitalize"}},{"name":"reportingTo","type":"relateAutoComplete","placeholder":"ReportingTo","label":"ReportingTo","header":"ReportingTo","derivedValue":"reportingTo=undefined","actions":[],"actionsNumber":[],"id":"reportingTo","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":"employee","searchField":"name","fieldType":"relateAutoComplete","controllerId":1001,"searchApi":"employees","width":110,"textAlign":"Center","show":true,"disabled":true,"field":"reportingTo","mobile":true,"displayInSettings":true},{"name":"password","type":"password","placeholder":"password","label":"password","id":"password","displayinaddForm":"true","displayineditForm":"false","displayinlist":"false","controllerName":null,"textAlign":"Center","show":false,"displayInSettings":false,"disabled":true,"field":"password","header":"password","mobile":true},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true}]
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
    return ([{"name":"name","type":"text","placeholder":"Name","label":"Name","width":110,"id":"name","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"fieldType":"Link","displayinregisterForm":"true","disabled":true,"globalSearchField":"true","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":false},{"name":"email","type":"email","placeholder":"Email","label":"Email","id":"email","width":150,"displayinaddForm":"true","displayineditForm":"false","displayinlist":"true","controllerName":null,"displayinregisterForm":"true","disabled":true,"show":true,"globalSearchField":"true","mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":true},{"name":"address","type":"textarea","placeholder":"Address","label":"Address","id":"address","width":180,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"show":true,"disabled":true,"globalSearchField":"true","mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":false},{"name":"role","type":"dropDown","placeholder":"Role","label":"Role","derivedValue":"role=undefined","actions":[],"width":110,"actionsNumber":[],"id":"role","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"options":[],"show":true,"disabled":true,"mobile":true,"globalSearchField":"true","required":true,"displayInSettings":true,"fieldType":"dropDown","isAddFormHidden":false,"isEditFormHidden":false},{"name":"phone","type":"text","placeholder":"Phone","label":"Phone","id":"phone","width":110,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"displayinregisterForm":"true","show":true,"disabled":true,"mobile":true,"displayInSettings":true,"fieldType":"Link","style":{"color":"#0e4768","cursor":"pointer","textTransform":"capitalize"},"isAddFormHidden":false,"isEditFormHidden":false},{"name":"reportingTo","type":"relateAutoComplete","placeholder":"ReportingTo","label":"ReportingTo","derivedValue":"reportingTo=undefined","actions":[],"actionsNumber":[],"id":"reportingTo","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":"employee","searchField":"name","fieldType":"relateAutoComplete","controllerId":1001,"searchApi":"employees","width":110,"show":true,"disabled":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":false,"isEditFormHidden":false},{"name":"password","type":"password","placeholder":"password","label":"password","id":"password","displayinaddForm":"true","displayineditForm":"false","displayinlist":"false","controllerName":null,"show":true,"displayInSettings":false,"disabled":true,"mobile":true,"isAddFormHidden":false,"isEditFormHidden":true},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true}]);
  }

  submit = async (item) => {

    this.setState({ isOpenFormModal: true })
    await this.formModalRef.getRowData(item, 'edit');

    console.log("Submit Button in sode          ")
  }
  getMobileTableFields = () => {
    let data = [{"textAlign":"center","width":47,"field":"Check Box","label":"Check Box","fieldType":"multiple","header":"","selectionMode":"multiple","show":true,"mobile":true,"displayInSettings":true},{"textAlign":"center","width":47,"field":"Sno","label":"SNo","header":"SNo","filter":false,"sortable":false,"placeholder":"Search","show":true,"mobile":true,"displayInSettings":true},{"name":"name","type":"text","placeholder":"Name","label":"Name","header":"Name","width":110,"id":"name","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"fieldType":"Link","textAlign":"Center","displayinregisterForm":"true","disabled":true,"globalSearchField":"true","show":true,"field":"name","mobile":true,"displayInSettings":true},{"name":"email","type":"email","placeholder":"Email","label":"Email","id":"email","width":150,"displayinaddForm":"true","displayineditForm":"false","displayinlist":"true","controllerName":null,"textAlign":"Center","displayinregisterForm":"true","disabled":true,"show":true,"globalSearchField":"true","field":"email","header":"Email","mobile":true,"displayInSettings":true},{"name":"address","type":"textarea","placeholder":"Address","label":"Address","id":"address","width":180,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"textAlign":"Center","show":true,"disabled":true,"globalSearchField":"true","field":"address","header":"Address","mobile":true,"displayInSettings":true},{"name":"role","type":"dropDown","placeholder":"Role","label":"Role","header":"Role","derivedValue":"role=undefined","actions":[],"width":110,"actionsNumber":[],"id":"role","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"options":[],"textAlign":"Center","show":true,"disabled":true,"field":"role","mobile":true,"globalSearchField":"true","required":true,"displayInSettings":true,"fieldType":"dropDown"},{"name":"phone","type":"text","placeholder":"Phone","label":"Phone","id":"phone","width":110,"displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":null,"textAlign":"Center","displayinregisterForm":"true","show":true,"disabled":true,"field":"phone","header":"Phone","mobile":true,"displayInSettings":true,"fieldType":"Link","style":{"color":"#0e4768","cursor":"pointer","textTransform":"capitalize"}},{"name":"reportingTo","type":"relateAutoComplete","placeholder":"ReportingTo","label":"ReportingTo","header":"ReportingTo","derivedValue":"reportingTo=undefined","actions":[],"actionsNumber":[],"id":"reportingTo","displayinaddForm":"true","displayineditForm":"true","displayinlist":"true","controllerName":"employee","searchField":"name","fieldType":"relateAutoComplete","controllerId":1001,"searchApi":"employees","width":110,"textAlign":"Center","show":true,"disabled":true,"field":"reportingTo","mobile":true,"displayInSettings":true},{"name":"password","type":"password","placeholder":"password","label":"password","id":"password","displayinaddForm":"true","displayineditForm":"false","displayinlist":"false","controllerName":null,"textAlign":"Center","show":false,"displayInSettings":false,"disabled":true,"field":"password","header":"password","mobile":true},{"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true}]

    return data;
  };
  closeFormModal = async () => {
    this.setState({
      isOpenFormModal: false,
    })
  }
  // submit1 = item => {
  //   let x = employeesFields
  //   let objemployees = {}

  //   objemployees["_id"] = item[0]["_id"]
  //   for (let x2 of x) {
  //     objemployees[x2] = item[0][x2]
  //   }
  //   let formFields = this.getFormFields()

  //   formFields = formFields.filter(y => x.includes(y.name))

  //   this.setState({
  //     openNewUserModal: true,
  //     item: objemployees,
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
          obj.options = this.state.rolesList && this.state.rolesList.length > 0 ? this.state.rolesList : []
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
      apiUrl = `${apiCalls.Employees}/${body._id}`;
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
          // type='Employees'
          // apiUrl={apiCalls.Employees}
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
          dateSearchRequired={undefined}
          searchInDateRangeField={"undefined"}
          sampleFilePath={filePath.employees}
          setData={this.setData}
          editSelectedRecord={this.state.editSelectedRecord}
          addSelectedRecord={this.state.addSelectedRecord}
          viewSelectedRecord={this.state.viewSelectedRecord}
          globalSearch={"name/email/address/role"}
          type='Employees'
          routeTo={apiCalls.Employees}
          displayViewOfForm='screen'
          apiResponseKey={apiCalls.Employees}
          apiUrl={apiCalls.Employees}

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
            entityType="Employees"
            apiUrl={apiCalls.Employees}
          />
        ) : null}
      </span>
    );
  }
}