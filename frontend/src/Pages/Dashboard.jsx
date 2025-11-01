import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import API from "../api";
import ExerciseCard from "../components/ExerciseCard";

// Animation variants for the container (grid) and its items (cards)
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each card animates 0.1s after the previous
    },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all exercise groups
  const fetchGroups = async () => {
    try {
      const res = await API.get("/");
      setGroups(res.data.exercises || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ✅ Handle Delete (called by ExerciseCard)
  const handleDelete = (deletedId) => {
    setGroups((prev) => prev.filter((group) => group._id !== deletedId));
  };

  // ✅ Handle Update (called by ExerciseCard)
  const handleUpdate = (updatedGroup) => {
    setGroups((prev) =>
      prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g))
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-300 text-lg">
        Loading exercises...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400 text-lg">
        {error}
      </div>
    );
  }

  return (
    // Set a dark gradient background for the whole page
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-white">
          Your Muscle Groups
        </h2>

        {groups.length === 0 ? (
          <p className="text-center text-gray-400">
            No exercise groups found. Add one!
          </p>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {groups.map((group) => (
                <motion.div
                  key={group._id} // Key must be on the motion component for AnimatePresence
                  variants={itemVariant}
                  exit="exit"
                  layout // This animates the grid re-ordering on delete
                  // These are the glassmorphism styles
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg overflow-hidden border border-white/20"
                >
                  <ExerciseCard
                    group={group}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}