import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { load as loadAccount } from './../../../redux/reducers/commonReducer';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';

import fetchMethodRequest from '../../../config/service';

// Loader
import Loader from '../../App/Loader';

// Slect
import Select from '../../../shared/components/form/Select'

export default class ViewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: {},
      label: '',
      status: '',
      type: null
    };
  }

  componentDidMount = () => {
    this.props.onRef(this);
  };

  componentWillUnmount() {
    this.props.onRef(null);
  }

  getRowData = async (rowData) => {
    this.setState({
      rowData: rowData,
    });
    if (this.props.type == 'Teams') {
    }
  };

  render() {
    const modalClass = classNames({
      'modal-dialog--colored': this.state.colored,
      'modal-dialog--header': this.state.header,
    });
    return (
      <div style={{ display: 'flex' }}>
        <Modal isOpen={this.props.openViewModal}
          className={` modal-dialog--primary modal-dialog--header ${modalClass}`}
        >
          <ModalHeader className="modal__header viewModalHeader" >
            {this.props.type} Details
            <button className="lnr lnr-cross modal__close-btn" type="button" onClick={this.props.closeViewModal} />
          </ModalHeader>
          <ModalBody>
            {this.state.rowData && this.state.rowData.length > 0 ?
              <div className="row form" >
                {this.state.rowData.map((item, i) => {
                  return (
                    item.value != "" || null ?
                      <div className="col-sm-6" key={i}>
                        <div className="row" style={{ margin: "auto" }}>
                          <div
                            className="col-sm-5"
                            style={{ textAlign: "left", padding: "5px 5px" }}>
                            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
                              {item.label}
                            </span>
                          </div>

                          <div className="col-sm-7"
                            style={{ textAlign: "left", padding: "5px 0px" }}>
                            <span>{item.value}</span>
                          </div>
                        </div>
                      </div> : null
                  );
                })}
              </div>
              : null}
          </ModalBody>
          {/* <ModalFooter style={{ width: "100%", height: "auto", padding: 10 }}>
            <Button color="primary" onClick={this.props.closeViewModal}>
              Close
            </Button>
          </ModalFooter> */}
        </Modal>

      </div >
    );

  }
}
ViewModal = reduxForm({
  form: "View Form", // a unique identifier for this form
})(ViewModal);

// You have to connect() to any reducers that you wish to connect to yourself
ViewModal = connect(
  state => ({
    initialValues: state.commonData.data // pull initial values from account reducer
  }),

  { load: loadAccount } // bind account loading action creator
)(ViewModal);

