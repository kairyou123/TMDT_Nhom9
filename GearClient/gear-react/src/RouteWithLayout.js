function RouteWithLayout({layout, component, ...rest}){
    return (
      <Route {...rest} render={(props) =>
        React.createElement( layout, props, React.createElement(component, props))
      }/>
    );
}
export default RouteWithLayout;