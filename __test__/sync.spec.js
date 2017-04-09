import createMemoryHistory from 'history/createMemoryHistory';
import { RouterStore, syncHistoryWithStore } from '../index';

let history, memoryHistory, routerStore;

const matchers = {
  toEqualLocation: () => ({
    compare: (actual, expected) => {
      expected = {
        search: '',
        hash: '',
        state: undefined,
        ...expected
      };
      const passed = (
        actual.pathname === expected.pathname &&
        actual.search === expected.search &&
        actual.hash === expected.hash &&
        actual.state === expected.state
      );
      return {
        pass: passed,
        message: passed
          ? 'Location\'s matched'
          : `Expected location to be ${JSON.stringify(expected)} but it was ${JSON.stringify(actual)}`
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
    expect(routerStore.history.action).toBe('POP');
    expect(routerStore.location).toEqualLocation({
      pathname: '/'
    });

    history.push('/url-1');
    expect(routerStore.history.action).toBe('PUSH');
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-1'
    });

    history.goBack();
    expect(routerStore.history.action).toBe('POP');
    expect(routerStore.location).toEqualLocation({
      pathname: '/'
    });

    history.goForward();
    expect(routerStore.history.action).toBe('POP');
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-1'
    });

    history.replace('/url-2?animal=fish#mango');
    expect(routerStore.history.action).toBe('REPLACE');
    expect(routerStore.location).toEqualLocation({
      pathname: '/url-2',
      search: '?animal=fish',
      query: { animal: 'fish' },
      hash: '#mango'
    });
  });
  it('provides subscribe and unsubscribe functions', () => {
    expect(history.subscribe).not.toBeUndefined();
    expect(history.unsubscribe).not.toBeUndefined();

    const historyListener = jest.fn();
    const unsubscribe = history.subscribe(historyListener);

    expect(historyListener.mock.calls.length).toBe(1);
    history.push('/url-1');
    expect(historyListener.mock.calls.length).toBe(2);
    unsubscribe();
    history.push('/url-2');
    expect(historyListener.mock.calls.length).toBe(2);
  });

  it('provdides a way to unsubscribe from store and history', () => {
    const historyListener = jest.fn();
    history.subscribe(historyListener);

    expect(historyListener.mock.calls.length).toBe(1);
    history.unsubscribe();
    history.push('/url-1');

    expect(routerStore.location).toEqualLocation({
      pathname: '/'
    });
  });
});
