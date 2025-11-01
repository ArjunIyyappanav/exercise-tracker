import { Link, NavLink } from "react-router-dom"; // Import NavLink

export default function Navigation() {
  
  // Helper function to apply classes
  const getNavLinkClass = ({ isActive }) =>
    `text-gray-300 hover:text-white transition-colors ${
      isActive ? "text-white font-semibold" : ""
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/50 backdrop-blur-lg text-white px-6 py-4 flex justify-between items-center border-b border-white/20">
      <Link to="/" className="text-2xl font-bold">
        🏋️ Exercise Tracker
      </Link>
      <div className="space-x-6">
        <NavLink to="/" className={getNavLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/add" className={getNavLinkClass}>
          Add Exercise
        </NavLink>
      </div>
    </nav>
  );
}