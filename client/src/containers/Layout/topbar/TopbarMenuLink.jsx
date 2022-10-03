import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import LogoutModal from '../../Cruds/CommonModals/LogoutModal';

export default class TopbarMenuLinks extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLogout: false,
      isLogoutSuccess: false,
      isOpenLogoutModal: false
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  };
  componentDidMount=()=>{
  }
  logout = async () => {
    await this.props.toggleClose();
    this.setState({
      isOpenLogoutModal: true
    })
  }

  // close delete modal
  closeLogoutModal = (type) => {
    this.setState({
      isOpenLogoutModal: false
    })
    if (type == 'close') {
      this.setState({
        isLogoutSuccess: true
      })
    }
  }

  render() {
    const { title, icon, path, toggleClose } = this.props;

    return (
      <div>
        {title == 'Log Out' ?
          <div className="topbar__link" style={{
            paddingBottom: '10px',
            paddingLeft: '23px', paddingTop: '10px'
          }}
            onClick={() => this.logout()}>
            <span className={`topbar__link-icon lnr lnr-${icon}`} />
            <span className="topbar__link-title">{title}</span>
          </div>
          :
          <Link className="topbar__link"
          to={{ pathname: path, state: { updateTopbarProfileData: this.props.updateTopbarProfileData } }}
          onClick={toggleClose}>
            <span className={`topbar__link-icon lnr lnr-${icon}`} />
            <p className="topbar__link-title">{title}</p>
          </Link>}

        {this.state.isLogoutSuccess ?
          <div>
            <Redirect to='/log_in' />
          </div> : null}

        {/* display modal for logout */}
        <LogoutModal openLogoutModal={this.state.isOpenLogoutModal}
          closeLogoutModal={this.closeLogoutModal} />
      </div>

    );
  }
}
