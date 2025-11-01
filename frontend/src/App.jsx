import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import Dashboard from "./Pages/Dashboard";
import AddExercise from "./Pages/AddExercise";

function App() {
  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddExercise />} />
      </Routes>
    </Router>
  );
}

export default App;
