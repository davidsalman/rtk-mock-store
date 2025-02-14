import { createAsyncThunk, ReducersMapObject, Action, ThunkAction } from '@reduxjs/toolkit'

/**
 * Action type defintions for actions dispatched from createAsyncThunk.
 * Need to stub the types here to properly check the action type in mock
 * store's runThunk function to ensure complete type safety.
 */
type CreateAsyncThunkAction = ReturnType<typeof createAsyncThunk>
type AsyncThunkAction = ReturnType<CreateAsyncThunkAction>

/**
 * Data structures and methods of a mock store.
 *
 * @typeParam MockRootState The root state of the mock store.
 *
 * @property rootStateSnapshots         The snapshots of the root state of the mock store.
 * @property rootState                  The root state of the mock store.
 * @property extraArgument              The extra argument of the mock store.
 * @property getRootState               Returns the root state of the mock store.
 * @property getReducerState            Returns the state of the reducer being tested.
 * @property setRootState               Sets the root state of the mock store.
 * @property setReducerState            Sets the state of the reducer being tested.
 * @property getRootStateSnapshots      Returns the snapshots of the root state of the mock store.
 * @property getRootStateSnapshot       Returns the snapshot of the root state of the mock store for a specific action type.
 * @property getReducerStateSnapshots   Returns the snapshots of the reducer being tested.
 * @property getReducerStateSnapshot    Returns the snapshot of the reducer being tested for a specific action type.
 * @property printReducerStateSnapshots Prints the snapshots of the reducer being tested.
 * @property printRootStateSnapshots    Prints the snapshots of the root state of the mock store.
 * @property next                       The next middleware function.
 * @property runThunk                   Runs a thunk action.
 * @property getState                   Returns the root state of the mock store.
 * @property dispatch                   Dispatches an action to the mock store.
 * @property reset                      Resets the mock store state to intialRootState.
 */
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

/**
 * Creates a mock store for testing redux actions and reducers using redux-toolkit.
 * Can be used to test a single reducer in isolation or multiple reducers together.
 *
 * Note: Typings for root state and actions are inferred if using redux-toolkit slices,
 * so its strongly recommended to use redux-toolkit slices for reducers and actions.
 *
 * @typeParam MockRootState The root state of the mock store.
 *
 * @param reducerToTest     The reducer to test.
 * @param reducers          All reducers in the store.
 * @param initialRootState  The initial state of the store.
 *
 * @returns A mock store.
 *
 * @example
 * // __tests__/reducer.test.ts
 * import createMockStore from 'rtk-mock-store';
 * import { INITIAL_STATE, reducer, testAction } from './reducer';
 *
 * const mockStore = createMockStore(
 *   'reducerToTest',
 *   { reducerToTest: reducer },
 *   { reducerToTest: INITIAL_STATE },
 * );
 *
 * describe('reducerToTest', () => {
 *   afterEach(() => {
 *     mockStore.reset();
 *   });
 *
 *   it('should have initial state', () => {
 *     expect(mockStore.getReducerState()).toEqual({ test: false });
 *   });
 *   it('should set test to true', () => {
 *     mockStore.dispatch(testAction());
 *     expect(mockStore.dispatch.mock.calls[0][0].type).toEqual('reducerToTest/TEST_ACTION');
 *     expect(mockStore.getReducerState()).toEqual({ test: true });
 *   });
 * });
 */
export default function createMockStore<MockRootState extends object>(
  reducerToTest: keyof MockRootState,
  reducers: ReducersMapObject<MockRootState, Action>,
  initialRootState: MockRootState,
): RTKMockStore<MockRootState> {
  /* Middleware Types */

  type ThunkMiddlewareAction = ThunkAction<unknown, MockRootState, {}, Action>
  type ThunkMiddlewareProps = {
    dispatch: (action: ThunkMiddlewareAction) => void
    getState: () => MockRootState
    extraArgument: {}
  }
  type NextAction = (action: Action) => void

  /* Middleware Mock */

  const thunkMiddleware =
    ({ dispatch, getState }: ThunkMiddlewareProps) =>
    (next: NextAction) =>
    (action: AsyncThunkAction) => {
      if (typeof action === 'function') {
        return action(dispatch, getState, {})
      }
      return next(action)
    }

  /* Store Mock */

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
