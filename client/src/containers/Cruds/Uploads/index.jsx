import React from 'react';
import { Container } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Uploads from './components/Uploads';

const uploads = ({ t }) => (
  <Container>
    <Uploads />
  </Container>
);

uploads.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(uploads);