import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "./store";

//* Creating asyncThunk
export const saveUsername = createAsyncThunk<
  string, //* Type of the resolved value (payload)
  string, //* Type of the argument passed to the thunk
  { rejectValue: string } // Type of the rejected value
>("user/saveUsername", async (name: string, { rejectWithValue }) => {
  try {
    await AsyncStorage.setItem("@username", name);
    return name; //* Return the name as the fulfilled payload
  } catch (error) {
    console.error("Error saving username:", error);
    return rejectWithValue("Failed to save username"); //* Return a specific error message
  }
});

// Thunk for saving preferences
export const saveUserPreferences = createAsyncThunk<
  string[], // Type of the resolved value (updated preferences array)
  string, // Type of the argument passed to the thunk
  { state: RootState } // Access to the Redux state
>(
  "user/saveUserPreferences",
  async (preference, { getState, rejectWithValue }) => {
    try {
      const { userPrferences } = getState().user; // Get the current preferences
      let updatedPreferences: string[];

      if (userPrferences.includes(preference)) {
        // Remove if it exists
        updatedPreferences = userPrferences.filter(
          (item) => item !== preference
        );
      } else {
        // Add if it doesn't exist
        updatedPreferences = [...userPrferences, preference];
      }

      // Persist the updated preferences in AsyncStorage
      await AsyncStorage.setItem(
        "@userPreferences",
        JSON.stringify(updatedPreferences)
      );

      return updatedPreferences; // Return the updated preferences
    } catch (error) {
      console.error("Error saving preferences to AsyncStorage:", error);
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    isLoading: false,
    error: null as string | null | undefined,
    userPrferences: [] as string[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveUsername.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload;
      })
      .addCase(saveUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveUserPreferences.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPrferences = action.payload;
          state.error = null;
      })
      .addCase(saveUserPreferences.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { saveUserPreferences } = userSlice.actions;
export const selectUserData = (state: RootState) => state.user;
export default userSlice.reducer;
