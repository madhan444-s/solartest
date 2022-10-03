
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import { load as loadAccount } from '../../../redux/reducers/commonReducer';

// fecth method from service.js file
import fetch from '../../../config/service';
import config from '../../../config/config';
import configMessage from '../../../config/configMessages';
// show message 
import showToasterMessage from '../../UI/ToasterMessage/toasterMessage';
import DefaultInput from '../../../shared/components/form/DefaultInput';
import validate from '../../Validations/validate';
import Loader from '../../App/Loader';
import EyeIcon from 'mdi-react/EyeIcon';
import { withTranslation } from 'react-i18next';

//validations
let newpassval = value => (value ? config.userPasswordRegex.test(value) ? undefined : 'Password must have at least 12 characters and contain at least 1 Uppercase and 1 special character.' : configMessage.fillField)

class UserPasswordResetModal extends React.Component {
    constructor(props) {
        super(props);
        this.buttonActionType = null;
        this.state = {
            isLoginSuccess: false,
            isLoading: true
        };
    }

    componentDidMount() {
        this.setState({ isLoading: false });
    }

    // on value change in input
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    showPassword = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    }

    showConfirmPassword = (e) => {
        e.preventDefault();
        this.setState(prevState => ({
            showConfirmPassword: !prevState.showConfirmPassword
        }));
    }

    // handle login user data
    handleUserPassword = async (values) => {
        await this.setState({
            isLoading: true
        });
        let userId = this.props.userId;
        let url = `auth/createPassword?adminReset=true&_id=${userId}&fromAdmin=true`;
        values.entityType = this.props.entityType;

        fetch('POST', url, values).then(async response => {
            if (response && response.respCode && response.respMessage) {
                showToasterMessage(response.respMessage, 'success');
            } else if (response && response.errorMessage) {
                showToasterMessage(response.errorMessage, 'error');
            }
            await this.setState({
                isLoading: false
            });
            await this.cancelReset();
        })
    }

    // clear input data
    clearInputFields = () => {
        this.props.reset();
    }

    submit = (values) => {
        if (values && values.newPassword === values.confirmPassword) {
            this.handleUserPassword(values)
        }
        // else if (values.newPassword && values.confirmPassword && values.newPassword !== values.confirmPassword) {
        //     newpassval = values => (configMessage.passwordMatchValidation)
        // }
    }

    cancelReset = async () => {
        await this.props.reset();
        await this.props.cancelReset();
    }

    render() {
        const { handleSubmit, openUserPasswordResetModal, t } = this.props;
        return (
            <Modal isOpen={openUserPasswordResetModal} centered
                className={`modal-dialog-centered modal-dialog--primary modal-dialog--header logout_modal_width `}
            >
                <ModalHeader className="modal__header">
                    <button className="lnr lnr-cross modal__close-btn" type="button"
                        onClick={this.cancelReset} />
                    <p className="bold-text  modal__title"> {t('Reset Password')} </p>
                </ModalHeader>
                <ModalBody className='p-2'>
                    <Loader loader={this.state.isLoading} />

                    <form className="form " onSubmit={handleSubmit(this.submit)}>
                        <div className='row mx-1 mt-3'>
                            <div className='col-sm-12 text-left'>
                                <div className="form__form-group pb-2">
                                    <label className="form__form-group-label">New Password</label>
                                    <div className=' form__form-group-field'>
                                        <Field className='inputLogin'
                                            type={this.state.showConfirmPassword ? 'text' : "password"}
                                            name="newPassword"
                                            component={DefaultInput}
                                            placeholder='New Password'
                                            validate={[newpassval]}
                                        />
                                        <button
                                            type="button"
                                            className={`form__form-group-button${this.state.showConfirmPassword ? ' active' : ''}`}
                                            onClick={e => this.showConfirmPassword(e)}
                                        ><EyeIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-12 text-left'>
                                <div className="form__form-group pb-1">
                                    <label className="form__form-group-label">Confirm Password</label>
                                    <div className='form__form-group-field'>
                                        <Field className='inputLogin'
                                            type={this.state.showPassword ? 'text' : "password"}
                                            name="confirmPassword"
                                            component={DefaultInput}
                                            validate={[newpassval]}
                                            placeholder='Confirm Password'
                                        /> <button
                                            type="button"
                                            className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                                            onClick={e => this.showPassword(e)}
                                        ><EyeIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-12 text-center pt-3'>
                                <div >
                                    <Button outline color="primary" type='buttom' onClick={this.cancelReset}>Cancel</Button>

                                    <Button color="primary" type='submit'>Submit</Button>
                                </div>
                            </div>
                        </div>

                    </form>
                </ModalBody>
            </Modal>
        );
    }
}

UserPasswordResetModal = reduxForm({
    form: 'User Password Reset Form', // a unique identifier for this form
    validate,
})(UserPasswordResetModal);

export default withTranslation('common')(UserPasswordResetModal);
