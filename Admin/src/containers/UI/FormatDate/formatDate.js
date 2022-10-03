import Moment from 'moment';
import config from '../../../config/config'

const removeZFromDate = (specificDate) => {
  let newDate = JSON.stringify(specificDate);
  return JSON.parse(newDate.replace('Z', ''));
}
export default {
  formatDate: (specificDate, expectedformat = config.dbDateFormat) => {
    if (specificDate === 'todayDate') {
      return Moment().tz(config.ESTTimezone).format(expectedformat); // est time
    } else if (specificDate === 'UTCTimeNow') {
      return Moment.utc().format(expectedformat); // utc time
    } else {
      if (specificDate) {
        // let newDate = removeZFromDate(specificDate);
        return Moment(specificDate).format(expectedformat); // selected date time
      } else {
        return null;
      }
    }
  },
  datesComparisionSame: (newDate, currentDate) => {
    if (newDate && currentDate) {
      let newDateModified = removeZFromDate(newDate);
      let currentDateModified = removeZFromDate(currentDate);
      return Moment(newDateModified).isSame(currentDateModified);
    } else {
      return null;
    }
  },
  addDaysToDate: (date, days) => {
    if (date) {
      let newDate = removeZFromDate(date);
      let dateAfterDays = Moment(newDate).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
      return dateAfterDays;
    } else {
      return
    }
  },
  datesComparisionWithSameOrAfter: (newDate, currentDate) => {
    if (newDate && currentDate) {
      let newDateModified = removeZFromDate(newDate);
      let currentDateModified = removeZFromDate(currentDate);
      return Moment(currentDateModified).isSameOrAfter(newDateModified);
    } else {
      return null;
    }
  },
  datesComparisionSameOrBefore: (newDate, currentDate) => {

    if (newDate && currentDate) {
      let newDateModified = removeZFromDate(newDate);
      let currentDateModified = removeZFromDate(currentDate);
      return Moment(newDateModified).isSameOrBefore(currentDateModified);
    } else {
      return null;
    }
  },
  datesComparisionBefore: (newDate, currentDate) => {

    if (newDate && currentDate) {
      let newDateModified = removeZFromDate(newDate);
      let currentDateModified = removeZFromDate(currentDate);
      return Moment(newDateModified).isBefore(currentDateModified);
    } else {
      return null;
    }
  },
  datesComparisionAfter: (newDate, currentDate) => {
    if (newDate && currentDate) {
      let newDateModified = removeZFromDate(newDate);
      let currentDateModified = removeZFromDate(currentDate);
      return Moment(newDateModified).isAfter(currentDateModified);
    } else {
      return null;
    }
  },
  getYearsFromDate: (date) => {
    let age = Moment().diff(date, 'years')
    return age.toString();
  },
  differenceBetweenDatesInYears: (date1, date2, type) => {
    type = type ? type : 'years';
    let age = Moment(date1).diff(Moment(date2), type);
    return age;
  },
};