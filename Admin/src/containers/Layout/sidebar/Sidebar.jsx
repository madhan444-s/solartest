import React from 'react';
import Scrollbar from 'react-smooth-scrollbar';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import SidebarContent from './SidebarContent';
import { SidebarProps } from '../../../shared/prop-types/ReducerProps';

import fetch from "../../../config/service";
import apiCalls from '../../../config/apiCalls';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: [],
      loginCredentials: {}
    }
  }
  componentDidMount = async () => {
    let loginCredentials = localStorage.getItem("loginCredentials");
    if (loginCredentials) {
      loginCredentials = JSON.parse(loginCredentials);
      this.setState({
        loginCredentials: loginCredentials
      })
    }
    await this.getMenuListFromServer();
  }

  getMenuListFromServer1 = async () => {
    //   let loginCredentials = this.state.loginCredentials;
    //   if (loginCredentials) {
    //     let filterCriteria = {}, url;
    //     filterCriteria.sortfield = 'sequenceNo';
    //     filterCriteria.direction = 'asc';
    //     // url = `menus?filter=${JSON.stringify(filterCriteria)}`;
    //     // return fetch('GET', url)
    //     //   .then(async (res) => {
    //     //     if (res && res.menus && res.menus.length > 0) {
    let menuList = [{
  "icon": "employee",
  "displayTitle": "Employees",
  "title": "Employee",
  "route": "/employee"
},{
  "icon": "activities",
  "displayTitle": "Activitiess",
  "title": "Activities",
  "route": "/activities"
},{
  "icon": "email templates",
  "displayTitle": "Email Templatess",
  "title": "Email Templates",
  "route": "/email templates"
},{
  "icon": "roles",
  "displayTitle": "Roless",
  "title": "Roles",
  "route": "/roles"
},{
  "icon": "upload history",
  "displayTitle": "Upload Historys",
  "title": "Upload History",
  "route": "/upload history"
},{
  "icon": "email status",
  "displayTitle": "Email Statuss",
  "title": "Email Status",
  "route": "/email status"
},{
  "icon": "company",
  "displayTitle": "Companys",
  "title": "Company",
  "route": "/company"
},{
  "icon": "user",
  "displayTitle": "Users",
  "title": "User",
  "route": "/user"
}];
    //     // menuList = res.menus;
    //     await this.setState({
    //       menuList: menuList
    //     })
    //     //     }
    //     //   })
    //   }
  }

  getMenuListFromServer = async () => {
    let loginCredentials = this.state.loginCredentials;
    if (loginCredentials) {
      let filterCriteria = {}, url;
      filterCriteria.sortfield = 'sequenceNo';
      filterCriteria.direction = 'asc';
      url = `menus?filter=${JSON.stringify(filterCriteria)}`;
      console.log("urllllll", url)
      return fetch('GET', url)
        .then(async (res) => {
          console.log(res)
          if (res && res.menulists && res.menulists.length > 0) {
            let menuList = res.menulists;
            let rolePermissions = localStorage.getItem("rolePermissions");
            rolePermissions = JSON.parse(rolePermissions);
            if (rolePermissions) {
              let neWmenuList = [];
              let keys = Object.keys(rolePermissions);
              if (menuList) {
                menuList.forEach((item) => {
                  if (item.submenus && item.submenus.length > 0) {
                    let newSubmenus = [];
                    item.submenus.map(sitem => {
                      keys.forEach(element => {
                        if (sitem.displayTitle === element) {
                          if (rolePermissions[element] !== "NoView") {
                            newSubmenus.push(sitem);
                          }
                        }
                      });
                    })
                    if (newSubmenus && newSubmenus.length > 0) {
                      item.submenus = newSubmenus;
                      neWmenuList.push(item);
                    }
                  } else {
                    keys.forEach(element => {
                      if (item.displayTitle === element) {
                        if (rolePermissions[element] !== "NoView") {
                          neWmenuList.push(item);
                        }
                      }
                    });
                  }
                });
              }
              await this.setState({ menuList: neWmenuList });
            }
          }
        })

    }
  }

  render() {
    const { changeToDark, changeToLight, changeMobileSidebarVisibility, sidebar } = this.props;
    const sidebarClass = classNames({
      sidebar: true,
      'sidebar--show': sidebar.show,
      'sidebar--collapse': sidebar.collapse,
    });

    return (
      <div className={sidebarClass}>
        <button className="sidebar__back" type="button" onClick={changeMobileSidebarVisibility} />
        <Scrollbar className="sidebar__scroll scroll">
          <div className="sidebar__wrapper sidebar__wrapper--desktop">
            <SidebarContent
              onClick={() => { }}
              changeToDark={changeToDark}
              changeToLight={changeToLight}
              menuList={this.state.menuList}
            />
          </div>
          <div className="sidebar__wrapper sidebar__wrapper--mobile">
            <SidebarContent
              onClick={changeMobileSidebarVisibility}
              changeToDark={changeToDark}
              changeToLight={changeToLight}
              menuList={this.state.menuList}
            />
          </div>
        </Scrollbar>
      </div>
    );
  };
}

Sidebar.propTypes = {
  sidebar: SidebarProps.isRequired,
  changeToDark: PropTypes.func.isRequired,
  changeToLight: PropTypes.func.isRequired,
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};