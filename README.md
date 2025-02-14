# rtk-mock-store ![build-workflow](https://github.com/davidsalman/rtk-mock-store/actions/workflows/build.yml/badge.svg) ![check-code-coverage](https://img.shields.io/badge/code--coverage-100%25-brightgreen)
Modern redux store jest mock helper function for testing reducers using @reduxjs/toolkit slices.

## Installation
To install the `rtk-mock-store` package, use the following command:

```sh
npm install rtk-mock-store
```

## Examples

* [simple reducer](https://github.com/davidsalman/rtk-mock-store/blob/main/examples/simpleSlice/__tests__/reducer.test.ts)
* [async reducer](https://github.com/davidsalman/rtk-mock-store/blob/main/examples/asyncSlice/__tests__/reducer.test.ts)


## API Documentation
#### createMockStore
Creates a mock store for testing redux actions and reducers using redux-toolkit. It can be used to test a single reducer in isolation or multiple reducers together.

###### Type Parameters
- `MockRootState`: The root state of the mock store.
###### Parameters
- `reducerToTest`: The reducer to test (key of `MockRootState`).
- `reducers`: All reducers in the store (`ReducersMapObject`).
- `initialRootState`: The initial state of the store (`MockRootState`).
###### Returns
- `RTKMockStore<MockRootState>`: The mock store instance.

###### Example

```typescript
// reducer.test.ts
import createMockStore from 'rtk-mock-store';
import { INITIAL_STATE, reducer, testAction } from './reducer';

const mockStore = createMockStore(
  'reducerToTest',
  { reducerToTest: reducer },
  { reducerToTest: INITIAL_STATE }
);

describe('reducerToTest', () => {
  afterEach(() => {
    mockStore.reset();
  });

  it('should have initial state', () => {
    expect(mockStore.getReducerState()).toEqual({ test: false });
  });

  it('should set test to true', () => {
    mockStore.dispatch(testAction());
    expect(mockStore.dispatch.mock.calls[0][0].type).toEqual('reducerToTest/TEST_ACTION');
    expect(mockStore.getReducerState()).toEqual({ test: true });
  });
});
```

#### RTKMockStore Properties

|Property|Type|Comments|
|-|-|-|
|`rootStateSnapshots`|`Record<Action['type'], MockRootState>[]`|The snapshots of the root state of the mock store.|
|`rootState`|`MockRootState`|The root state of the mock store.|
|`extraArgument`|object|The extra argument of the mock store.|
|`getRootState`|() => `MockRootState`|Returns the root state of the mock store.|
|`getReducerState`|() => `MockRootState[keyof MockRootState]`|Returns the state of the reducer being tested.|
|`setRootState`|(state: `MockRootState`) => void|Sets the root state of the mock store.|
|`setReducerState`|(state: `MockRootState[keyof MockRootState]`) => void|Sets the state of the reducer being tested.|
|`getRootStateSnapshots`|() => `Record<Action['type'], MockRootState>[]`|Returns the snapshots of the root state of the mock store.|
|`getRootStateSnapshot`|(actionType: `Action['type']`) => `Record<Action['type'], MockRootState> \| undefined`|Returns the snapshot of the root state of the mock store for a specific action type.|
|`getReducerStateSnapshots`|() => `Record<Action['type'], MockRootState[keyof MockRootState]>[]`|Returns the snapshots of the reducer being tested.|
|`getReducerStateSnapshot`|(actionType: `Action['type']`) => `Record<Action['type'], MockRootState[keyof MockRootState]> \| undefined`|Returns the snapshot of the reducer being tested for a specific action type.|
|`printReducerStateSnapshots`|() => void|Prints the snapshots of the reducer being tested.|
|`printRootStateSnapshots`|() => void|Prints the snapshots of the root state of the mock store.|
|`next`|(action: `Action`) => void|The next middleware function.|
|`runThunk`|(action: `ThunkAction<any, MockRootState, any, Action>`) => void|Runs a thunk action.|
|`getState`|() => `MockRootState`|Returns the root state of the mock store.|
|`dispatch`|(action: `Action`) => void|Dispatches an action to the mock store.|
|`reset`|() => void|Resets the mock store state to intialRootState.|

## Contribution

If you want to contribute to this project, send a PR directly instead of creating an issue.
