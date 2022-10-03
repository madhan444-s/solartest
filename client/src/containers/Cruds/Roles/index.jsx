import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Roles from './components/Roles';

const roles = (props,{ t }) => (
  <Container>
    <Roles  {...props} />
  </Container>
);

roles.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(roles);
