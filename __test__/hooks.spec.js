/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { RouterStore, syncHistoryWithStore, RouterStoreContext, RouterStoreProvider, useRouterStore, useLocation } from '../index';

let store, history;

const wrapper = ({ children }) => (
  React.createElement(RouterStoreContext.Provider, { value: store }, children)
);

beforeEach(() => {
  store = new RouterStore();
  history = syncHistoryWithStore(createMemoryHistory(), store);
});

describe('useRouterStore', () => {
  it('returns the store from context', () => {
    const { result } = renderHook(() => useRouterStore(), { wrapper });
    expect(result.current).toBe(store);
  });

  it('throws when used outside a provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useRouterStore())).toThrow(
      'useRouterStore must be used within RouterStoreContext.Provider'
    );
    spy.mockRestore();
  });
});

describe('RouterStoreProvider', () => {
  it('is an alias for RouterStoreContext.Provider', () => {
    expect(RouterStoreProvider).toBe(RouterStoreContext.Provider);
  });
});

describe('useLocation', () => {
  it('returns the current location', () => {
    const { result } = renderHook(() => useLocation(), { wrapper });
    expect(result.current.pathname).toBe('/');
  });

  it('updates reactively when history navigates', () => {
    const { result } = renderHook(() => useLocation(), { wrapper });
    expect(result.current.pathname).toBe('/');

    act(() => { history.push('/step-1'); });
    expect(result.current.pathname).toBe('/step-1');

    act(() => { history.push('/step-2'); });
    expect(result.current.pathname).toBe('/step-2');

    act(() => { history.replace('/replaced'); });
    expect(result.current.pathname).toBe('/replaced');

    // back() goes to /step-1 because replace swapped /step-2 in place
    act(() => { history.back(); });
    expect(result.current.pathname).toBe('/step-1');
  });

  it('does not update after store is unsubscribed from history', () => {
    const { result } = renderHook(() => useLocation(), { wrapper });
    history.unsubscribe();

    act(() => { history.push('/should-not-update'); });
    expect(result.current.pathname).toBe('/');
  });
});
