import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    changeToDark: PropTypes.func.isRequired,
    changeToLight: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }
  componentDidMount=()=>{
  }
  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { menuList } = this.props;
 
    return (
      <div className="sidebar__content"
        style={menuList && menuList.length > 14 ? { "height": 40 * menuList.length } : { "height": 'calc(110vh - 60px)' }}
      >
        <ul className="sidebar__block">
          {menuList && menuList.length > 0
            ? menuList.map((item, index) => {
              if (item.submenus && item.submenus.length > 0) {
                return (
                  <SidebarCategory
                    key={index}
                    title={item.displayTitle == 'Settings' ? 'Settings Menu' : item.displayTitle}
                    icon={item.icon}
                  >
                    {item.submenus.map((sitem, sindex) => {
                      return (
                        <SidebarLink key={sindex}
                          title={sitem.displayTitle}
                          icon={sitem.icon}
                          onClick={this.hideSidebar}
                          route={sitem.route} />
                      )
                    })}
                  </SidebarCategory>
                )
              } else {
                return (
                  <SidebarLink
                    key={index}
                    icon={item.icon}
                    title={item.displayTitle}
                    route={item.route}
                    onClick={this.hideSidebar}
                  />
                );
              }
            })
            : null}
        </ul>
      </div>
    );
  }
}

export default SidebarContent;

