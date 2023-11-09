import * as React from 'react';
import { Router as ReactRouter, Route as ReactRoute, useLocation, useNavigate, useParams } from 'react-router';

Router.propTypes = {
  history
};

export function Router(props) {
  const { history } = props;
  return (
    <ReactRouter
      location={history.location}
      navigator={history}
      {...props}
    />
  );
}

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        location={location}
        history={navigate}
        match={params}
      />
    );
  }

  return ComponentWithRouterProp;
}

Route.propTypes = {
  exact,
  component,
  path
};

export function Route(props) {
  const { exact, component, path } = props;
  const renderSingleRoute = (single_path) => (
    <ReactRoute
      element={component}
      path={`${single_path}{exact ? '' : '/*'}`}
      {...props}
    />
  )
  if(typeof(path) === 'string') {
    return renderSingleRoute(path);
  }
  return path.map(single_path => renderSingleRoute(path)};
}
