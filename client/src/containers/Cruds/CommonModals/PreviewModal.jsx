import React from 'react';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import CheckBox from '../../../shared/components/form/CheckBox';
import RenderFileInputField from '../../Form/components/FileUpload';

import { Field, reduxForm } from 'redux-form';
import Loader from '../../App/Loader';
class PreviewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldsmain: [],
        };
    }

    componentDidMount = async () => {
        let data = this.props.emailTemplateData;
        if (document.getElementById('templateText')) {
            document.getElementById('templateText').innerHTML = data['templateText']
        }
    }
    render() {
        const { t, type, emailTemplateData } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                <Loader loader={this.state.isLoading} />
                <Modal isOpen={this.props.isPreviewModal}
                    className={` modal-dialog--primary modal-dialog--header `}
                >
                    <ModalHeader className="modal__header viewModalHeader" >
                        Email Preview
                        <button className="lnr lnr-cross modal__close-btn" type="button"
                            onClick={this.props.closePreviewModal} />
                    </ModalHeader>
                    <ModalBody id='templateText'>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
PreviewModal = reduxForm({
    form: "PreviewModal Form", // a unique identifier for this form
    enableReinitialize: true,
})(PreviewModal);

export default withTranslation('common')(PreviewModal);