import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Employees from './components/Employees';

const employees = (props,{ t }) => (
  <Container>
    <Employees {...props} />
  </Container>
);

employees.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(employees);
