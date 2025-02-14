import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type ReducerSliceAState = {
  value: number
}

export const initialState: ReducerSliceAState = {
  value: 0,
}

export const asyncSetValue = createAsyncThunk('reducerSliceA/asyncSetValue', async (value: number) => {
  return new Promise<number>((resolve, _reject) => {
    setTimeout(() => {
      resolve(value)
    }, 1000)
  })
})

const reducerSliceA = createSlice({
  name: 'reducerSliceA',
  initialState,
  reducers: {
    setValue(state, action: PayloadAction<number>) {
      state.value = action.payload
    },
    reset(state) {
      state.value = initialState.value
    },
  },
  extraReducers: builder => {
    builder.addCase(asyncSetValue.fulfilled, (state, action) => {
      state.value = action.payload
    })
  },
})

export const { setValue, reset } = reducerSliceA.actions
export default reducerSliceA.reducer
