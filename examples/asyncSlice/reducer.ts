import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit'

interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

type AsyncState = {
  data: Todo[]
  error: SerializedError | null
  loading: boolean
}

export const initialState: AsyncState = {
  data: [],
  loading: false,
  error: null,
}

export const fetchData = createAsyncThunk('asyncSlice/fetchData', async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    return await response.json()
  } catch (error) {
    return error
  }
})

const asyncSlice = createSlice({
  name: 'asyncSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  },
})

export default asyncSlice.reducer
