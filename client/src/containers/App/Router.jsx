/* eslint indent: "off" */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainWrapper from './MainWrapper';
import Layout from '../Layout/index';
import Register from '../Register/index';

// Login
import Landing from '../Landing/LogIn';
// import LoginCheck from '../Landing/loginCheck';

// Dashboard
import Home from '../Dashboard/index';

// Profile
import ChangePassword from '../Account/ChangePassword/index';
import ChangeRecoverPassword from '../Account/ChangeRecoverPassword/index';
import ForgotPassword from '../Account/ForgotPassword/index';
import LoginChangePassword from '../Account/LoginChangePassword/index';
import Profile from '../Account/Profile';

import EmailTemplate from '../Cruds/EmailTemplates';
import Roles from '../Cruds/Roles';
import Activities from '../Cruds/Activities'
import EmailStatus from '../Cruds/EmailStatus/index';
// Tables
import Companys from '../Cruds/Companys/index';
import Users from '../Cruds/Users/index';

import Settings from '../Cruds/Settings/index'
import AdminSettings from '../Settings/index'
import Uploads from '../Cruds/Uploads/index';
// 404 page not found 
import ErrorNotFound from '../Account/404/index';

const Tables = () => {
  let roles = localStorage.rolePermissions
    ? JSON.parse(localStorage.rolePermissions)
    : false;
  if (roles) {
    return (<Switch>
      <Route path="/companys"
           component={
              roles['Company'] &&
                (roles['Company'] === "Edit" || roles['Company'] === "View")
                ? Companys 
                  : ErrorNotFound
                } />

          <Route
          path="/create_companys"
          render={
            roles['Company'] &&
              (roles['Company'] === "Edit" )
              ?  props => <Companys {...props} />  
              : ErrorNotFound
          }
        />

          <Route
          path="/edit_companys/:id"
          render={
            roles['Company'] &&
              (roles['Company'] === "Edit" )
              ?  props => <Companys {...props} />  
              : ErrorNotFound
          }
        />

          <Route
          path="/view_companys/:id"
          render={
            roles['Company'] &&
              (roles['Company'] === "Edit" || roles['Company'] === "View")
              ?  props => <Companys {...props} />  
              : ErrorNotFound
          }
        />
<Route path="/users"
           component={
              roles['User'] &&
                (roles['User'] === "Edit" || roles['User'] === "View")
                ? Users 
                  : ErrorNotFound
                } />

          <Route
          path="/create_users"
          render={
            roles['User'] &&
              (roles['User'] === "Edit" )
              ?  props => <Users {...props} />  
              : ErrorNotFound
          }
        />

          <Route
          path="/edit_users/:id"
          render={
            roles['User'] &&
              (roles['User'] === "Edit" )
              ?  props => <Users {...props} />  
              : ErrorNotFound
          }
        />

          <Route
          path="/view_users/:id"
          render={
            roles['User'] &&
              (roles['User'] === "Edit" || roles['User'] === "View")
              ?  props => <Users {...props} />  
              : ErrorNotFound
          }
        />

      <Route path="/settings" component={Settings} />
      <Route path="/adminSettings" component={AdminSettings} />

      <Route
        path="/uploads"
        component={
          roles["Upload History"] &&
            (roles["Upload History"] === "Edit" || roles["Upload History"] === "View")
            ? Uploads
            : ErrorNotFound
        }
      />

      <Route
        path="/activities"
        component={
          roles["Activities"] &&
            (roles["Activities"] === "Edit" || roles["Activities"] === "View")
            ? Activities
            : ErrorNotFound
        }
      />

      <Route
        path="/roles"
        component={
          roles["Roles"] &&
            (roles["Roles"] === "Edit" || roles["Roles"] === "View")
            ? Roles
            : ErrorNotFound
        }
      />
        <Route
        path="/create_roles"
        render={
          roles["Roles"] &&
            (roles["Roles"] === "Edit" )
            ?  props => <Roles {...props} />  
            : ErrorNotFound
        }
      />
        <Route
        path="/edit_roles/:id"
        render={
          roles["Roles"] &&
            (roles["Roles"] === "Edit" )
            ?  props => <Roles {...props} />  
            : ErrorNotFound
        }
      />
        <Route
        path="/view_roles/:id"
        render={
          roles["Roles"] &&
            (roles["Roles"] === "Edit" || roles["Roles"] === "View")
            ?  props => <Roles {...props} />  
            : ErrorNotFound
        }
      />
      <Route
        path="/emailstatus"
        component={
          roles["Email Status"] &&
            (roles["Email Status"] === "Edit" || roles["Email Status"] === "View")
            ? EmailStatus
            : ErrorNotFound
        }
      />

      <Route
        path="/templates"
        component={
          roles["Email Templates"] &&
            (roles["Email Templates"] === "Edit" || roles["Email Templates"] === "View")
            ? EmailTemplate
            : ErrorNotFound
        }
      />
        <Route
        path="/create_templates"
        render={
          roles["Email Templates"] &&
            (roles["Email Templates"] === "Edit" )
            ?  props => <EmailTemplate {...props} />  
            : ErrorNotFound
        }
      />
        <Route
        path="/edit_templates/:id"
        render={
          roles["Email Templates"] &&
            (roles["Email Templates"] === "Edit" )
            ?  props => <EmailTemplate {...props} />  
            : ErrorNotFound
        }
      />
        <Route
        path="/view_templates/:id"
        render={
          roles["Email Templates"] &&
            (roles["Email Templates"] === "Edit" || roles["Email Templates"] === "View")
            ?  props => <EmailTemplate {...props} />  
            : ErrorNotFound
        }
      />
      {/* <Route path="/uploads" component={Uploads} />
    <Route path="/activities" component={Activities} />
    <Route path="/roles" component={Roles} />
    <Route path="/templates" component={EmailTemplate} /> */}
    </Switch >
    )
  }
}

const Account = () => (
  <Switch>
    <Route path="/changepassword" component={ChangePassword} />
    <Route path="/profile" component={Profile} />
  </Switch>
);

const wrappedRoutes = () => {
  let loginCredentials = localStorage.loginCredentials ? JSON.parse(localStorage.loginCredentials) : false;
  if (loginCredentials) {
    return <div>
      <Layout />
      <div className="container__wrap">
        <Route path="/" component={Account} />
        <Route path="/" component={Tables} />
        <Route path="/dashBoard" component={Home} />
      </div>
    </div>
  }
  else {
    return <ErrorNotFound />
  }
}

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route path="/changeRecoverPassword/:enEmail" render={(props) => <ChangeRecoverPassword
          {...props} />} />
        <Route path="/loginChangePassword" component={LoginChangePassword} />
        <Route exact path="/" component={Landing} />
        <Route path="/log_in" component={Landing} />
        <Route path="/logout" component={Landing} />
        <Route path="/forgot_password" component={ForgotPassword} />
        <Route path="/register" component={Register} />

        <Route path="/" component={wrappedRoutes} />
        <Route component={ErrorNotFound} />

      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
