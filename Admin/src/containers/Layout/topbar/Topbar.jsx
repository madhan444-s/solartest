import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';

import config from '../../../config/config';
import configImages from '../../../config/configImages';
//session expiry modal
import SessionExpiryModal from '../../Cruds/CommonModals/SessionexpiryModal'

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      settingsInfo: {},
      sessionExpiryModal: false
    }
  }
  componentDidMount = async () => {
    let sessionexpired = await localStorage.getItem('sessionexpired')
    if (sessionexpired == "true") {
      await this.setState({ sessionExpiryModal: true })
    }
  }
  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;
    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
            <Link className='topbarLogo ml-3' to="/employees" >
              {config.displayProjectName ?
                <img src={configImages.loginImage} className='topbarProjectLogo'></img> : config.appName}
            </Link>

          </div>
          <div className="topbar__right">
            <TopbarProfile />
          </div>
          {this.state.sessionExpiryModal ?
            <SessionExpiryModal
              SOpen={this.state.sessionExpiryModal}
            />
            : null}
        </div>
      </div>
    );
  }
}

export default Topbar;
