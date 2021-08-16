import type { History } from 'history'
import { createMemoryHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from '../src/index'

type FN = ReturnType<typeof jest.fn>

const mockHistory: History & {
  push: FN
  replace: FN
  go: FN
  back: FN
  forward: FN
  listen: FN
  subscribe: FN
} = createMemoryHistory() as any

let store: RouterStore

beforeEach(() => {
  Object.assign(mockHistory, {
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    listen: jest.fn(),
    subscribe: jest.fn()
  })
  store = new RouterStore()
  syncHistoryWithStore(mockHistory, store)
})

describe('store', () => {
  it('can call history methods', () => {
    store.push('/url-1')
    store.replace('/url-2')
    store.go(-1)
    store.back()
    store.forward()

    expect(mockHistory.push.mock.calls.length).toBe(1)
    expect(mockHistory.push.mock.calls[0][0]).toBe('/url-1')

    expect(mockHistory.replace.mock.calls.length).toBe(1)
    expect(mockHistory.replace.mock.calls[0][0]).toBe('/url-2')

    expect(mockHistory.go.mock.calls.length).toBe(1)
    expect(mockHistory.go.mock.calls[0][0]).toBe(-1)

    expect(mockHistory.back.mock.calls.length).toBe(1)

    expect(mockHistory.forward.mock.calls.length).toBe(1)
  })
})
