import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Dashboard from "./Pages/Dashboard";
import AddExercise from "./Pages/AddExercise";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
