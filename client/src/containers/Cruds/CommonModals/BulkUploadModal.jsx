import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// File Upload
import FileUpload from '../../Form/components/FileUpload';

// config file
export default class BulkUploadModal extends React.Component {
    constructor(props) {
        super(props);
        this.clickCount = 0;
    }

    componentDidMount = () => {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount = () => {
        if (this.props.onRef) {
            this.props.onRef(null);
        }
    }

    uploadToServer = () => {
        if (this.clickCount == 0) {
            // this.clickCount++;
            this.fileUploadRef.UploadFileToServer();
        }
    }

    handleClickCount = () => {
        this.clickCount = 0;
    }

    render() {
        const { t } = this.props;

        return (
            <Modal isOpen={this.props.openBulkUploadModal}
                className={`modal-dialog-centered modal-dialog--primary modal-dialog--header `}>

                <ModalHeader className="modal__header">
                    <button className="lnr lnr-cross modal__close-btn" type="button"
                        onClick={() => this.props.closeBulkModal() && this.props.reload()} />
                    <p className="bold-text  modal__title"> {'Bulk Upload'} </p>
                </ModalHeader>
                <ModalBody>
                    <div className='row'>
                        <div className='col-5'>
                            {'Sample Document'}
                        </div>
                        <div className='col-7'>
                            <a className='btn btn-primary outline text-white' href={this.props.sampleFilePath}>Download</a>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-5'>
                            {'Please Attach File'}
                        </div>
                        <div className='col-7'>
                            <FileUpload type="bulkUpload"
                                onRef={(ref) => (this.fileUploadRef = ref)}
                                url={this.props.type}
                                close={this.props.closeBulkModal}
                                reload={this.props.reload}
                            />
                        </div>
                    </div>
                    <div className='row mt-5'>
                        <div className='col-sm-12 text-center'>
                            <Button color='primary' outline
                                onClick={() => this.props.closeBulkModal() && this.props.reload()}>{'Close'}</Button>
                            <Button color='primary'
                                onClick={this.uploadToServer}>{'Upload'} - {this.props.type}</Button>
                        </div>
                    </div>
                </ModalBody>

            </Modal >
        );
    }
}