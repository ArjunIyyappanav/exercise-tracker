import { useState } from "react";
import ReactDOM from "react-dom"; // 1. IMPORT ReactDOM
import { motion, AnimatePresence } from "framer-motion";
import API from "../api";

// (Animation variants are unchanged)
const modalBackdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};


export default function ExerciseCard({ group, onDelete, onUpdate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(group);

  // (All your handlers are correct and unchanged)
  // ... (formattedDate, handleDelete, handleUpdate) ...
  const formattedDate = new Date(group.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${group.muscleGroup}?`)) return;
    setIsDeleting(true);
    try {
      await API.delete(`/${group._id}`);
      onDelete?.(group._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete exercise");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await API.patch(`/${group._id}`, editData);
      onUpdate?.(res.data.exercise);
      setIsEditing(false);
    } catch (err)
    {
      console.error(err);
      alert("Failed to update exercise");
    }
  };


  return (
    <>
      {/* This is the card content. It stays inside the parent's overflow-hidden div */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-white">{group.muscleGroup}</h3>
            <span className="text-sm text-gray-400">{formattedDate}</span>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm rounded-lg bg-blue-500/30 text-blue-100 hover:bg-blue-500/50 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                isDeleting
                  ? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  : "bg-red-500/30 text-red-100 hover:bg-red-500/50"
              }`}
            >
              {isDeleting ? "..." : "Delete"}
            </button>
          </div>
        </div>

        <ul className="space-y-3">
          {group.exercises?.map((exercise, idx) => (
            <li
              key={idx}
              className="border border-white/10 rounded-lg p-3 hover:bg-white/5 transition"
            >
              <p className="font-medium text-white mb-1">{exercise.name}</p>
              <ul className="ml-3 text-sm text-gray-300 space-y-1">
                {exercise.sets?.map((set, i) => (
                  <li key={i} className="text-gray-300">
                    Reps: <span className="font-semibold text-gray-100">{set.reps}</span> | Weight:{" "}
                    <span className="font-semibold text-gray-100">
                      {set.weight ?? "Bodyweight"}
                    </span>
                    {set.notes && (
                      <>
                        {" "}– <em className="text-gray-400">{set.notes}</em>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. WRAP THE MODAL IN A PORTAL */}
      {/* This teleports the modal to the <body> tag, escaping the overflow-hidden */}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isEditing && (
            <motion.div
              variants={modalBackdropVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                variants={modalContentVariant}
                className="bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 w-[90%] max-w-lg shadow-xl relative border border-white/20 text-white"
              >
                {/* All the modal content is unchanged */}
                <h2 className="text-xl font-semibold mb-4 text-white">Edit Exercise Group</h2>

                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Muscle Group
                </label>
                <input
                  type="text"
                  value={editData.muscleGroup}
                  onChange={(e) =>
                    setEditData({ ...editData, muscleGroup: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <h3 className="font-medium mb-2 text-gray-200">Exercises:</h3>
                <div className="max-h-60 overflow-y-auto pr-2">
                  {editData.exercises.map((ex, idx) => (
                    <div key={idx} className="mb-3 border border-gray-700 p-3 rounded-lg">
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) => {
                          const updated = [...editData.exercises];
                          updated[idx].name = e.target.value;
                          setEditData({ ...editData, exercises: updated });
                        }}
                        placeholder="Exercise name"
                        className="w-full bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 mb-2 focus:ring-1 focus:ring-blue-400 outline-none"
                      />

                      {ex.sets.map((set, sIdx) => (
                        <div key={sIdx} className="flex gap-2 mb-2">
                          <input
                            type="number"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) => {
                              const updated = [...editData.exercises];
                              updated[idx].sets[sIdx].reps = e.target.value;
                              setEditData({ ...editData, exercises: updated });
                            }}
                            className="w-1/3 bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Weight"
                            value={set.weight || ""}
                            onChange={(e) => {
                              const updated = [...editData.exercises];
                              updated[idx].sets[sIdx].weight = e.target.value;
                              setEditData({ ...editData, exercises: updated });
                            }}
                            className="w-1/3 bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Notes"
                            value={set.notes || ""}
                            onChange={(e) => {
                              const updated = [...editData.exercises];
                              updated[idx].sets[sIdx].notes = e.target.value;
                              setEditData({ ...editData, exercises: updated });
                            }}
                            className="w-1/3 bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600/50 hover:bg-gray-600/80 text-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body // <-- Renders the modal as a direct child of <body>
      )}
    </>
  );
}