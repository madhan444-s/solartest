import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Users from './components/Users';

const users = (props,{ t }) => (
  <Container>
    <Users {...props} />
  </Container>
);

users.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(users);
