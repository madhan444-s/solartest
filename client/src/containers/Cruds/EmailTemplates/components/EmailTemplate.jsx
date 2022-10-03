import React from 'react';
import DataTable from '../../CommonDataTable/DataTable';
import apiCalls from '../../../../config/apiCalls'
import showToasterMessage from '../../../UI/ToasterMessage/toasterMessage';

import fetchMethodRequest from "../../../../config/service"
import RolePermissions from '../../CommonModals/Permissions';
// config file
import config from '../../../../config/config';

export default class EmailTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rolePermission: "",
      editSelectedRecord:window.location.href.includes("edit"),
      addSelectedRecord:window.location.href.includes("create"),
      viewSelectedRecord:window.location.href.includes("view"),	
    };
  }
  componentDidMount = () => {
    //Screen permisions value can be edit,view, no view
    let screenPermissions = RolePermissions.screenPermissions('Email Templates');
    if (screenPermissions) {
      this.setState({
        rolePermission: screenPermissions
      })
    }
  }
  setData = (props) => {
    let rowData = {}
    console.log(props.match)
    if (props && props.match && props.match.params && props.match.params.id) {
      rowData["_id"] = JSON.parse(props.match.params.id)
      return rowData
    }
  }
  getTableFields = () => {
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
        "show": true,
        "textAlign": "center",
        "width": 47,
        "field": "Sno",
        "header": "Sno",
        "filter": false,
        "sortable": false,
        "placeholder": "Search",
        displayInSettings: true,
      },
      {
        "show": true,
        "textAlign": "left",
        "width": 80,
        "fieldType": "Link",
        "field": "name",
        "header": "Name",
        "filter": true,
        "sortable": true,
        displayInSettings: true,
      },
      {
        "show": true,
        textAlign: 'left',
        width: 100,
        field: 'subject',
        header: 'Subject',
        filter: true,
        sortable: false,
        placeholder: 'search',
        displayInSettings: true,
      },
      // {
      //   "show": true,
      //   "textAlign": "center",
      //   "width": 60,
      //   "fieldType": "Actions",
      //   "field": "Actions",
      //   "header": "Actions",
      //   "filter": false,
      //   "sortable": false,
      //   displayInSettings: true,
      // },
      // {
      //   textAlign: 'center',
      //   width: 80,
      //   field: 'created',
      //   header: 'Created',
      //   filter: true,
      //   sortable: false,
      //   placeholder: config.dateDayMonthFormat
      // },
      {"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true},
      
    ];
    data.push( {
      "show": true,
      "textAlign": "center",
      "width": 60,
      "fieldType": "Actions",
      "field": "Actions",
      "header": "Actions",
      "filter": false,
      "sortable": false,
      displayInSettings: true,
    })
    return data;
  };

  getFormFields = () => {
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
    return ([
      {
        required: true,
        value: '',
        type: 'text',
        name: 'name',
        label: 'Name',
        id: 'name',
        placeholder: 'Name'
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
      //   type: 'text',
      //   name: 'content',
      //   label: 'Content',
      //   id: 'content',
      //   placeholder: 'Content'
      // },

      {
        required: true,
        value: '',
        type: 'ckeditor',
        name: 'templateText',
        label: 'Email Template',
        id: 'emailTemplate',
        placeholder: 'name'
      },
      {"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","disabled":true,"show":true,"mobile":true,"displayInSettings":true,"isAddFormHidden":true,"isEditFormHidden":true},
    ]);
  }
  getMobileTableFields = () => {
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
    return ([
      {
        "show": true,
        "textAlign": "center",
        "width": 47,
        "field": "Sno",
        "header": "Sno",
        "filter": false,
        "sortable": false,
        "placeholder": "Search"
      },
      {
        required: true,
        value: '',
        type: 'text',
        name: 'name',
        label: 'Name',
        id: 'name',
        placeholder: 'Name'
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
      {
        required: true,
        value: '',
        type: 'ckeditor',
        name: 'templateText',
        label: 'Email Template',
        id: 'emailTemplate',
        placeholder: 'name'
      },
      {"name":"createdBy","type":"relateAutoComplete","placeholder":"CreatedBy","label":"CreatedBy","width":90,"disabled":true,"header":"CreatedBy","derivedValue":"createdBy=undefined","actions":[],"actionsNumber":[],"id":"createdBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"createdBy","mobile":true,"displayInSettings":true},{"name":"updatedBy","type":"relateAutoComplete","placeholder":"UpdatedBy","label":"UpdatedBy","width":90,"header":"UpdatedBy","derivedValue":"updatedBy=undefined","actions":[],"actionsNumber":[],"id":"updatedBy","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":1001,"searchField":"name","disabled":true,"fieldType":"relateAutoComplete","controllerName":"employee","searchApi":"employees","textAlign":"Center","show":true,"field":"updatedBy","mobile":true,"displayInSettings":true},{"name":"created","type":"date","placeholder":"Created","label":"Created","width":90,"header":"Created","derivedValue":"created=undefined","actions":[],"actionsNumber":[],"id":"created","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"created","mobile":true,"displayInSettings":true},{"name":"updated","type":"date","placeholder":"Updated","label":"Updated","width":90,"header":"Updated","derivedValue":"updated=undefined","actions":[],"actionsNumber":[],"id":"updated","displayinaddForm":"false","displayineditForm":"false","displayinlist":"true","globalSearchField":"false","controllerId":null,"dateFormat":"DD-MM-YYYY","textAlign":"Center","disabled":true,"show":true,"field":"updated","mobile":true,"displayInSettings":true},
    ]);
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
      apiUrl = `templates/${body._id}`;
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
      <div>
        <DataTable
          {...this.props}
          MobileTableFields={this.getMobileTableFields}
          getTableFields={this.getTableFields}
          formFields={this.getFormFields}
          actionsTypes={[{
            'name': 'Delete',
            "options": [
              { 'label': 'Delete', 'value': 'Delete', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": true, },
            ]
          },
          ]}
          exportRequired={true}
          printRequired={false}
          addRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
          editRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
          deleteRequired={this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false}
          viewRequired={true}
          settingsRequired={true}
          filterRequired={false}
          gridRequried={false}
          sample={false}
          setData={this.setData}
          editSelectedRecord={this.state.editSelectedRecord}
          addSelectedRecord={this.state.addSelectedRecord}
          viewSelectedRecord={this.state.viewSelectedRecord}
          dateSearchRequired={undefined}
          searchInDateRangeField={"undefined"}
          preview={true}
          globalSearchFieldName='subject'
          globalSearch={"Subject"}
          type='Email Templates'
          apiResponseKey='templates'
          apiUrl={"templates"}
          routeTo='templates'
          displayViewOfForm='screen'
        />
      </div>
    );
  }
}