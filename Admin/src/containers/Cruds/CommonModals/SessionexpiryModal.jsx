import React, { PureComponent, useState } from 'react';
import {
    Card, CardBody, Col, Row, Button, CardImg, ButtonToolbar, Popover, PopoverBody, Modal, ModalHeader, ModalBody, ModalFooter, Badge
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class SessionExpiryModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            SessionExpired: false,
            date: new Date(),
            pen: false,
            count: 60,
            SessionExpired1: false
        };
    }


    componentDidMount = async () => {

        // let spen = await this.props.adjustForm();
        // await this.setState({ pen: spen })
        // this.timerID = setInterval(
        //     () => this.tick(),
        //     1000
        // );

    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    redirectMethod = async () => {

        await this.setState({ SessionExpired: true })

    }
    logoutYes = async () => {
        localStorage.removeItem('loginBody');
        localStorage.removeItem('loginCredentials');

        sessionStorage.clear()
        await this.setState({ SessionExpired1: true, date: '', count: 60 })


    }
    closeSModal = async () => {
        await this.setState({ SessionExpired1: false, date: '', count: 60, pen: false })
        this.props.closeSModal();
    }
    logoutfunc = () => {
        localStorage.clear();
        sessionStorage.clear()
        this.setState({ SessionExpired: true, })
    }
    render() {
        const { isOpen, t } = this.props;
        return (
            <div>

                <Modal isOpen={this.props.SOpen} centered={true}>

                    {!this.state.SessionExpired ? <ModalHeader className="bold-text" style={{ backgroundColor: '#0e4768', color: 'white', textAlign: 'center' }}  >
                        {t("You're being timed out due to inactivity")}
                    </ModalHeader> : null}
                    <ModalBody className='content__modal'>
                        <h3 className="py-3">{t('We’re Sorry')} </h3>
                        <h3 className="py-3">{'Your session has expired please login again'}</h3>
                        {/* <h1 >{this.state.date ? this.state.date.toLocaleTimeString() : null}</h1> */}

                        <Row className="pt-2 justify-content-center">
                            <Col sm={12} className="text-center">
                                {/* <button onClick={this.logoutfunc} className="btn btn-primary">SIGN IN AGAIN</button> */}
                                {this.state.SessionExpired1 ? <Redirect to="/log_in" /> : null}
                                {this.state.SessionExpired ? <Button className="recipients-button large create btn-create " size="lg" type="button" onClick={this.logoutYes}>{t('Okay')}</Button> : null}


                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Link className="btn btn-primary" to="/log_in">{t('Login again')}</Link>
                        </Row>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}
export default withTranslation('common')(SessionExpiryModal);
