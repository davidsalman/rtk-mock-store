import createMockStore from 'rtk-mock-store'
import reducer, { initialState, decrement, increment, incrementByAmount } from '../reducer'

const mockStore = createMockStore('simpleSlice', { simpleSlice: reducer }, { simpleSlice: initialState })

describe('simple reducer', () => {
  afterEach(() => {
    mockStore.reset()
  })

  it('should have initial state', () => {
    expect(mockStore.getReducerState()).toEqual({ value: 0 })
  })

  it('should increment', () => {
    mockStore.dispatch(increment())
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual(increment.type)
    expect(mockStore.dispatch.mock.calls[0][0].payload).toBeUndefined()
    expect(mockStore.getReducerState()).toEqual({ value: 1 })
  })

  it('should decrement', () => {
    mockStore.dispatch(decrement())
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual(decrement.type)
    expect(mockStore.dispatch.mock.calls[0][0].payload).toBeUndefined()
    expect(mockStore.getReducerState()).toEqual({ value: -1 })
  })

  it('should increment by amount', () => {
    mockStore.dispatch(incrementByAmount(5))
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual(incrementByAmount.type)
    expect(mockStore.dispatch.mock.calls[0][0].payload).toEqual(5)
    expect(mockStore.getReducerState()).toEqual({ value: 5 })
  })
})
