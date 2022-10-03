import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import * as moment from 'moment';

import config from '../../../config/config';

class DatePickerField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }),

  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: null
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount = () => {
    if (this.props.currentDate) {
      let date = this.props.currentDate ? this.props.currentDate : null;
      this.handleChange(date);
    }
  }

  handleChange(date) {
    const { onChange } = this.props.input;
    if (date) {
      this.setState({
        startDate: moment(date).toDate(),
      });
      onChange(moment(date).format(config.dateDBFormat));
    }

  }

  updateDatePickerValues = () => {
    this.setState({
      startDate: null,
    });
    const { onChange } = this.props.input;
    if (onChange) {
      onChange(null)
    }
  }

  render() {
    const { startDate } = this.state;
    const { meta, clear } = this.props;
    const { name, onChange, value } = this.props.input;
    if ((name == 'startDate' || name == 'endDate') && this.props.minDate && !(startDate && value)) {
      onChange(moment(this.props.minDate).format(config.dateDBFormat));
    }
    const date = startDate ? startDate : value ? moment(value).toDate() : this.props.minDate ? this.props.minDate : null;

    return (
      <div className="date-picker mb-2">
        <DatePicker
          className="form__form-group-datepicker mb-2"
          selected={clear ? this.updateDatePickerValues() : date}
          onChange={this.handleChange}
          dateFormat="dd-MM-yyyy"
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={20}
          dropDownMode="select"
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          placeholderText='Select Date'
        />
        <div style={{ height: '13px' }}>
          {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
        </div>
        {/* {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>} */}
      </div>
    );
  }
}

const renderDatePickerField = (props) => {
  const { input } = props;
  return <DatePickerField  {...input} {...props}
    clear={props.clear} />;

};

renderDatePickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
};

export default renderDatePickerField;
