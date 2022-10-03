/* eslint-disable react/prop-types */
import React, { PureComponent } from 'react';
import { Container, Row } from 'reactstrap';

import Profile from './components/Profile';
import fetch from '../../../config/service';
import showToasterMessage from '../../UI/ToasterMessage/toasterMessage';
import apiCalls from '../../../config/apiCalls';

class ProfilePage extends PureComponent {
  constructor(props) {
    super(props);
  }


  // submit form data

  handleSubmit = (formValues) => {
    if (formValues) {
      delete formValues.email;
      delete formValues.password;
      let Url;
      if (localStorage.getItem('loginCredentials')) {
        let user = JSON.parse(localStorage.getItem('loginCredentials'));
        Url = `${apiCalls.Users}/${user._id}`;
      }
      return fetch('PUT', Url, formValues)
        .then(async (response) => {
          if (response && response.respCode && response.respCode === 205) {
            showToasterMessage(response.respMessage, 'success');
          //   setTimeout(() => {
          //     window.location.href =`#/${apiCalls.Users}` 
          // }, 500);    
            this.profileRef.getUserData();
          } else if (response && response.errorMessage) {
            showToasterMessage(response.errorMessage, 'error');
          }
        }).catch((err) => {
          return err;
        });

    } else {
      return;
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Profile
            onRef={(ref) => { this.profileRef = ref }}
            onSubmit={this.handleSubmit}
            locationProps={this.props}
          />
        </Row>
      </Container>
    );
  }
}

export default ProfilePage;
