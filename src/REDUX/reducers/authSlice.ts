import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import toast from "../../utils/toast";

interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

interface AuthPayload {
  name: string;
  email: string;
  password: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  data: any; // Or better: data: User | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  data: null,
};

export const register = createAsyncThunk<User, AuthPayload, { rejectValue: string }>(
  "register",
  async (body, { rejectWithValue }) => {
    try {
      const { data, status } = await api.register(body);

      if (status === 200) {
        localStorage.setItem("fwtoken", data?.data?.token);
         localStorage.setItem("user", JSON.stringify(data?.data?.user));
        toast.success("Success", "Registration successful!");
        return data.data as User;
        
      }

      return rejectWithValue("Unexpected response from server");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const login = createAsyncThunk<User, AuthPayload, { rejectValue: string }>(
  "login",
  async (body, { rejectWithValue }) => {
    try {
      const { data, status } = await api.login(body);

      if (status === 200) {
        localStorage.setItem("fwtoken", data?.data?.token);
        localStorage.setItem("user", JSON.stringify(data?.data?.user));
        toast.success("Success", "Logged in successfully");
        return data.data as User;
      }

      return rejectWithValue("Unexpected response from server");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const allUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "users",
  async (_body, { rejectWithValue }) => {
    try {
      const { data, status } = await api.users();

      if (status === 200) {
        return data.data as User[];
      }

      return rejectWithValue("Unexpected response from server");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
    setData: (
      state,
      action: PayloadAction<{ name: keyof UserState; value: any }>
    ) => {
      const { name, value } = action.payload;
      (state as any)[name] = value;
    },
  },
  extraReducers: (builder) => {

    //register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
        state.success = false;
      });

    //login
     builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        state.success = false;
      });

      //users
      //users
    builder
      .addCase(allUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(allUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Users fetch failed";
        state.success = false;
      });
  },
});

export const { setUser, setData } = userSlice.actions;
export default userSlice.reducer;
