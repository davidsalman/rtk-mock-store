import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SimpleState = {
  value: number
}

export const initialState: SimpleState = {
  value: 0,
}

const simpleSlice = createSlice({
  name: 'simpleSlice',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = simpleSlice.actions
export default simpleSlice.reducer
