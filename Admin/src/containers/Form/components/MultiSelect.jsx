import React from 'react';
import { MultiSelect } from 'primereact/multiselect';
import PropTypes from 'prop-types';

export default class MultiSelectDropDown extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        meta: PropTypes.shape({
            touched: PropTypes.bool,
            error: PropTypes.string,
        })
    };
    constructor(props) {
        super(props);

    }

    onChange = (event) => {
        if (this.props.input) {
            const { name, onChange } = this.props.input;
            onChange(event.value);
        }
    }
    render() {
        const {
            filterElement, input
        } = this.props;
        const { touched, error } = this.props.meta;
        return (
            <div className="date-picker">
                <span className="p-fluid mb-2">
                    <MultiSelect
                        style={{ minWidth: '10%', lineHeight: 1 }}
                        appendTo={document.body}
                        value={(input && input.value) ? input.value : null}
                        options={filterElement}
                        onChange={(e) => this.onChange(e)}
                    />
                </span>

                {touched && error && !this.props.values && <span className="form__form-group-error">{error}</span>}
            </div>
        )
    }
}