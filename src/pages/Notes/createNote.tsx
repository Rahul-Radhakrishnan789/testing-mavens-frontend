import React, {  useEffect, useState, useCallback ,useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Users, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import type { RootState , AppDispatch } from "@/REDUX/store";
import { allUsers } from "@/REDUX/reducers/authSlice";
import { createNote,updateNote,fetchNoteById } from "@/REDUX/reducers/noteSlice";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWebSocket } from "@/context/socketContext";









interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Note {
  _id: string;
  title: string;
  content: string;
  tag: string;
  collaborators: string[];
}

interface FormValues {
  title: string;
  content: string;
  tag: string;
  collaborators: string[];
}

const categories = [
  { value: "personal", label: "Personal", color: "bg-blue-100 text-blue-800" },
  { value: "work", label: "Work", color: "bg-green-100 text-green-800" },
  { value: "study", label: "Study", color: "bg-purple-100 text-purple-800" },
  { value: "ideas", label: "Ideas", color: "bg-yellow-100 text-yellow-800" },
  { value: "shopping", label: "Shopping", color: "bg-pink-100 text-pink-800" },
  { value: "health", label: "Health", color: "bg-red-100 text-red-800" },
  { value: "travel", label: "Travel", color: "bg-indigo-100 text-indigo-800" },
  { value: "recipes", label: "Recipes", color: "bg-orange-100 text-orange-800" },
];


const noteValidationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required'),
  tag: Yup.string(),
  collaborators: Yup.array().of(Yup.string()),
});



export default function CreateNote() {

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.auth.data);
  const selectedNote = useSelector((state: RootState) => state.notes.selectedNote);
  const navigate = useNavigate();

// console.log(selectedNote, "selectedNote");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
  dispatch(allUsers());
  if (id) {
    dispatch(fetchNoteById(id));
  }
}, [dispatch, id]);


  const [users] = useState<User[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { isConnected, saveStatus, joinNote, leaveNote, editNote, onNoteUpdate, offNoteUpdate } = useWebSocket();


const formik = useFormik<FormValues>({
  initialValues: {
    title: '',
    content: '',
    tag: '',
    collaborators: [],
  },
  validationSchema: noteValidationSchema,
  
  onSubmit: async (values) => {
    
    try {
      const payload = {
        ...values,
        tags: values.tag ? [values.tag] : [],
      };

      if( !id) {
      const response = await dispatch(createNote(payload));

      unwrapResult(response);
      navigate("/");
      }
      else {
        const response = await dispatch(updateNote({ id, noteData: payload   }));
        unwrapResult(response);
        navigate("/");
      }

    
    } catch (error) {
      console.error('Note creation failed:', error);
     
    }
  },
  enableReinitialize: true, 
});

 const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

   // useEffect to watch for changes in Formik's content, title, or tag and debounce the save
  useEffect(() => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      // Ensure noteId exists before emitting
      if (id) {
        // Call editNote with the current values from Formik
        editNote(
          id,
          formik.values.content,
          formik.values.title,
          formik.values.tag
        );
      }
    }, 500); // 500ms debounce delay

    // Cleanup function: clear the timer if the component unmounts or dependencies change
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    formik.values.content, 
    formik.values.title,   
    formik.values.tag,    
    editNote,              
  ]);

const handleNoteUpdate = useCallback((data: { noteId: string; content: string; title: string; tag: string; updatedBy?: string }) => {
  formik.setValues({
    content: data.content,
    title: data.title || '',
    tag: data.tag || '',
    collaborators: formik.values.collaborators // preserve current collaborators
  }, true); // The 'true' argument tells Formik to merge the new values with existing ones.
  console.log(`Note updated by user: ${data.updatedBy}`);
}, [formik]); // Add formik to the dependency array

  useEffect(() => {
    if (id && isConnected) {
      // Join the note room
      joinNote(id);

      // Listen for updates
      onNoteUpdate(handleNoteUpdate);
      
      // Cleanup when component unmounts or noteId changes
      return () => {
        leaveNote(id);
        offNoteUpdate(handleNoteUpdate);
      };
    }
  }, [id, isConnected, joinNote, leaveNote, onNoteUpdate, offNoteUpdate, handleNoteUpdate]);


  useEffect(() => {
  if (id) {
    formik.setValues({
      title: selectedNote?.title || "",
      content: selectedNote?.content || "",
      tag: selectedNote?.tag || "",
      collaborators: selectedNote?.collaborators || [],
    });
  }
}, [id, selectedNote]);

  // console.log(formik.values, "formik values");

