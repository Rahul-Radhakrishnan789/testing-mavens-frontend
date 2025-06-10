import React from "react";
import {Routes ,Route, useLocation } from "react-router-dom";
import RegistrationForm from "./pages/auth/registration";
import LoginForm from "./pages/auth/login";
import Navbar from "./components/header/header";
import NotesGrid from "./pages/Notes/allNotes";
import CreateNote from "./pages/Notes/createNote";
import Protected from "./utils/routeProtection";


function AppRoutes() {

       const location = useLocation();
  
    return (
      <>

         {
          location.pathname !== "/auth" &&
          location.pathname !== "/otp" && 
          <Navbar />
        }

        <div className="App">
          <Routes>
          <Route path="/" element={<NotesGrid />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/note/create" element={<Protected><CreateNote /></Protected>} />
          <Route path="/note/edit/:id" element={<Protected><CreateNote /></Protected>} />
          </Routes>
        </div>
      </>
    );
  }
  
  export default AppRoutes;