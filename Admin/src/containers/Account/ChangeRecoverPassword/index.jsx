import React from 'react';
import { Container, Row } from 'reactstrap';
import ChangeRecoverPassword from './components/ChangeRecoverPassword';

const ChangeRecoverPasswordPage = (props) => (
    <Container>
        <Row style={{ justifyContent: 'center', marginTop: 100 }}>
            <ChangeRecoverPassword {...props} />
        </Row>
    </Container>
);

export default ChangeRecoverPasswordPage;
