import React from 'react';
import DataTables from '../../CommonDataTable/DataTable';
import config from '../../../../config/config';
import apiCalls from '../../../../config/apiCalls'
import store from '../../../App/store';
import filePath from "../../../../config/configSampleFiles";
// config file
export default class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: ''
    };
  }

  static getDerivedStateFromProps(props, state) {
    let storeData = store.getState()
    let languageData = storeData && storeData.settingsData && storeData.settingsData.settings && storeData.settingsData.settings.languageTranslation ? storeData.settingsData.settings.languageTranslation : ""
    return { languageData: languageData };
  }

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
    // let data = [{ "textAlign": "center", "width": 47, "field": "Sno", "header": "SNo", "filter": false, "sortable": false, "show": true, "displayInSettings": true }, { "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "textAlign": "Center", "show": true, "field": "email", "header": "email", "displayInSettings": true }, { "textAlign": "left", "width": 70, "field": "Actions", "header": "Actions", "filter": false, "sortable": false, "show": true, "displayInSettings": true }]
    let data = [

      {
        textAlign: "center",
        width: 47,
        field: "Sno",
        header: "Sno",
        filter: false,
        sortable: false,
        placeholder: "Search",
        show: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 180,
        mobile: true,
        field: "csvFile",
        header: "Uploaded File",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },

      {
        show: true,
        textAlign: "center",
        width: 200,
        mobile: true,
        field: "duplicateFileDownloadUrl",
        header: "Failed File",
        fieldType: 'Download',
        style: {
          color: config.templateColor,
          cursor: "pointer",
          textTransform: "capitalize",
        },
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 160,
        field: "createdByName",
        header: "Created By Name",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "total",
        fieldType: 'Number',
        header: "Total Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "failed",
        fieldType: 'Number',
        header: "Failed Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "success",
        fieldType: 'Number',
        header: "Success Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 80,
        field: "type",
        header: "Type",
        fieldType: 'Capitalize',
        filter: false,
        sortable: true,
        displayInSettings: true,
        textTransform: true,
      },
      // {
      //   show: true,
      //   textAlign: "left",
      //   width: 160,
      //   mobile: true,
      //   field: "csvFilePath",
      //   header: "Csv File Path",
      //   filter: false,
      //   sortable: true,
      //   textCapitalize: true,
      //   displayInSettings: true,
      // },
      // {
      //   show: true,
      //   textAlign: "center",
      //   width: 140,
      //   field: "duplicateFile",
      //   mobile: true,
      //   header: "Duplicate File",
      //   filter: false,
      //   sortable: true,
      //   displayInSettings: true,
      // },
      // {
      //   show: true,
      //   textAlign: "left",
      //   width: 180,
      //   field: "duplicateFilePath",
      //   mobile: true,
      //   header: "Duplicate File Path",
      //   filter: false,
      //   sortable: true,
      //   displayInSettings: true,
      // },
      {
        show: true,
        textAlign: "left",
        width: 120,
        field: "status",
        mobile: true,
        header: "Status",
        fieldType: "Badge",
        style: {
          padding: "4px 6px",
          fontSize: 12,
          color: "white",
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        options: config.uploadStatusTypes,
        filter: false,
        sortable: false,
      },

      {
        show: true,
        textAlign: "left",
        width: 180,
        field: "created",
        header: "Created",
        fieldType: 'Date',
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      
    ];
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
    return ([{ "name": "email", "type": "email", "placeholder": "email", "value": "email", "label": "email", "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "show": true, "displayInSettings": true, "edit": true }, ]);
  }


  getMobileTableFields = () => {
    // let data = [{ "textAlign": "center", "width": 47, "field": "Sno", "header": "SNo", "filter": false, "sortable": false, "show": true, "displayInSettings": true }, { "id": "email", "displayinaddForm": "true", "displayineditForm": "true", "displayinlist": "true", "textAlign": "Center", "show": true, "field": "email", "header": "email", "displayInSettings": true }, { "textAlign": "left", "width": 70, "field": "Actions", "header": "Actions", "filter": false, "sortable": false, "show": true, "displayInSettings": true }]
    let data = [

      {
        textAlign: "center",
        width: 47,
        field: "Sno",
        header: "Sno",
        filter: false,
        sortable: false,
        placeholder: "Search",
        show: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 180,
        mobile: true,
        field: "csvFile",
        header: "Uploaded File",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },

      {
        show: true,
        textAlign: "center",
        width: 200,
        mobile: true,
        field: "duplicateFile",
        displayField: "duplicateFile",
        header: "Failed File",
        fieldType: 'Download',
        style: {
          color: config.templateColor,
          cursor: "pointer",
          textTransform: "capitalize",
        },
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 160,
        field: "createdByName",
        header: "Created By Name",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "total",
        fieldType: 'Number',
        header: "Total Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "failed",
        fieldType: 'Number',
        header: "Failed Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "success",
        fieldType: 'Number',
        header: "Success Records",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 80,
        field: "type",
        header: "Type",
        fieldType: 'Capitalize',
        filter: false,
        sortable: true,
        displayInSettings: true,
        textTransform: true,
      },
      // {
      //   show: true,
      //   textAlign: "left",
      //   width: 160,
      //   mobile: true,
      //   field: "csvFilePath",
      //   header: "Csv File Path",
      //   filter: false,
      //   sortable: true,
      //   textCapitalize: true,
      //   displayInSettings: true,
      // },
      // {
      //   show: true,
      //   textAlign: "center",
      //   width: 140,
      //   field: "duplicateFile",
      //   mobile: true,
      //   header: "Duplicate File",
      //   filter: false,
      //   sortable: true,
      //   displayInSettings: true,
      // },
      // {
      //   show: true,
      //   textAlign: "left",
      //   width: 180,
      //   field: "duplicateFilePath",
      //   mobile: true,
      //   header: "Duplicate File Path",
      //   filter: false,
      //   sortable: true,
      //   displayInSettings: true,
      // },
      {
        show: true,
        textAlign: "left",
        width: 120,
        field: "status",
        mobile: true,
        header: "Status",
        fieldType: "Badge",
        style: {
          padding: "4px 6px",
          fontSize: 12,
          color: "white",
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        options: config.uploadStatusTypes,
        filter: false,
        sortable: false,
      },

      {
        show: true,
        textAlign: "left",
        width: 180,
        field: "created",
        header: "Created",
        fieldType: 'Date',
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      
    ];
    return data;
  };

  render() {
    return (
      <DataTables
        // MobileTableFields={this.getMobileTableFields}
        // getTableFields={this.getTableFields}
        // formFields={this.getFormFields}
        // 
        // globalSearch={'Display Name/Email'}
        // type='Users'
        // apiUrl={apiCalls.Users}
        getTableFields={this.getTableFields}
        formFields={this.getFormFields}
        exportRequried={true}
        printRequried={true}
        addRequried={false}
        editRequired={true}
        deleteRequired={true}
        viewRequired={true}
        settingsRequired={true}
        filterRequired={false}
        gridRequried={true}
        exportToCsv={true}
        sample={false}
        sampleFilePath={filePath.users}
        globalSearch={'Created By Name/Status'}
        type='Uploads'
        routeTo={'Uploads'}
        displayViewOfForm='screen'
        apiResponseKey={apiCalls.Uploads}
        apiUrl={apiCalls.Uploads}

      />
    );
  }
}