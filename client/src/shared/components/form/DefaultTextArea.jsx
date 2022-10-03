import React from 'react';
import { Button, Input, FormGroup, Label, Col, FormFeedback, FormText } from 'reactstrap';

// config file
export default class DefaultTextArea extends React.Component {
    constructor(props) {
        super(props);

    }

    handleChange = (event) => {
        if (this.props.handlerFromParent) {
            this.props.handlerFromParent(event.target.value, event.target.name);
        }
    }

    render() {
        const { input, placeholder, type, isDisable, meta: { touched, error } } = this.props;

        return (
            <div className="form__form-group-input-wrap">
                <textarea className='mb-2' style={{ background: 'white' }} {...input} disabled={isDisable} placeholder={placeholder} type={type} />
                {/* {touched && error && <span className="form__form-group-error">{error}</span>} */}
                <div style={{ height: '13px' }}>
                    {touched && error && <span className="form__form-group-error">{error}</span>}
                </div>
            </div>
        );
    }
}