const addCollaborator = (userId: string) => {

  if (!formik.values.collaborators.includes(userId.toString())) {
    formik.setFieldValue("collaborators", [
      ...formik.values.collaborators,
      userId.toString(),
    ]);
    formik.setFieldTouched("collaborators", true);
  }
  setSearchTerm("");
  setShowUserDropdown(false);
};

  const removeCollaborator = (userId: string) => {
    const newCollaborators = formik.values.collaborators.filter((id) => id !== userId);
    formik.setFieldValue("collaborators", newCollaborators);
    formik.setFieldTouched("collaborators", true);
  };

const filteredUsers = data?.filter(
  (user: { name: string; email: string; _id: { toString: () => string; }; }) =>
    (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user?.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !formik.values.collaborators.includes(user?._id?.toString())
);




  const selectedCollaborators = data?.filter((user:any) =>
    formik.values.collaborators.includes(user._id)
  );



  const isEditing = Boolean(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {isEditing ? "Edit Note" : "Create Note"}
          </h1>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Note {isEditing ? 'updated' : 'created'} successfully!
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5" />
              {isEditing ? "Edit Note" : "Create Note"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <Input
                  name="title"
                  type="text"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter note title..."
                  className={`w-full ${
                    formik.errors.title && formik.touched.title 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : ""
                  }`}
                />
                {formik.errors.title && formik.touched.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formik.values.title.length}/100 characters
                </p>
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content *
                </label>
                <Textarea
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter note content..."
                  className={`min-h-[120px] ${
                    formik.errors.content && formik.touched.content 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : ""
                  }`}
                />
                {formik.errors.content && formik.touched.content && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.content}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formik.values.content.length}/5000 characters
                </p>
              </div>

              {/* Category Field */}
              <div className="relative z-50">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <Select
                  value={formik.values.tag || undefined}
                  onValueChange={(value) => {
                    formik.setFieldValue("tag", value);
                    formik.setFieldTouched("tag", true);
                  }}
                >
                  <SelectTrigger 
                    className={`w-full ${
                      formik.errors.tag && formik.touched.tag 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-md rounded-md z-50">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <Tag className="h-4 w-4 mr-2 inline-block" />
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.errors.tag && formik.touched.tag && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.tag}
                  </p>
                )}
              </div>

              {/* Collaborators Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  <Users className="h-4 w-4 inline-block mr-1" />
                  Collaborators
                </label>
                
                {/* Selected Collaborators */}
                {selectedCollaborators?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCollaborators?.map((user:User) => (
                      <Badge
                        key={user._id}
                        variant="secondary"
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1"
                      >
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{user.name}</span>
                        <button
                          onClick={() => removeCollaborator(user._id)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add Collaborator Input */}
                <div className="relative">
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowUserDropdown(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowUserDropdown(searchTerm.length > 0)}
                    placeholder="Search users to add as collaborators..."
                    className="w-full"
                  />
                  
                  {/* User Dropdown */}
                  {showUserDropdown && filteredUsers?.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-40 max-h-48 overflow-y-auto mt-1">
                      {filteredUsers?.slice(0, 6).map((user:any) => (
                        <div
                          key={user?._id}
                          onClick={() => addCollaborator(user?._id)}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user?.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* No users found message */}
                  {showUserDropdown && searchTerm && filteredUsers?.length === 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-40 mt-1">
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No users found matching "{searchTerm}"
                      </div>
                    </div>
                  )}
                </div>

                {/* Collaborator validation error */}
                {formik.errors.collaborators && formik.touched.collaborators && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formik.errors.collaborators}
                  </p>
                )}

                {/* Collaborator count info */}
                <p className="text-xs text-gray-500">
                  {formik?.values?.collaborators?.length}/10 collaborators selected
                </p>
              </div>

              

              {/* Submit Button */}
              <Button
                onClick={() => formik.handleSubmit()}
                disabled={formik.isSubmitting || !formik.isValid}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  isEditing ? "Update Note" : "Create Note"
                )}
              </Button>

              {/* Form Summary */}
              {Object.keys(formik.errors).length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Please fix the errors or fill the fields above before submitting.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Click outside handler for dropdown */}
        {showUserDropdown && (
          <div
            className=""
            onClick={() => setShowUserDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}