import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import IsLogin from './Services/isLogin.js';

class MemberPrivateRoute extends React.Component {
  state = {
    haveAccess: false,
    loaded: false,
  }
  

  async componentDidMount() {
    try {
      await IsLogin();
      this.setState({ haveAccess: true, loaded: true});
    }
    catch {
      this.setState({ loaded: true});
    }
  }

  checkAccess = () => {
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { loaded, haveAccess } = this.state;
    if (!loaded) return null;
    return (
      <Route
        {...rest}
        render={props => {
          return haveAccess ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/log-in',
              }}
            />
          );
        }}
      />
    );
  }
}

export default withRouter(MemberPrivateRoute);