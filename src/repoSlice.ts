import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface Repository {
  id: number;
  owner: {
    avatar_url: string;
    login: string;
  };
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  full_name: string;
}

interface RepoState {
  data: Repository[];
  loading: boolean;
  error: string | null;
  favourites: string[];
}

export const fetchRecommendedRepos = createAsyncThunk<
  Repository[],
  string[],
  { rejectValue: string }
>("repos/fetchRecommended", async (preferences, { rejectWithValue }) => {
  const apiUrl = "https://api.github.com/search/repositories";
  const query = preferences.join(" OR ");
  const params = new URLSearchParams({
    q: query,
    sort: "stars",
    order: "desc",
    per_page: "10",
  });

  try {
    const response = await fetch(`${apiUrl}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    const data = await response.json();
    return data.items as Repository[];
  } catch (error) {
    return rejectWithValue("Error fetching recommended repositories");
  }
});

// export const searchRepos = createAsyncThunk<
//   Repository[],
//   string,
//   { rejectValue: string }
// >("repos/search", async (searchQuery, { rejectWithValue }) => {
//   const apiUrl = "https://api.github.com/search/repositories";
//   const params = new URLSearchParams({
//     q: searchQuery,
//     sort: "stars",
//     order: "desc",
//     per_page: "1",
//   });

//   try {
//     const response = await fetch(`${apiUrl}?${params}`);
//     if (!response.ok) {
//       throw new Error("Failed to search repositories");
//     }
//     const data = await response.json();
//     return data.items as Repository[];
//   } catch (error) {
//     return rejectWithValue("Error searching repositories");
//   }
// });

export const searchRepos = createAsyncThunk<
  Repository[],
  string,
  { rejectValue: string }
>("repos/search", async (searchQuery, { rejectWithValue }) => {
  const apiUrl = "https://api.github.com/search/repositories";
  const params = new URLSearchParams({
    q: `in:name ${searchQuery}`, // This ensures we search in repository names
    sort: "stars",
    order: "desc",
    per_page: "10",
  });

  try {
    const response = await fetch(`${apiUrl}?${params}`);
    if (!response.ok) {
      throw new Error("Failed to search repositories");
    }
    const data = await response.json();
    return data.items as Repository[];
  } catch (error) {
    return rejectWithValue("Error searching repositories");
  }
});

const repoSlice = createSlice({
  name: "repos",
  initialState: {
    data: [],
    loading: false,
    error: null,
    favourites: [],
  } as RepoState,
  reducers: {
    toggleFavorite: (state, action) => {
      if (state.favourites.includes(action.payload)) {
        state.favourites = state.favourites.filter(
          (repo) => repo !== action.payload
        );
      } else {
        state.favourites.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecommendedRepos.fulfilled,
        (state, action: PayloadAction<Repository[]>) => {
          state.loading = false;
          action.payload.forEach((repo) => {
            if (
              !state.data.some((existingRepo) => existingRepo.id === repo.id)
            ) {
              state.data.push(repo);
            }
          });
        }
      )
      .addCase(fetchRecommendedRepos.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch recommended repositories";
      })
      .addCase(searchRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchRepos.fulfilled,
        (state, action: PayloadAction<Repository[]>) => {
          state.loading = false;
          action.payload.forEach((repo) => {
            if (
              !state.data.some((existingRepo) => existingRepo.id === repo.id)
            ) {
              state.data.push(repo);
            }
          });
        }
      )
      .addCase(searchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search repositories";
      });
  },
});

export const { toggleFavorite } = repoSlice.actions;

export default repoSlice.reducer;
export const selectRepos = (state: RootState) => state.repos;
