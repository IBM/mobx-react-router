import type { History } from 'history'
import { createMemoryHistory } from 'history'
import { RouterStore } from '../src/index'

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

describe('store', () => {
  describe('for store', () => {
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
      store = new RouterStore(mockHistory)
    })
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

  describe('sync', () => {
    beforeEach(() => {
      store = new RouterStore(createMemoryHistory())
    })

    it('store provides a way to stop sync with history', () => {
      expect(store.location.pathname).toBe('/')
      store.stopSyncWithHistory()
      store.push('/url-1')
      store.push('/url-2')

      expect(store.location.pathname).toBe('/')
    })

    it('syncs store with store', () => {
      expect(store.history.action).toBe('POP')
      expect(store.location.pathname).toBe('/')

      store.push('/url-1')
      expect(store.history.action).toBe('PUSH')
      expect(store.location.pathname).toBe('/url-1')

      store.back()
      expect(store.history.action).toBe('POP')
      expect(store.location.pathname).toBe('/')

      store.forward()
      expect(store.history.action).toBe('POP')
      expect(store.location.pathname).toBe('/url-1')

      store.replace('/url-2?animal=fish#mango')
      expect(store.history.action).toBe('REPLACE')
      expect(store.location).toEqual({
        ...store.location,
        pathname: '/url-2',
        search: '?animal=fish',
        // query: { animal: 'fish' },
        hash: '#mango'
      })
    })
    it('provides subscribe and unsubscribe functions', () => {
      expect(store.subscribe).not.toBeUndefined()
      expect(store.stopSyncWithHistory).not.toBeUndefined()

      const historyListener = jest.fn()
      const unsubscribe = store.subscribe(historyListener)

      expect(historyListener.mock.calls.length).toBe(1)
      store.push('/url-1')
      expect(historyListener.mock.calls.length).toBe(2)
      unsubscribe()
      store.push('/url-3')
      store.push('/url-4')
      expect(historyListener.mock.calls.length).toBe(2)
    })
  })
})
