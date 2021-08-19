import type { History } from 'history'
import { createMemoryHistory } from 'history'
import { toJS } from 'mobx'

import { RouterStore } from '.'

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

let router: RouterStore

describe('router', () => {
  describe('for router store', () => {
    beforeEach(() => {
      Object.assign(mockHistory, {
        push: jest.fn(),
        replace: jest.fn(),
        go: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        listen: jest.fn(),
        subscribe: jest.fn(),
      })
      router = new RouterStore(mockHistory)
    })
    it('can call history methods', () => {
      router.push('/url-1')
      router.replace('/url-2')
      router.go(-1)
      router.back()
      router.forward()

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
      router = new RouterStore(createMemoryHistory())
    })

    it('router provides a way to stop sync with history', () => {
      expect(router.location.pathname).toBe('/')
      router.stopSyncWithHistory()
      router.push('/url-1')
      router.push('/url-2')

      expect(router.location.pathname).toBe('/')
    })

    it('syncs router with router', () => {
      expect(router.history.action).toBe('POP')
      expect(router.location.pathname).toBe('/')

      router.push('/url-1')
      expect(router.history.action).toBe('PUSH')
      expect(router.location.pathname).toBe('/url-1')

      router.back()
      expect(router.history.action).toBe('POP')
      expect(router.location.pathname).toBe('/')

      router.forward()
      expect(router.history.action).toBe('POP')
      expect(router.location.pathname).toBe('/url-1')

      router.replace('/url-2?animal=fish#mango')
      expect(router.history.action).toBe('REPLACE')
      expect(router.location).toEqual({
        ...router.location,
        pathname: '/url-2',
        search: '?animal=fish',
        // query: { animal: 'fish' },
        hash: '#mango',
      })
    })
    it('provides subscribe and unsubscribe functions', () => {
      expect(router.subscribe).not.toBeUndefined()
      expect(router.stopSyncWithHistory).not.toBeUndefined()

      const historyListener = jest.fn()
      const unsubscribe = router.subscribe(historyListener)

      expect(historyListener.mock.calls.length).toBe(1)
      router.push('/url-1')
      expect(historyListener.mock.calls.length).toBe(2)
      unsubscribe()
      router.push('/url-3')
      router.push('/url-4')
      expect(historyListener.mock.calls.length).toBe(2)
    })

    it('sync query', () => {
      expect(router.query).toEqual({})
      router.push('/?a=b&c=d')
      expect(router.query).toEqual({ a: 'b', c: 'd' })
      router.push('/?a=b&a=d&a=2')
      expect(router.query).toEqual({ a: ['b', 'd', '2'] })
    })

    it('hashValue', () => {
      expect(router.hashValue).toBe('')
      router.push('#xxx')
      expect(router.hashValue).toBe('xxx')
      router.push({
        hash: '',
      })
      expect(router.hashValue).toBe('')
    })

    it('routes', () => {
      router.appendPathList('/path/:name')
      router.push('/path/abc')
      expect(router.pathValue).toEqual({ name: 'abc' })

      router.prependPathList('/path1/:id/edit/:type')

      router.push('/path1/124/edit/%E8%B4%AB%E9%81%93')
      expect(router.pathValue).toEqual({ id: '124', type: '贫道' })

      router.push('/path2/124/edit/康康')
      expect(router.pathValue).toEqual({})
    })
  })
})
