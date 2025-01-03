import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from './store'; 

//* Creating asyncThunk
export const saveUsername = createAsyncThunk<
  string, // Type of the resolved value (payload)
  string, // Type of the argument passed to the thunk
  { rejectValue: string } // Type of the rejected value
>("user/saveUsername", async (name: string, { rejectWithValue }) => {
  try {
    await AsyncStorage.setItem("@username", name);
    return name; // Return the name as the fulfilled payload
  } catch (error) {
    console.error("Error saving username:", error);
    return rejectWithValue("Failed to save username"); // Return a specific error message
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    isLoading: false,
      error: null as string | null | undefined,
    userPrferences: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveUsername.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(saveUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload;
      })
      .addCase(saveUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;


export const selectUserData = (state: RootState) => state.user;
