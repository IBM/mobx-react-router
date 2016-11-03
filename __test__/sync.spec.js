import { createMemoryHistory } from 'react-router';
import shallowEqual from 'shallowequal';
import { RouterStore, syncHistoryWithStore } from '../index';

let history, memoryHistory, routerStore;

const matchers = {
  toEqualLocation: () => ({
    compare: (actual, expected) => {
      expected = {
        search: '',
        hash: '',
        state: undefined,
        action: 'PUSH',
        query: {},
        ...expected
      };
      return {
        pass: (
          actual.pathname === expected.pathname &&
          actual.search === expected.search &&
          actual.hash === expected.hash &&
          actual.state === expected.state &&
          shallowEqual(actual.query, expected.query) &&
          actual.action === expected.action
        )
      };
    }
  })
};

beforeEach(() => {
  jasmine.addMatchers(matchers);
  routerStore = new RouterStore();
  memoryHistory = createMemoryHistory('/');
  history = syncHistoryWithStore(memoryHistory, routerStore);
});

describe('syncing', () => {
  it('syncs store with history', () => {
    expect(routerStore.location).toEqualLocation({
      pathname: '/',
      action: 'POP'
    });

    history.push('/url-1');
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-1',
      action: 'PUSH'
    });

    history.goBack();
    expect(routerStore.location).toEqualLocation({
      pathname: '/',
      action: 'POP'
    });

    history.goForward();
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-1',
      action: 'POP'
    });

    history.replace('/url-2?animal=fish#mango');
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-2',
      search: '?animal=fish',
      query: { animal: 'fish' },
      hash: '#mango',
      action: 'REPLACE'
    });
  });

  it('provides listen and unsubscribe functions', () => {
    expect(history.listen).not.toBeUndefined();
    expect(history.unsubscribe).not.toBeUndefined();

    const historyListener = jest.fn();
    const unsubscribe = history.listen(historyListener);

    expect(historyListener.mock.calls.length).toBe(1);
    history.push('/url-1');
    expect(historyListener.mock.calls.length).toBe(2);
    unsubscribe();
    history.push('/url-2');
    expect(historyListener.mock.calls.length).toBe(2);
  });

  it('provdides a way to unsubscribe from store and history', () => {
    const historyListener = jest.fn();
    history.listen(historyListener);

    expect(historyListener.mock.calls.length).toBe(1);
    history.unsubscribe();
    history.push('/url-1');

    expect(routerStore.location).toEqualLocation({
      pathname: '/',
      action: 'POP'
    });
  });
});
