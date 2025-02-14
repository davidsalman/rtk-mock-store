import createMockStore from 'rtk-mock-store'
import reducer, { fetchData, initialState } from '../reducer'

const mockStore = createMockStore('asyncSlice', { asyncSlice: reducer }, { asyncSlice: initialState })

describe('async reducer', () => {
  afterEach(() => {
    mockStore.reset()
  })

  it('should have initial state', () => {
    expect(mockStore.getReducerState()).toEqual({ data: [], error: null, loading: false })
  })

  it('should fetch data', async () => {
    await mockStore.dispatch(fetchData())
    expect(mockStore.dispatch.mock.calls[1][0].type).toEqual(fetchData.pending.type)
    expect(mockStore.dispatch.mock.calls[2][0].type).toEqual(fetchData.fulfilled.type)
    expect(mockStore.getReducerState()).toEqual({
      data: mockStore.dispatch.mock.calls[2][0].payload,
      error: null,
      loading: false,
    })
  })
})
