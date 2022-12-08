import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import { SignUp } from "./pages/create-account";
import { Login } from "./pages/login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
