import React from 'react';

export default class DefaultInput extends React.Component {
    constructor(props) {
        super(props);

    }

    onChange = (event) => {
        if (event && event.target) {
            const { onChange, name } = this.props.input;
            if (this.props.type == 'number') {
                if (event.target.value) {
                    let num = event.target.value;
                    if (name == 'noofDrawers' && num > 10) {
                        num = 10;
                    } else if (num <= 0) {
                        num = 0;
                    }
                    onChange(num);
                }
            } else {
                if (this.props.handleComments) {
                    this.props.handleComments(event.target.value)
                }
                onChange(event.target.value);
            }
        }
    }

    render() {
        const { input, placeholder, type, isDisable, meta: { touched, error }, className } = this.props;
        return (
            <div className={input.name == "password" && (!this.props.from) ? "form__form-group-input-wrap col-sm-11 pr-0 " : "form__form-group-input-wrap"}>
                <div className="form__form-group-field ">
                    <input style={isDisable ? { background: 'lightgray', border: "none" } :
                        { background: 'white' }} {...input}
                        className='mb-0'
                        disabled={isDisable}
                        placeholder={placeholder}
                        type={type}
                        onChange={(e) => this.onChange(e)}
                        maxLength={this.props.maxLength ? this.props.maxLength : null}
                        className={className}
                    />
                </div>
                {/* {touched && error && <span className="form__form-group-error">{error}</span>} */}
                <div style={{ height: '13px' }}>
                    {touched && error && <span className="form__form-group-error">{error}</span>}
                </div>
            </div>
        );
    }
}