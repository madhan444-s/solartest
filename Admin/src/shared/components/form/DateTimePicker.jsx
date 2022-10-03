import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';

class DateTimePickerField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
    };
  }

  handleChange = (date) => {
    const { onChange } = this.props;
    onChange(date);
  };

  render() {
    const { value } = this.props;
    return (
      <div className="date-picker">
        <DatePicker
          timeFormat="HH:mm"
          className="form__form-group-datepicker"
          selected={value}
          onChange={this.handleChange}
          showTimeSelect
          dateFormat="dd-MM-yyyy HH:mm"
          dropDownMode="select"
        />
      </div>
    );
  }
}

const renderDateTimePickerField = (props) => {
  const { input, meta } = props;
  return <div>
    <DateTimePickerField {...input} />
    {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
  </div>;
};

renderDateTimePickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
};

export default renderDateTimePickerField;
