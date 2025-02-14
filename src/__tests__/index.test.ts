import createMockStore from '..'
import {
  default as reducerSliceA,
  initialState as reducerSliceAInitialState,
  asyncSetValue,
  reset,
  setValue,
} from '../__mocks__/reducerSliceA'
import { default as reducerSliceB, initialState as reducerSliceBInitialState } from '../__mocks__/reducerSliceB'

const mockStore = createMockStore(
  'reducerSliceA',
  {
    reducerSliceA,
    reducerSliceB,
  },
  {
    reducerSliceA: reducerSliceAInitialState,
    reducerSliceB: reducerSliceBInitialState,
  },
)

describe('createMockStore', () => {
  const consoleSpy = jest.spyOn(console, 'log')

  afterEach(() => {
    consoleSpy.mockClear()
    mockStore.reset()
  })

  it('should return root state', () => {
    expect(mockStore.getRootState()).toMatchSnapshot()
  })

  it('should return reducer state', () => {
    expect(mockStore.getReducerState()).toMatchSnapshot()
  })

  it('should set root state', () => {
    mockStore.setRootState({
      reducerSliceA: { value: 1 },
      reducerSliceB: { value: 'test' },
    })
    expect(mockStore.getRootState()).toMatchSnapshot()
  })

  it('should set reducer state', () => {
    mockStore.setReducerState({ value: 2 })
    expect(mockStore.getReducerState()).toMatchSnapshot()
  })

  it('should dispatch action', () => {
    mockStore.dispatch(setValue(3))
    expect(mockStore.dispatch).toHaveBeenCalledTimes(1)
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual('reducerSliceA/setValue')
    expect(mockStore.dispatch.mock.calls[0][0].payload).toEqual(3)
    expect(mockStore.getReducerState()).toMatchSnapshot()
  })

  it('should dispatch async thunk action', async () => {
    await mockStore.dispatch(asyncSetValue(3))
    expect(mockStore.dispatch).toHaveBeenCalled()
    expect(mockStore.dispatch.mock.calls[1][0].type).toEqual(asyncSetValue.pending.type)
    expect(mockStore.dispatch.mock.calls[1][0].meta.arg).toEqual(3)
    expect(mockStore.dispatch.mock.calls[2][0].type).toEqual(asyncSetValue.fulfilled.type)
    expect(mockStore.dispatch.mock.calls[2][0].payload).toEqual(3)
    expect(mockStore.getReducerState()).toMatchSnapshot()
  })

  it('should return state', () => {
    mockStore.dispatch(setValue(4))
    expect(mockStore.getState()).toMatchSnapshot()
  })

  it('should return root state snapshots', () => {
    mockStore.dispatch(setValue(5))
    mockStore.dispatch(reset())
    expect(mockStore.getRootStateSnapshots()).toMatchSnapshot()
  })

  it('should return root state snapshot by action type', () => {
    mockStore.dispatch(setValue(6))
    mockStore.dispatch(reset())
    expect(mockStore.getRootStateSnapshot('reducerSliceA/setValue')).toMatchSnapshot()
  })

  it('should return reducer state snapshots', () => {
    mockStore.dispatch(setValue(7))
    mockStore.dispatch(reset())
    expect(mockStore.getReducerStateSnapshots()).toMatchSnapshot()
  })

  it('should return reducer state snapshot by action type', () => {
    mockStore.dispatch(setValue(8))
    mockStore.dispatch(reset())
    expect(mockStore.getReducerStateSnapshot('reducerSliceA/setValue')).toMatchSnapshot()
  })

  it('should print root state snapshots', () => {
    mockStore.dispatch(setValue(9))
    mockStore.dispatch(reset())
    mockStore.printRootStateSnapshots()
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockStore.getRootStateSnapshots(), null, 2))
  })

  it('should print reducer state snapshots', () => {
    mockStore.dispatch(setValue(10))
    mockStore.dispatch(reset())
    mockStore.printReducerStateSnapshots()
    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(mockStore.getReducerStateSnapshots(), null, 2))
  })
})
