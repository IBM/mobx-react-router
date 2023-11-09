import * as React from 'react';
import { Router } from 'react-router';

SimpleRouter.propTypes = {
  store
};

export function SimpleRouter(props) {
  const { store } = props;
  return (
    <Router
      location={store?.location}
      navigator={store?.history}
      {...props}
    />
  );
}
