import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import checkAdmin from './Services/checkAdmin.js';

class PrivateRoute extends React.Component {
  state = {
    haveAccess: false,
    loaded: false,
  }
  

  async componentDidMount() {
    try {
      await checkAdmin();
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
                pathname: '/',
              }}
            />
          );
        }}
      />
    );
  }
}

export default withRouter(PrivateRoute);