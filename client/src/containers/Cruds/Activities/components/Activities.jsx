import React from 'react';
import DataTables from '../../CommonDataTable/DataTable';
import config from '../../../../config/config';
import apiCalls from '../../../../config/apiCalls'
import store from '../../../App/store';
import RolePermissions from '../../CommonModals/Permissions';
import ViewModal from '../../CommonModals/viewModal';

// config file
export default class Activities extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'Activities',
			rolePermission: ""
		};
	}

	static getDerivedStateFromProps(props, state) {
		let storeData = store.getState()
		let languageData = storeData && storeData.settingsData && storeData.settingsData.settings && storeData.settingsData.settings.languageTranslation ? storeData.settingsData.settings.languageTranslation : ""
		return { languageData: languageData };
	}

	componentDidMount = () => {
		//Screen permisions value can be edit,view, no view
		let screenPermissions = RolePermissions.screenPermissions('Activities');
		if (screenPermissions) {
			this.setState({
				rolePermission: screenPermissions
			})
		}
	}

	getTableFields = () => {
		let { languageData } = this.state
		let data =
			[
				{
					textAlign: "center",
					width: 47,
					field: "Sno",
					header: "Sno",
					label: "Sno",
					filter: false,
					sortable: false,
					mobile: true,
					placeholder: "Search",
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "center",
					show: true,
					mobile: true,
					width: 80,
					field: "created",
					label: "Created",
					fieldType: "Date",
					dateFormat: config.dateTimeFormat,
					header: "Created Date",
					filter: false,
					sortable: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "context",
					mobile: true,
					header: "Context",
					label: "Context",
					filter: false,
					sortable: true,
					show: true,
					textCapitalize: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "contextType",
					mobile: true,
					label: "Context Type",
					header: "Context Type",
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "email",
					mobile: true,
					label: "Email",
					header: "Email",
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					show: true,
					textAlign: "left",
					width: 80,
					mobile: true,
					field: "desc",
					header: "Description",
					filter: false,
					label: "Description",
					sortable: true,
					textCapitalize: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "ipAddress",
					label: "Ip Address",
					mobile: true,
					header: 'Ip Address',
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "deviceType",
					label: "Device Type",
					mobile: true,
					header: 'Device Type',
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: "browserName",
					label: "Browser Name",
					mobile: true,
					header: 'Browser Name',
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: 'osName',
					label: "Os Name",
					mobile: true,
					header: 'Os Name',
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},
				{
					textAlign: "left",
					width: 80,
					field: 'osVersion',
					label: "Os Version",
					mobile: true,
					header: 'Os Version',
					filter: false,
					sortable: true,
					show: true,
					displayInSettings: true,
				},			]
		return data;
	};


	getFormFields = () => {
		let { languageData } = this.state
		return ([
			{
				'show': false,
				"value": "",
				"type": "text",
				"name": "firstName",
				"label": "First Name",
				"id": "firstName",
				"placeholder": "First Name",
				"required": true
			},
			
		]);
	}

	render() {
		return (
			<span>
				<DataTables
					getTableFields={this.getTableFields}
					formFields={this.getFormFields}
					actionsTypes={[{
						'name': 'Delete',
						"options": [
							{ 'label': 'Delete', 'value': 'Delete', 'show': this.state.rolePermission && this.state.rolePermission == "Edit" ? true : false, "multiple": true, },
						]
					},
					]}
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
					globalSearch={"Context/Email/Description"}
					type="Activities"
					apiResponseKey={"activities"}
					apiUrl={"activities"}
					routeTo='activities'
					displayViewOfForm='screen'
				/>
			</span>
		);
	}
}