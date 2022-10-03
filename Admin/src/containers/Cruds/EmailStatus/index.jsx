import React from 'react';
import { Container } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EmailStatus from './components/EmailStatus';

const emailStatus = ({ t }) => (
  <Container>
    <EmailStatus />
  </Container>
);

emailStatus.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(emailStatus);