import React from 'react';
import { Container, Row } from 'reactstrap';
import ChangePassword from './components/ChangePassword';

const ChangePasswordPage = () => (
    <Container>
        <Row style={{ justifyContent: 'center' }}>
            <ChangePassword />
        </Row>
    </Container>
);

export default ChangePasswordPage;
