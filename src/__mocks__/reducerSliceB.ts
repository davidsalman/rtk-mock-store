import { createSlice } from '@reduxjs/toolkit'
import { asyncSetValue, reset, setValue } from './reducerSliceA'

type ReducerSliceBState = {
  value: string
}

export const initialState: ReducerSliceBState = {
  value: '',
}

const reducerSliceB = createSlice({
  name: 'reducerSliceB',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(asyncSetValue.fulfilled, (state, action) => {
      state.value = 'asyncSetValue'
    })
    builder.addCase(setValue, (state, action) => {
      state.value = 'setValue'
    })
    builder.addCase(reset, state => {
      state.value = 'reset'
    })
  },
})

export default reducerSliceB.reducer
