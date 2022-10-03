import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';
import Editor from '../../Form/components/Editor'
import classNames from 'classnames';

export default class ModalComponent extends PureComponent {
    constructor() {
        super();
        this.state = {
            modal: false,
            text: ''
        };
    }

    getEditorText = (e) => {
        this.setState({
            text: e.htmlValue
        })
    }

    sendCommentsToserver = () => {
        this.props.commentsData(this.state.text, 'comments')
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.props.openEditorModal}
                >
                    <ModalHeader className="modal__header">
                        <button className="lnr lnr-cross modal__close-btn mt-3" type="button" onClick={this.props.closeEditorModal} />
                        <h4 className="bold-text  modal__title">Comments</h4>
                    </ModalHeader>
                    <ModalBody>
                        <div className="modal__body p-1">
                            <Editor
                                getEditorText={this.getEditorText} />
                        </div>
                    </ModalBody>
                    <ModalFooter className="modal__footer mb-3">
                        <Button color='primary' outline
                            onClick={this.props.closeEditorModal}>Cancel
                            </Button>
                        <Button color='primary' outline
                            onClick={this.sendCommentsToserver}>Create
                            </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
