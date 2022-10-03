import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Settings from './components/settings';

const Roles = ({ t }) => (
    <Container>
        <Settings />
    </Container>
);

Roles.propTypes = {
    t: PropTypes.func.isRequired,
};

export default withTranslation('common')(Roles);
