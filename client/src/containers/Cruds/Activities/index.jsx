import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Activties from './components/Activities';

const activities = () => (
  <Container>
    <Activties />
  </Container>
);

activities.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(activities);
