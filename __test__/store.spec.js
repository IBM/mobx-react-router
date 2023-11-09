import { RouterStore } from '../index';

let mockHistory, store;

beforeEach(() => {
  mockHistory = {
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  };
  store = new RouterStore();
  store.history = mockHistory;
});

describe('store', () => {
  it('can call history methods', () => {
    store.push('/url-1');
    store.replace('/url-2');
    store.go(-1);
    store.back();
    store.forward();

    expect(mockHistory.push.mock.calls.length).toBe(1);
    expect(mockHistory.push.mock.calls[0][0]).toBe('/url-1');

    expect(mockHistory.replace.mock.calls.length).toBe(1);
    expect(mockHistory.replace.mock.calls[0][0]).toBe('/url-2');

    expect(mockHistory.go.mock.calls.length).toBe(1);
    expect(mockHistory.go.mock.calls[0][0]).toBe(-1);

    expect(mockHistory.back.mock.calls.length).toBe(1);

    expect(mockHistory.forward.mock.calls.length).toBe(1);
  });
});
