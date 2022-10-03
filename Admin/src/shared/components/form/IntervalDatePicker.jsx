/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import MinusIcon from 'mdi-react/MinusIcon';
import PropTypes from 'prop-types';
import CalendarBlankIcon from 'mdi-react/CalendarBlankIcon';

class IntervalDatePickerField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChangeStart = startDate => this.handleChange({ startDate });

  handleChangeEnd = endDate => this.handleChange({ endDate });

  handleChange({ startDate, endDate }) {
    const { startDate: stateStartDate, endDate: stateEndDate } = this.state;

    // const { onChange } = this.props;

    startDate = startDate || stateStartDate;
    endDate = endDate || stateEndDate;

    // if (startDate.isAfter(endDate)) {
    //   endDate = startDate;
    // }
    this.setState({ startDate, endDate });

    this.props.onChange(startDate, endDate);
  }

  render() {
    const { startDate, endDate } = this.state;

    return (
      <div className="date-picker date-picker--interval col-sm-7 p-1">
        <CalendarBlankIcon />
        <DatePicker
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          onChange={this.handleChangeStart}
          dateFormat="dd-MM-yyyy"
          placeholderText="From"
          dropDownMode="select"
        />
        <MinusIcon className="date-picker__svg" style={{ marginLeft: '25px' }} />
        <CalendarBlankIcon />
        <DatePicker
          selected={endDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          onChange={this.handleChangeEnd}
          dateFormat="dd-MM-yyyy"
          placeholderText="To"
          dropDownMode="select"
        />
      </div>
    );
  }
}

const renderIntervalDatePickerField = (props) => {
  const { input } = props;
  return (
    <IntervalDatePickerField
      {...input}
      onChange={props.handleDateValueInParent}
    />
  );
};

renderIntervalDatePickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
  }),
};

export default renderIntervalDatePickerField;
