import React, { PureComponent } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class SelectField extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
      }),
    ]),
  };

  static defaultProps = {
    placeholder: '',
    options: [],
  };

  constructor(props) {
    super(props)
    this.state = {
      value: null,
      defaultValue: this.props.defaultValue ? this.props.options[0] : null
    }

  }
  handleChange = (selectedOption) => {
    const { onChange, name } = this.props.input;
    this.setState({
      value: selectedOption
    });
    // if (name == 'categoryId' || name == 'category') {
    //   this.props.getCategoryTypes(selectedOption, name);
    // }
    // 
    if (name == 'status') {
      // this.props.getTicketStatus(selectedOption);
    }
    onChange(selectedOption.value);
  };

  render() {
    const { placeholder, options, isDisable
    } = this.props;
    const { name, value } = this.props.input;
    const isValue = { label: value, value: value };
    const selectValue = this.state.value ? this.state.value :
      isValue && isValue.value ? isValue :
        this.state.defaultValue ? this.state.defaultValue : null
    if (!value && !this.state.value) {
      if (this.state.defaultValue) {
        this.handleChange(this.state.defaultValue);
      }
    }
    return (
      <Select
        name={name}
        value={selectValue}
        onChange={this.handleChange}
        options={options}
        clearable={false}
        className="react-select"
        placeholder={placeholder}
        classNamePrefix="react-select"
        style={isDisable ? { background: 'lightgray', border: "none" } :
          { background: 'white' }} {...placeholder}
        isDisabled={isDisable}
      />
    );
  }
}

const renderSelectField = (props) => {
  const { meta } = props;
  return (
    <div className="form__form-group-input-wrap">
      <SelectField
        className='mb-2'
        {...props}
      />
      <div style={{ height: '13px' }}>
        {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
      </div>
      {/* {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>} */}
    </div>
  );
};

renderSelectField.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func,
    name: PropTypes.string,
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })),
  placeholder: PropTypes.string,
};

renderSelectField.defaultProps = {
  meta: null,
  options: [],
  placeholder: '',
};

export default renderSelectField;
