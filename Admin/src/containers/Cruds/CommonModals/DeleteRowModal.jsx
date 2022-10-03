import React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';


// config file
export default class DeleteRowModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    deleteSelectedRow = () => {
        this.props.deleteSelectedRow();
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.openDeleteModal}
                    className='modal-dialog-centered modal-dialog--primary m-auto logout_modal_width'
                >
                    <ModalBody className='deleteModalBody'>
                        <div style={{ marginBottom: 10 }}>Are you sure want to Delete?</div>
                        <Button color="primary" outline onClick={this.props.closeDeleteModal} className='deleteModalBtn marginRight'>No</Button>
                        <Button color="primary" outline onClick={this.deleteSelectedRow}
                            className='deleteModalBtn'>Yes</Button>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}