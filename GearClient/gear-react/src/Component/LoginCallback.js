import React from 'react';
import Oidc from 'oidc-client';

class LoginCallback extends React.Component {
    constructor(props) {
        super(props);
    }

    LoginCallback = () => {
        var mgr = new Oidc.UserManager({response_mode:"query", userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })});

        mgr.signinRedirectCallback().then(user => {
            // localStorage.setItem('access_token', user.access_token);
            // localStorage.setItem('user', user.profile);
            // localStorage.setItem('expires', user.expires_at);
        }).then(()=> {
            this.props.history.push('/');
        });
        

       
    }

    render() {
    return (
        <div>
        {this.LoginCallback()}
        </div>
    )
    }
}
  
export default LoginCallback;
  