import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'rc-time-picker';
import AvTimerIcon from 'mdi-react/AvTimerIcon';
import classNames from 'classnames';
import moment from 'moment'

class TimePickerField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    timeMode: PropTypes.bool.isRequired,
  };

  state = {
    open: false,
  };

  setOpen = ({ open }) => {
    this.setState({ open });
  };

  toggleOpen = (e) => {
    e.preventDefault();
    this.setState(prevState => ({ open: !prevState.open }));
  };

  onChange = (value) => {
    const { onChange } = this.props;
    onChange(value)
  }
  render() {
    const { name, onChange, timeMode, value } = this.props;

    console.log('time picker value',value)
    const { open } = this.state;
    const btnClass = classNames({
      'form__form-group-button': true,
      active: open,
    });
    return (
      <div className="form__form-group-field">
        <TimePicker
          open={open}
          onOpen={this.setOpen}
          onClose={this.setOpen}
          name={name}
          onChange={this.onChange}
          showSecond={false}
          use12Hours={timeMode}
          value={value ? moment(value) : null}
          id={name}
          autoComplete='off'
        />
        <button
          className={btnClass}
          style={{ borderColor: 'transparent' }}
          type="button"
          onClick={this.toggleOpen}
        >
          <AvTimerIcon />
        </button>
      </div>
    );
  }
}

const renderTimePickerField = (props) => {
  const { input, timeMode, meta } = props;
  return (
    <div style={{width:'100%'}}>
      <TimePickerField
        {...input}
        timeMode={timeMode}
      />
      {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
    </div>
  );
};

renderTimePickerField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  timeMode: PropTypes.bool,
};

renderTimePickerField.defaultProps = {
  timeMode: false,
};

export default renderTimePickerField;
