import * as React from 'react';
import { Router as ReactRouter } from 'react-router';

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
