import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EmailTemplate from './components/EmailTemplate';

const EmailTemplatesPage = (props) => (
  <Container>
    <EmailTemplate  {...props}/>
  </Container>
);

export default withTranslation('common')(EmailTemplatesPage);
