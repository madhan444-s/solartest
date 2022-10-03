import React, { PureComponent } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import TopbarMenuLink from './TopbarMenuLink';
import config from '../../../config/config';
import configImages from '../../../config/configImages';
const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;
const noProfileImage = configImages.defaultImg;

export default class TopbarProfile extends PureComponent {
  constructor() {
    super();
    this.state = {
      collapse: false,
      userData: {}
    };
  }

  toggle = () => {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  };

  componentDidMount = async () => {
    this.updateTopbarProfileData()

  }
  updateTopbarProfileData = async () => {
    let userData = await localStorage.getItem('loginCredentials');
    userData = JSON.parse(userData);
    await this.setState(({
      userData: userData
    }));
  }

  render() {
    const { collapse } = this.state;
    const profileImage = this.state.userData && this.state.userData.photo ? this.state.userData.photo : null;

    return (
      <div className="topbar__profile">
        <button className="topbar__avatar" type="button" onClick={this.toggle}>
          {/* change */}
          <img className="topbar__avatar-img"
            src={profileImage ? `${config.imgUrl}/employee/${profileImage}` : noProfileImage} />
          <p className="topbar__avatar-name">{this.state.userData && this.state.userData.name ?
            this.state.userData.name : 'No Name'}</p>
          <DownIcon className="topbar__icon" />
        </button>
        {collapse && <button className="topbar__back" type="button" onClick={this.toggle} />}
        <Collapse isOpen={collapse} className="topbar__menu-wrap">
          <div className="topbar__menu topbarMenu">
            <div className='topBarImageAlignment'>
              <img src={profileImage ? `${config.imgUrl}/employee/${profileImage}` : noProfileImage}
                className='topBarImage' />
              <div >
                {this.state.userData && this.state.userData.name ?
                  this.state.userData.name : 'No Name'}
                <div className='themeColorText'>{this.state.userData &&
                  this.state.userData.role ?
                  this.state.userData.role : ''}</div>
              </div>
            </div>

            <div className="topbar__menu-divider" />
            <div className="topbar__menu">
              <TopbarMenuLink title="My Profile" icon="user" path="/profile" toggleClose={this.toggle}
                updateTopbarProfileData={this.updateTopbarProfileData}
              />
              {/* <TopbarMenuLink title="Account Settings" icon="cog" path="/settings" toggleClose={this.toggle} /> */}
              <TopbarMenuLink title="Change Password" icon="bubble" path="/changePassword" toggleClose={this.toggle}
                updateTopbarProfileData={this.updateTopbarProfileData}
              />
              <TopbarMenuLink title="Settings" icon="cog" path="/adminSettings" toggleClose={this.toggle}
                updateTopbarProfileData={this.updateTopbarProfileData}
              />
              <div className="topbar__menu-divider" />
              <TopbarMenuLink title="Log Out" icon="exit" path="/log_in" toggleClose={this.toggle}
                updateTopbarProfileData={this.updateTopbarProfileData}
              />
            </div>
          </div>
        </Collapse>
      </div >
    );
  }
}
