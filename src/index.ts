import { createAsyncThunk, ReducersMapObject, Action, ThunkAction } from '@reduxjs/toolkit'

type CreateAsyncThunkAction = ReturnType<typeof createAsyncThunk>
type AsyncThunkAction = ReturnType<CreateAsyncThunkAction>

type RTKMockStore<MockRootState> = {
  rootStateSnapshots: Record<Action['type'], MockRootState>[]
  rootState: MockRootState
  extraArgument: object
  getRootState: () => MockRootState
  getReducerState: () => MockRootState[keyof MockRootState]
  setRootState: (state: MockRootState) => void
  setReducerState: (state: MockRootState[keyof MockRootState]) => void
  getRootStateSnapshots: () => Record<Action['type'], MockRootState>[]
  getRootStateSnapshot: (actionType: Action['type']) => Record<Action['type'], MockRootState> | undefined
  getReducerStateSnapshots: () => Record<Action['type'], MockRootState[keyof MockRootState]>[]
  getReducerStateSnapshot: (
    actionType: Action['type'],
  ) => Record<Action['type'], MockRootState[keyof MockRootState]> | undefined
  printReducerStateSnapshots: () => void
  printRootStateSnapshots: () => void
  next: jest.Mock
  runThunk: (action: AsyncThunkAction) => void
  getState: () => MockRootState
  dispatch: jest.Mock
  reset: () => void
}

export default function createMockStore<MockRootState extends object>(
  reducerToTest: keyof MockRootState,
  reducers: ReducersMapObject<MockRootState, Action>,
  initialRootState: MockRootState,
): RTKMockStore<MockRootState> {
  type ThunkMiddlewareAction = ThunkAction<unknown, MockRootState, {}, Action>
  type ThunkMiddlewareProps = {
    dispatch: (action: ThunkMiddlewareAction) => void
    getState: () => MockRootState
    extraArgument: {}
  }
  type NextAction = (action: Action) => void

  const thunkMiddleware =
    ({ dispatch, getState }: ThunkMiddlewareProps) =>
    (next: NextAction) =>
    (action: AsyncThunkAction) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, {})
      }
      return next(action)
    }

  const store: RTKMockStore<MockRootState> = {
    rootState: { ...initialRootState },
    extraArgument: {},

    getRootState: () => store.rootState,
    getReducerState: () => store.rootState[reducerToTest],

    setRootState: (state: MockRootState) => {
      Object.assign(store.rootState, state)
    },
    setReducerState: (state: MockRootState[keyof MockRootState]) => {
      store.rootState[reducerToTest] = state
    },

    next: jest.fn(),
    runThunk: (action: AsyncThunkAction) => {
      return thunkMiddleware(store)(store.next)(action)
    },

    getState: () => store.getRootState(),
    dispatch: jest.fn((action: Action) => {
      for (const reducerName in reducers) {
        if (typeof action === 'function') {
          return store.runThunk(action)
        }
        const reducer = reducers[reducerName]
        store.rootState = {
          ...store.rootState,
          [reducerName]: {
            // @ts-ignore
            ...reducer(store.rootState[reducerName], action),
          },
        }
        store.rootStateSnapshots.push({
          [action.type]: { ...store.rootState },
        })
      }
    }),

    rootStateSnapshots: [],

    getRootStateSnapshots: () => store.rootStateSnapshots,
    getRootStateSnapshot: (actionType: Action['type']) =>
      store.getRootStateSnapshots().find(snapshot => snapshot[actionType]),

    getReducerStateSnapshots: () =>
      store.rootStateSnapshots.map(snapshot => {
        const keys = Object.keys(snapshot)
        return keys.reduce((acc, key) => ({ ...acc, [key]: snapshot[key][reducerToTest] }), {})
      }),
    getReducerStateSnapshot: (actionType: Action['type']) =>
      store.getReducerStateSnapshots().find(snapshot => snapshot[actionType]),

    printRootStateSnapshots: () => {
      console.log(JSON.stringify(store.getRootStateSnapshots(), null, 2))
    },
    printReducerStateSnapshots: () => {
      console.log(JSON.stringify(store.getReducerStateSnapshots(), null, 2))
    },

    reset: () => {
      store.rootStateSnapshots = []
      store.rootState = { ...initialRootState }

      store.next.mockClear()
      store.dispatch.mockClear()
    },
  }

  return store
}
