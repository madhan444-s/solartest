const config = {
  activityConfig: {
    settingsCreate: {
      context: 'SETTINGS',
      contextType: 'CREATE',
      desc: 'Settings created',
      key: '101'
    },
    settingsUpdate: {
      context: 'SETTINGS',
      contextType: 'UPDATE',
      desc: 'Settings updated',
      key: '102'
    },
    settingsDelete: {
      context: 'SETTINGS',
      contextType: 'DELETE',
      desc: 'Settings deleted',
      key: '103'
    },
    employeeCreate: {
      context: 'EMPLOYEE',
      contextType: 'CREATE',
      desc: 'Employee created',
      key: '151'
    },
    employeeUpdate: {
      context: 'EMPLOYEE',
      contextType: 'UPDATE',
      desc: 'Employee Updated',
      key: '152'
    },
    employeeDelete: {
      context: 'EMPLOYEE',
      contextType: 'DELETE',
      desc: 'Employee deleted',
      key: '153'
    },
    employeeLogoutSuccess: {
      context: 'EMPLOYEE',
      contextType: 'LOGOUT',
      desc: 'Employee logout',
      key: '202'
    },
    employeeLoginSuccess: {
      context: 'EMPLOYEE',
      contextType: 'LOGIN',
      desc: 'Employee login',
      key: '205'
    },
    employeeChangePassword: {
      context: 'EMPLOYEE',
      contextType: 'CHANGEPASSWORD',
      desc: 'EMPLOYEE CHANGEPASSWORD',
      key: '206'
    },
    employeeForgotPassword: {
      context: 'EMPLOYEE',
      contextType: 'FORGOTPASSWORD',
      desc: 'EMPLOYEE FORGOTPASSWORD',
      key: '207'
    },
    roleCreate: {
      context: 'ROLE',
      contextType: 'CREATE',
      desc: 'Role created',
      key: '301'
    },
    roleUpdate: {
      context: 'ROLE',
      contextType: 'UPDATE',
      desc: 'Role updated',
      key: '302'
    },
    roleDelete: {
      context: 'ROLE',
      contextType: 'DELETE',
      desc: 'Role deleted',
      key: '303'
    },
    templatesCreate: {
      context: 'TEMPLATE',
      contextType: 'CREATE',
      desc: 'templates created',
      key: '401'
    },
    templatesUpdate: {
      context: 'TEMPLATE',
      contextType: 'UPDATE',
      desc: 'templates Updated',
      key: '402'
    },
    templatesDelete: {
      context: 'TEMPLATE',
      contextType: 'DELETE',
      desc: 'Settings deleted',
      key: '403'
    },
    
employeeRegister : {
    context: 'EMPLOYEE',
    contextType: 'REGISTER',
    desc: 'EMPLOYEE REGISTER',
    key: '864'
}

,
employeeMultidelete : {
    context: 'EMPLOYEE',
    contextType: 'MULTIDELETE',
    desc: 'EMPLOYEE MULTIDELETE',
    key: '395'
}

,
employeeGet : {
    context: 'EMPLOYEE',
    contextType: 'GET',
    desc: 'EMPLOYEE GET',
    key: '813'
}

,
employeeList : {
    context: 'EMPLOYEE',
    contextType: 'LIST',
    desc: 'EMPLOYEE LIST',
    key: '334'
}

,
employeeCreate : {
    context: 'EMPLOYEE',
    contextType: 'CREATE',
    desc: 'EMPLOYEE CREATE',
    key: '811'
}

,
employeeUpdate : {
    context: 'EMPLOYEE',
    contextType: 'UPDATE',
    desc: 'EMPLOYEE UPDATE',
    key: '934'
}

,
employeeRemove : {
    context: 'EMPLOYEE',
    contextType: 'REMOVE',
    desc: 'EMPLOYEE REMOVE',
    key: '993'
}

,
employeeLoginSuccess : {
    context: 'EMPLOYEE',
    contextType: 'LOGINSUCCESS',
    desc: 'EMPLOYEE LOGINSUCCESS',
    key: '881'
}

,
employeeChangePassword : {
    context: 'EMPLOYEE',
    contextType: 'CHANGEPASSWORD',
    desc: 'EMPLOYEE CHANGEPASSWORD',
    key: '747'
}

,
employeeForgotPassword : {
    context: 'EMPLOYEE',
    contextType: 'FORGOTPASSWORD',
    desc: 'EMPLOYEE FORGOTPASSWORD',
    key: '956'
}

,
employeeLogoutSuccess : {
    context: 'EMPLOYEE',
    contextType: 'LOGOUTSUCCESS',
    desc: 'EMPLOYEE LOGOUTSUCCESS',
    key: '440'
}

,
employeeRegister : {
    context: 'EMPLOYEE',
    contextType: 'REGISTER',
    desc: 'EMPLOYEE REGISTER',
    key: '263'
}

,
companyMultidelete : {
    context: 'COMPANY',
    contextType: 'MULTIDELETE',
    desc: 'COMPANY MULTIDELETE',
    key: '909'
}

,
companyGet : {
    context: 'COMPANY',
    contextType: 'GET',
    desc: 'COMPANY GET',
    key: '251'
}

,
companyList : {
    context: 'COMPANY',
    contextType: 'LIST',
    desc: 'COMPANY LIST',
    key: '672'
}

,
companyCreate : {
    context: 'COMPANY',
    contextType: 'CREATE',
    desc: 'COMPANY CREATE',
    key: '394'
}

,
companyUpdate : {
    context: 'COMPANY',
    contextType: 'UPDATE',
    desc: 'COMPANY UPDATE',
    key: '384'
}

,
companyRemove : {
    context: 'COMPANY',
    contextType: 'REMOVE',
    desc: 'COMPANY REMOVE',
    key: '267'
}

,
userRegister : {
    context: 'USER',
    contextType: 'REGISTER',
    desc: 'USER REGISTER',
    key: '595'
}

,
userMultidelete : {
    context: 'USER',
    contextType: 'MULTIDELETE',
    desc: 'USER MULTIDELETE',
    key: '327'
}

,
userGet : {
    context: 'USER',
    contextType: 'GET',
    desc: 'USER GET',
    key: '349'
}

,
userList : {
    context: 'USER',
    contextType: 'LIST',
    desc: 'USER LIST',
    key: '517'
}

,
userCreate : {
    context: 'USER',
    contextType: 'CREATE',
    desc: 'USER CREATE',
    key: '791'
}

,
userUpdate : {
    context: 'USER',
    contextType: 'UPDATE',
    desc: 'USER UPDATE',
    key: '879'
}

,
userRemove : {
    context: 'USER',
    contextType: 'REMOVE',
    desc: 'USER REMOVE',
    key: '111'
}

,
userLoginSuccess : {
    context: 'USER',
    contextType: 'LOGINSUCCESS',
    desc: 'USER LOGINSUCCESS',
    key: '980'
}

,
userChangePassword : {
    context: 'USER',
    contextType: 'CHANGEPASSWORD',
    desc: 'USER CHANGEPASSWORD',
    key: '506'
}

,
userForgotPassword : {
    context: 'USER',
    contextType: 'FORGOTPASSWORD',
    desc: 'USER FORGOTPASSWORD',
    key: '532'
}

,
userLogoutSuccess : {
    context: 'USER',
    contextType: 'LOGOUTSUCCESS',
    desc: 'USER LOGOUTSUCCESS',
    key: '166'
}

,
userRegister : {
    context: 'USER',
    contextType: 'REGISTER',
    desc: 'USER REGISTER',
    key: '185'
}

,
  },
};

export default config;
