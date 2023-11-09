import * as React from 'react';
import { Router as ReactRouter, useLocation, useNavigate, useParams } from 'react-router';

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
