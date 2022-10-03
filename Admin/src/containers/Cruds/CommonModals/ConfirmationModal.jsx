import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';


// config file
export default class confirmationModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    deleteSelectedRow = () => {
        // this.props.deleteSelectedRow();
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.openConfirmationModal} className='deleteModalHeight'>
                    <ModalBody className='deleteModalBody'>
                        <div style={{ marginBottom: 10 }}>Are you sure want to {this.props.text}?</div>
                        <Button color="primary" outline onClick={this.props.closeConfirmationModal} className='deleteModalBtn marginRight'>No</Button>
                        <Button color="primary" outline onClick={this.props.confirm}
                            className='deleteModalBtn'>Yes</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}