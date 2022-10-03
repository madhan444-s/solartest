import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Companys from './components/Companys';

const companys = (props,{ t }) => (
  <Container>
    <Companys {...props} />
  </Container>
);

companys.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(companys);
