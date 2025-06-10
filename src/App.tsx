import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./layout"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={2000} theme="dark" />
      <AppRoutes />
    </Router>
  )
}

export default App