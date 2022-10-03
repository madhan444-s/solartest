import React from 'react';
import { Container, Row } from 'reactstrap';
import LoginChangePassword from './components/LoginChangePassword';

const LoginChangePasswordPage = (props) => (
    <Container>
        <Row style={{ justifyContent: 'center', marginTop: 100 }}>
            <LoginChangePassword {...props} />
        </Row>
    </Container>
);

export default LoginChangePasswordPage;
