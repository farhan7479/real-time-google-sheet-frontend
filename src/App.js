import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import TextEditor from "./Components/TextEditor";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import OTP from "./Components/OTP";
import DocViewer from "./Components/DocViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<SignUp />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/OTP" element={<OTP />} />
        <Route path="/doc/:id" element={<TextEditor />} />
        <Route path="/documents" element={<DocViewer />} />
      </Routes>
    </Router>
  );
}

export default App;
