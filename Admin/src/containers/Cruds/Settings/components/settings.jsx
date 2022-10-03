import React from 'react';
import DataTables from '../../CommonDataTable/DataTable';
import config from '../../../../config/config';
import apiCalls from '../../../../config/apiCalls'
import store from '../../../App/store'
// config file
export default class Settings extends React.Component {
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
        let data = [
            {
                textAlign: 'center',
                show: true,
                width: 200,
                field: 'userEmail',
                header: languageData && languageData['userEmail'] ? languageData['userEmail'] : 'User Email',
                filter: true,
                sortable: true
            },
            {
                show: true,
                textAlign: 'center',
                width: 140,
                field: 'expireTokenTimeInMin',
                header: languageData && languageData['expireTokenTime'] ? languageData['expireTokenTime'] : 'Expire Token Time',
                filter: true,
                sortable: true
            },
            {
                show: true,
                textAlign: 'center',
                width: 185,
                field: 'adminExpireTokenTimeInMin',
                header: languageData && languageData['adminExpireTokenTime'] ? languageData['adminExpireTokenTime'] : 'Admin Expire Token Time',
                filter: true,
                sortable: true
            },
            {
                textAlign: 'center',
                show: true,
                width: 145,
                field: 'activeEmailExpireInMin',
                header: languageData && languageData['adminEmailExpiry'] ? languageData['adminEmailExpiry'] : 'Admin Email Expiry',
                filter: true,
                sortable: true,
            },
            {
                textAlign: 'center',
                show: true,
                width: 160,
                field: 'disableMultipleLoginString',
                header: languageData && languageData['disableMultipleLogin'] ? languageData['disableMultipleLogin'] : 'Disable Multiple Login',
                filter: true,
                sortable: true,
                // placeholder: config.dateDayMonthFormat
            },
            {
                textAlign: 'center',
                show: true,
                width: 75,
                field: 'enableMailsString',
                header: languageData && languageData['mails'] ? languageData['mails'] : 'Mails',
                type: 'date',
                filter: true,
                sortable: true,
                // placeholder: config.timeFormat
            },
            {
                textAlign: 'center',
                show: true,
                width: 160,
                field: 'enableTerminalLogsString',
                type: 'date',
                header: languageData && languageData['enableTerminalLogs'] ? languageData['enableTerminalLogs'] : 'Enable Terminal Logs',
                filter: true,
                sortable: true,
                // placeholder: config.timeFormat
            },
            {
                textAlign: 'center',
                show: true,
                width: 150,
                field: 'forgotEmailExpireInMin',
                header: languageData && languageData['forgotEmailExpiry'] ? languageData['forgotEmailExpiry'] : 'Forgot Email Expiry',
                filter: true,
                sortable: true
            },
            {
                textAlign: 'center',
                show: true,
                width: 85,
                field: 'language',
                header: languageData && languageData['language'] ? languageData['language'] : 'Language',
                filter: true,
                sortable: true,
                // filterElement: StatusTypes
            },

            {
                textAlign: 'left',
                show: true,
                width: 80,
                field: 'Actions',
                header: languageData && languageData['actions'] ? languageData['actions'] : 'Actions',
                filter: false,
                sortable: false
            },
        ];
        return data;
    };

    getFormFields = () => {
        let { languageData } = this.state
        let roleTypes = [
            {
                label: 'Admin',
                value: 'Admin'
            },
            {
                label: 'Super Admin',
                value: 'Super Admin'
            },

        ];
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
        let radioOptions = [
            {
                label: 'True',
                value: true
            },
            {
                label: 'False',
                value: false
            },
        ];
        return ([
            {
                value: '',
                type: 'text',
                name: 'expireTokenTimeInMin',
                label: languageData && languageData['expireTokenTime'] ? languageData['expireTokenTime'] : 'Expiry Token Time (min)',
                id: 'expireTokenTimeInMin',
                placeholder: 'Expiry Token Time',
                required: true,
            },
            {
                value: '',
                type: 'text',
                name: 'adminExpireTokenTimeInMin',
                label: languageData && languageData['adminExpireTokenTime'] ? languageData['adminExpireTokenTime'] : 'Admin Expiry Token Time (min)',
                id: 'adminExpireTokenTimeInMin',
                placeholder: 'Admin Expiry Token Time',
                required: true
            },

            {
                value: '',
                type: 'text',
                name: 'activeEmailExpireInMin',
                label: languageData && languageData['adminEmailExpiry'] ? languageData['adminEmailExpiry'] : 'Admin Email Expiry (min)',
                id: 'activeEmailExpireInMin',
                placeholder: 'Active Email Expiry',
                required: true
            },
            {
                // required: true,
                value: '',
                type: 'radio',
                name: 'enableMails',
                label: languageData && languageData['enableMails'] ? languageData['enableMails'] : 'Enable Mails',
                id: 'enableMails',
                options: radioOptions,
                placeholder: 'Enable Mails'
            },
            {
                // required: true,
                value: '',
                type: 'radio',
                name: 'disableMultipleLogin',
                label: languageData && languageData['disableMultipleLogin'] ? languageData['disableMultipleLogin'] : 'Disable Multiple Login',
                id: 'disableMultipleLogin',
                options: radioOptions,
                placeholder: 'Disable Multiple Login'
            },
            {
                // required: true,
                value: '',
                type: 'radio',
                name: 'enableTerminalLogs',
                label: languageData && languageData['enableTerminalLogs'] ? languageData['enableTerminalLogs'] : 'Enable Terminal Logs',
                id: 'enableTerminalLogs',
                options: radioOptions,
                placeholder: 'Enable Terminal Logs'
            },
        ]);
    }
    getMobileTableFields = () => {
        let data = [
            { textAlign: 'center', field: 'userEmail', header: 'Subject', icon: 'book', className: 'subject_text' },
            { textAlign: 'center', field: 'roomId', header: 'From Time', icon: 'clock', className: 'rowdata_end' },
            { textAlign: 'center', field: 'meetingDate', header: 'From Time', icon: 'clock', className: 'rowdata_end' },
            { textAlign: 'center', field: 'startTimeString', header: 'Teacher', icon: 'user', className: 'subText' },
            { textAlign: 'center', field: 'endTimeString', header: 'Status', icon: 'video', className: 'rowdata_end' },
            { textAlign: 'center', field: 'status', header: 'Status', icon: 'video', className: 'rowdata_end' },
        ];

        return data;
    };
    render() {
        return (
            <DataTables
                // MobileTableFields={this.getMobileTableFields}
                // getTableFields={this.getTableFields}
                // formFields={this.getFormFields}
                // globalSearch={'Display Name/Email'}
                // type='Setting'
                // apiUrl={apiCalls.Settings}
                getTableFields={this.getTableFields}
                formFields={this.getFormFields}
                exportRequried={true}
                printRequried={true}
                actionsTypes={[{
                    'name': 'Delete',
                    "options": [
                        { 'label': 'Delete', 'value': 'Delete', 'show': true, "multiple": true, },
                    ]
                },
                // {
                //   'name': 'Block',
                //   "options": [
                //     { 'label': 'Block', 'value': 'Block', 'show': true, "multiple": false, }
                //   ]
                // },
                {
                    'name': 'ResetPassword',
                    "options": [
                        { 'label': 'ResetPassword', 'value': 'ResetPassword', 'show': true, "multiple": false, }
                    ]
                },
                {
                    'name': 'Submit',
                    'action': this.submit,
                    "options": [
                        { 'label': 'Submit', 'value': 'Submit', 'show': true, "multiple": false },
                    ]
                }
                ]}
                addRequried={true}
                editRequired={true}
                deleteRequired={true}
                viewRequired={true}
                settingsRequired={true}
                filterRequired={true}
                gridRequried={true}
                sample={false}
                globalSearchFieldName='email'
                globalSearch={'Display Name/Email'}
                type='Setting'
                apiUrl={apiCalls.Settings}
                routeTo='setting'
                displayViewOfForm='screen'
                apiResponseKey='settings'
            />
        );
    }
}