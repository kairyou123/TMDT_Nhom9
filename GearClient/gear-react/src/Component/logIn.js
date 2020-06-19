import React from 'react';
import axios from 'axios';
import Oidc from 'oidc-client';

class Login extends React.Component {
  constructor(props) {
    super(props);
    var config = {
      authority: "http://localhost:5000",
      client_id: "spa",
      client_serect: "api_secret",
      redirect_uri: "http://localhost:5003/redirect",
      response_type: "code",
      scope:"openid profile email address phone gearapi",
      post_logout_redirect_uri : "http://localhost:5003/",
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    };var config = {
      authority: "http://localhost:5000",
      client_id: "spa",
      client_serect: "api_secret",
      redirect_uri: "http://localhost:5003/redirect",
      response_type: "code",
      scope:"openid profile email address phone gearapi",
      post_logout_redirect_uri : "http://localhost:5003/",
      userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
    };
    this.state = {
        mgr : new Oidc.UserManager(config),
    }
  }

  componentDidMount() {
    this.state.mgr.signinRedirect();
  }

  render() {
    return null;

 }
}
  
export default Login;