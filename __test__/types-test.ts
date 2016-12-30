// This contains sample code which tests the typings. This code does not run, but it is type-checked
import { RouterStore, syncHistoryWithStore } from '../';
import { History, Location } from '../';

const browserHistory: History = undefined;
const routerStore: RouterStore = new RouterStore();
const history = syncHistoryWithStore(browserHistory, routerStore);

{
  // browserHistory.unsubscribe(); 
  history.unsubscribe();

  const unsubscribeFromStore = history.listen(location => console.log(location.pathname));
  history.push('/test1');
  unsubscribeFromStore();
  history.push('/test2');
}

{
  const history: History = routerStore.history;
  history.createHref('location');
  history.createHref({ pathname: 'path', hash: '#1234' });

  const location: Location = history.getCurrentLocation();
  history.push('path/to/location');
  history.push(location);
  history.replace('path/to/replace');
  history.replace({
    pathname: location.pathname,
    state: location.state,
    hash: location.hash,
    key: location.key
  });
}

{
  const { pathname, hash, key, search, state } = routerStore.location;
  routerStore.push('path/to/location');
  routerStore.push({ pathname, hash, key, state });
  routerStore.go(-1);
  routerStore.goBack();
  routerStore.goForward();
  routerStore.replace('path/to/replace');
  routerStore.replace({ pathname, hash, key, state });
}
