import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Dashboard from "./Pages/Dashboard";
import AddExercise from "./Pages/AddExercise";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
