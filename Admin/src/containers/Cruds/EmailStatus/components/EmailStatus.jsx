import React from "react";
import apiCalls from "../../../../config/apiCalls";
import store from "../../../App/store";
import filePath from "../../../../config/configSampleFiles";
import DataTables from "../../CommonDataTable/DataTable";
import config from "../../../../config/config";

// config file
export default class Class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    let storeData = store.getState();
    let languageData =
      storeData &&
        storeData.settingsData &&
        storeData.settingsData.settings &&
        storeData.settingsData.settings.languageTranslation
        ? storeData.settingsData.settings.languageTranslation
        : "";
    return { languageData: languageData };
  }

  getTableFields = () => {
    let data = [
      {
        textAlign: "center",
        width: 47,
        field: "Sno",
        header: "Sno",
        label: "Sno",
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
        field: "to",
        header: "To",
        label: "TO",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 160,
        mobile: true,
        field: "from",
        header: "From",
        label: "From",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 160,
        mobile: true,
        field: "bcc",
        label: "Bcc",
        header: "Bcc",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 140,
        field: "subject",
        mobile: true,
        header: "Subject",
        label: "Subject",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 180,
        field: "html",
        mobile: true,
        header: "Html",
        label: "Html",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 180,
        field: "templateName",
        mobile: true,
        label: "Template Name",
        header: "Template Name",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 100,
        field: "status",
        mobile: true,
        header: "Status",
        label: "Status",
        fieldType: "Badge",
        style: {
          padding: "4px 6px",
          fontSize: 12,
          color: "white",
          textTransform: "capitalize",
          fontWeight: "bold",
        },
        options: [
          {
            label: "Sent",
            value: "Sent",
            color: "success",
          },
          {
            label: "Pending",
            value: "Pending",
            color: "danger",
          },
          {
            label: "Failed",
            value: "Failed",
            color: "danger",
          },
        ],
        filter: false,
        sortable: false,
      },
      {
        show: true,
        textAlign: "left",
        width: 160,
        field: "reason",
        header: "Reason",
        label: "Reason",
        filter: false,
        sortable: true,
        displayInSettings: true,
      },
      {
        show: true,
        textAlign: "left",
        width: 180,
        field: "created",
        header: "Created",
        label: "Created",
        fieldType: "Date",
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
        getTableFields={this.getTableFields}
        viewRequired={true}
        settingsRequired={true}
        globalSearch={"To/From/Template Name"}
        type="Email Status"
        apiUrl={"emailStatus"}
        exportRequried={false}
        printRequried={false}
        addRequried={false}
        editRequired={false}
        deleteRequired={false}
        viewRequired={false}
        settingsRequired={true}
        filterRequired={false}
        gridRequried={false}
        sample={false}
        globalSearchFieldName='activity'
        apiResponseKey={"emailstatus"}
        routeTo='emailStatus'
        displayViewOfForm='screen'
      />
    );
  }
}
