import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
import { NavLink } from 'react-router-dom';

//config
import config from '../../../config/config';
const SidebarLink = ({
  title, icon, newLink, route, onClick,
}) => (
    <NavLink
      to={route}
      onClick={onClick}
      activeClassName="sidebar__link-active"
      activeStyle={{ backgroundColor: config.darkTemplateColor, color: config.whiteColor }}
    >
      <row className="sidebar__link">
        {icon ? <span
          activeClassName={`active_sidebar__link-icon lnr `}
          className={`sidebar__link-icon lnr `} >{icon.substring(0, 2)}</span> : ''}
        <p className="sidebar__link-title" activeClassName='sidebar__link-active'
        >
          {title}
          {newLink ? <Badge className="sidebar__link-badge"><span>New</span></Badge> : ''}
        </p>
      </row>
    </NavLink>
  );

SidebarLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  newLink: PropTypes.bool,
  route: PropTypes.string,
  onClick: PropTypes.func,
};

SidebarLink.defaultProps = {
  icon: '',
  newLink: false,
  route: '/',
  onClick: () => { },
};

export default SidebarLink;