# 📝 Realtime Notes App

A modern frontend project for collaborative note-taking built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Socket.IO**. Users can **create**, **edit**, and **collaborate in real-time** on notes. Includes full **JWT authentication**, **route protection**, responsive UI, and smooth UX with custom toasts and validations.

---

## 🚀 Features

- 🔐 **Authentication**:
  - JWT-based login and signup pages
  - Protected routes for authenticated users only

- 📓 **Notes System**:
  - Create, list, edit, and view notes
  - Real-time collaboration via WebSocket (Socket.IO)
  - Single component handles both creation and editing

- 🌐 **Live Collaboration**:
  - Seamless updates across clients in real time
  - WebSocket integration handled via Context API

- 🎨 **UI/UX**:
  - Tailwind CSS for styling
  - ShadCN UI components
  - Fully responsive design
  - Custom toast system for feedback

- 🧠 **State Management & Validation**:
  - Global state managed with Redux
  - Form validation using **Yup** and **Zod**
  
---

## 🛠️ Tech Stack

| Tech             | Purpose                        |
|------------------|--------------------------------|
| React            | UI Framework                   |
| Vite             | Fast development server + build|
| TypeScript       | Type safety                    |
| Tailwind CSS     | Utility-first styling          |
| Redux            | State management               |
| Socket.IO        | Real-time collaboration        |
| Context API      | WebSocket management           |
| Yup & Zod        | Form validation                |
| ShadCN UI        | Pre-built components           |

---

## 📂 Project Structure

src/
├── assets/ # Static files
├── components/ # Reusable UI components
├── features/ # Redux slices and logic
├── hooks/ # Custom React hooks
├── pages/ # Route-level components (Login, Signup, Notes)
├── services/ # API calls and socket setup
├── store/ # Redux store config
├── utils/ # Utility functions
├── validation/ # Yup/Zod schemas
├── App.tsx # Root component
├── main.tsx # App entry
└── index.css # Global styles



---

## 🧪 Setup Instructions

### 1. Clone the Repo

git clone https://github.com/your-username/realtime-notes-app.git
cd realtime-notes-app

### 2. Install Dependencies

npm install

### 3 . Start Development Server

npm run dev





