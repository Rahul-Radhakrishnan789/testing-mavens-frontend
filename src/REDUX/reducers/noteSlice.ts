import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/api";
import toast from "../../utils/toast";

interface Note {
  _id: string | null | undefined;
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  filterValues: {
    search: string;
    filter: string;
  };
  selectedNote?: Note | null;
}
const initialState: NoteState = {
  notes: [],
  loading: false,   
  error: null,
  filterValues: {
    search: "",
    filter: "all",
  },
  selectedNote: null,
};


export const fetchNotes = createAsyncThunk<Note[], Record<string, string>, { rejectValue: string }>(
  "notes/fetchNotes",
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const { data, status } = await api.getAllNotes(queryParams);
      if (status === 200) {
        return data.data as Note[];
      }
      return rejectWithValue("Failed to fetch notes");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchNoteById = createAsyncThunk<Note, string, { rejectValue: string }>(
  "notes/fetchNoteById",
  async (id, { rejectWithValue }) => {
    try {
      const { data, status } = await api.getNoteById(id);
      if (status === 200) {
        return data.data as Note;
      }
      return rejectWithValue("Failed to fetch note");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createNote = createAsyncThunk<Note, Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, { rejectValue: string }>(
  "notes/createNote",
  async (noteData, { rejectWithValue }) => {
    try {
      const { data, status } = await api.createNote(noteData);
      if (status === 201) {
        toast.success("Success", "Note created successfully!");
        return data.data as Note;
      }
      return rejectWithValue("Failed to create note");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateNote = createAsyncThunk<Note, { id: string; noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> }, { rejectValue: string }>(
  "notes/updateNote",
  async ({ id, noteData }, { rejectWithValue }) => {
    try {
      const { data, status } = await api.updateNote(id, noteData);
      if (status === 200) {
        toast.success("Success", "Note updated successfully!");
        return data.data as Note;
      }
      return rejectWithValue("Failed to update note");
    } catch (error: any) {
      // console.log(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteNote = createAsyncThunk<string, string, { rejectValue: string }>(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      const { status } = await api.deleteNote(id);
      if (status === 200) {
        return id;
      }
      return rejectWithValue("Failed to delete note");
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Something went wrong. Please try again later.";
      toast.error("Error", errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setFilterValues: (state, action: PayloadAction<{ search: string; filter: string }>) => {
      state.filterValues = action.payload;
    },
    resetNotes: (state) => {
      state.notes = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notes";
      })
        .addCase(fetchNoteById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
      .addCase(fetchNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create note";
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update note";
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete note";
      });
  },
});

export const { setFilterValues, resetNotes } = noteSlice.actions;
export default noteSlice.reducer;
