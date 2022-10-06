import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import fetchRequest from '../../../config/service';
import apiCalls from '../../../config/apiCalls';
import showToasterMessage from '../../UI/ToasterMessage/toasterMessage';


// config file
export default class LogoutModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    logout = () => {
        this.props.closeLogoutModal('close');
        return fetchRequest('POST', apiCalls.logoutUser)
            .then(async (response) => {
                if (response && response.respCode && response.respCode == 200) {
                    console.log("logged out successfully.")
                    localStorage.clear()
                } else if (response && response.errorMessage) {
                    showToasterMessage(response.errorMessage, 'error');
                }
            })
            .catch((err) => {
                showToasterMessage(err, 'error');
            });
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.openLogoutModal}
                    className={`modal-dialog-centered modal-dialog--primary m-auto`}
                    style={{ maxWidth: 400 }}>
                    <ModalBody >
                        <div style={{ marginBottom: 10 }}>Are you sure want to Logout?</div>
                        <Button color="primary" outline onClick={this.props.closeLogoutModal}
                            className='deleteModalBtn marginRight'>No</Button>
                        <Button color="primary" outline onClick={this.logout}
                            className='deleteModalBtn'>Yes</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}