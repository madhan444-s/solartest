const mailConfig = {
  mailSettings: {
    adminUrl : 'http://admin.foretest.dosystemsinc.com',
clientUrl : 'http://client.foretest.dosystemsinc.com',
serverUrl : 'http://api.foretest.dosystemsinc.com',

    websiteName: 'project',
    mailType: 'smtp',
    activateMails: true,
    from: 'projectname <email>',
    smtpOptions:{
        },
    gmailOptions: {
      service: 'Gmail',
      auth: {
        user: 'email', // Your email id
        pass: 'password' // Your password
      }
    },
    sesEmailSettings: {
      key: 'xxxxxxxxxxxxxx',
      secret: 'xxxxxxxxxxxxxxxxxxxxxx'
    }
  }
};

export default mailConfig;