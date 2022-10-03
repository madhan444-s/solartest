
const config = {

  // employee
  apiUrl: 'http://localhost:2152/api/',
  imgUrl: 'http://localhost:2152/images/',
  socketUrl: 'https://api.school.dosystemsinc.com',
  janusUrl: 'wss://janus.dosystemsinc.com:8989/janus',
  // janusUrl: 'wss://vyjanus.dosystemsinc.com:8989/janus',
  // janusUrl: 'ws://janus.dosystemsinc.com:8188/janus',
  serverErrMessage: 'Could Not reach server',

  //regex
  borderValidation: false,
  messages: true,

  entityType: 'employee',

  appName: 'Foretest',
  displayProjectName: false,
  displayRecaptcha: false,
  displayGoogleLogin: false,
  loginName: 'Employee',
  selectedLoginScreenName: "1",
  emailRegex: /^(?=.{1,50}$)[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/,
  aadharcardNumberRegex: /^([0-9]){12}$/,
  pancardNumberRegex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  //phoneNumberRegex: /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  phoneNumberRegex: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
  userNameRegex: /^[a-zA-Z\s]{1,30}$/,
  lastNameRegex: /^[a-zA-Z\s]{1,30}$/,
  subjectRegex: /^[a-zA-Z\s]{1,50}$/,
  companyRegex: /^([A-Za-z0-9\s@.,]){1,30}$/,
  roomIdRegex: /^([0-9]){4,10}$/,
  // server response codes
  updateResCode: 205,
  deleteResCode: 206,

  datePlaceholder: '--/--/----',
  dateFormat: 'MM/DD/YYYY',
  dateTabularFormat: 'MMM DD YYYY',
  dateDisplayModalFormat: 'DD MMM YYYY',
  dateDBFormat: 'MM-DD-YYYY',
  dateDayMonthFormat: 'DD-MM-YYYY',
  dateYearMonthFormat: 'YYYY-MM-DD',
  dayYearDateFormat: 'YYYY-MM-DD',
  basicDateFromat: 'MM/DD/YYYY HH:mm A',
  descDateFromat: 'MMM DD YYYY HH:mm A',

  timeFormat: 'HH:mm',
  syncTimeFormat: 'hh:mm A, MM-DD-YYYY',
  lastModifiedDateFormat: 'MM/DD/YYYY HH:mm',
  dateTimeFormat: 'MM/DD/YYYY hh:mm',
  fullDateFormat: 'YYYY-MM-DD HH:mm:ss',
  fullDateTimeFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSZ',
  dbDateFormat: 'YYYY-MM-DD[T]HH:mm:ss.SSZ',
  dbOnlyDateFormat: 'YYYY-MM-DD[T]00:00:00Z',
  ESTTimezone: "America/New_York",
  formFieldStatusTypes: [
    { label: "Active", value: "Active" },
    { label: "Pending", value: "Pending" },
    { label: "Inactive", value: "Inactive" }
  ],
  noView: 'noView',
  edit: 'edit',
  view: 'view',
  // templateColor: '#0e4768',
  whiteColor: '#ffffff',
  darkTemplateColor: '#00000045',
  avatarBgColor: 'green',
  blackColor: 'black',
  sourceKey: "qVtYv2x5A7CaFcHeMh",
  paginationPosition: 'top'
};
export default config;
