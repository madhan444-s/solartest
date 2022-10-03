import React from 'react';
import { Button, Input, FormGroup, Label, Col, FormFeedback, FormText } from 'reactstrap';

// config file
export default class DefaultInput extends React.Component {
    constructor(props) {
        super(props);

    }

    handleChange = (event) => {
        if (this.props.handlerFromParent) {
            this.props.handlerFromParent(event.target.value, event.target.name);
        }
    }

    render() {
        return (
            <div>
                {/* <FormGroup row>
                    <Label for="firstName" className='modalLabelStyle'>{this.props.label ? this.props.label : null}</Label> */}
                <div className="form__form-group-field">
                    <textarea style={{ background: 'white' }} className='theme-light form textarea'
                        type={this.props.type ? this.props.type : null}
                        name={this.props.name ? this.props.name : null}
                        id={this.props.id ? this.props.id : null}
                        placeholder={this.props.placeholder ? this.props.placeholder : null}
                        value={this.props.value ? this.props.value : ''}
                    // onChange={this.handleChange}
                    />
                </div>
                <div style={{ color: '#dc3545' }}>{this.props.message ? this.props.message : null}</div>
                {/* </FormGroup> */}
            </div>
        );
    }
}