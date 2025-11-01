import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import API from "../api";

export default function AddExercise() {
  const navigate = useNavigate(); // Hook for navigation
  const [submitting, setSubmitting] = useState(false);
  const [muscleGroup, setMuscleGroup] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: [{ reps: "", weight: "", notes: "" }] }, // Added notes
  ]);

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  // ✅ UX: Add a new exercise
  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: "", sets: [{ reps: "", weight: "", notes: "" }] },
    ]);
  };

  // ✅ UX: Remove an exercise (if not the last one)
  const removeExercise = (exIndex) => {
    if (exercises.length <= 1) return; // Don't remove the last one
    setExercises(exercises.filter((_, i) => i !== exIndex));
  };

  // ✅ UX: Add a new set to an exercise
  const addSet = (exIndex) => {
    const updated = [...exercises];
    updated[exIndex].sets.push({ reps: "", weight: "", notes: "" });
    setExercises(updated);
  };

  // ✅ UX: Remove a set (if not the last one)
  const removeSet = (exIndex, setIndex) => {
    if (exercises[exIndex].sets.length <= 1) return; // Don't remove the last set
    const updated = [...exercises];
    updated[exIndex].sets = updated[exIndex].sets.filter(
      (_, i) => i !== setIndex
    );
    setExercises(updated);
  };

  // ✅ UX: Handle submit, show loading state, and redirect
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/", {
        muscleGroup,
        exercises,
      });
      navigate("/"); // Navigate back to dashboard on success
    } catch (err) {
      console.error(err);
      alert("Error adding exercise");
      setSubmitting(false); // Only stop loading if there's an error
    }
  };

  return (
    // Page background
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-200">
      {/* Glassmorphism Form Panel */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">
          Log New Workout
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Muscle Group */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Muscle Group
            </label>
            <input
              type="text"
              placeholder="e.g., Chest & Triceps"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              required
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Exercises Loop */}
          {exercises.map((exercise, exIndex) => (
            // Exercise Sub-Panel
            <div
              key={exIndex}
              className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-gray-300">
                  Exercise #{exIndex + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeExercise(exIndex)}
                  disabled={exercises.length <= 1} // UX: Disable if it's the last one
                  className="px-2 py-1 text-xs rounded-lg bg-red-500/30 text-red-100 hover:bg-red-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove Exercise
                </button>
              </div>

              <input
                type="text"
                placeholder="Exercise Name (e.g., Bench Press)"
                value={exercise.name}
                onChange={(e) =>
                  handleExerciseChange(exIndex, "name", e.target.value)
                }
                required
                className="w-full bg-gray-600/50 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-400 outline-none"
              />

              {/* Sets Loop */}
              <div className="space-y-3 pl-2 border-l-2 border-gray-700">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
                  >
                    <span className="text-sm text-gray-400 md:text-right">Set {setIndex + 1}</span>
                    {/* Set Inputs */}
                    <input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(exIndex, setIndex, "reps", e.target.value)
                      }
                      required
                      className="w-full bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(exIndex, setIndex, "weight", e.target.value)
                      }
                      className="w-full bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={set.notes || ""}
                      onChange={(e) =>
                        handleSetChange(exIndex, setIndex, "notes", e.target.value)
                      }
                      className="w-full bg-gray-600/50 border border-gray-600 text-white rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 outline-none"
                    />

                    {/* Remove Set Button */}
                    <button
                      type="button"
                      onClick={() => removeSet(exIndex, setIndex)}
                      disabled={exercises[exIndex].sets.length <= 1} // UX: Disable if it's the last set
                      className="md:col-start-5 text-red-300 hover:text-red-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove Set
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <button
                type="button"
                onClick={() => addSet(exIndex)}
                className="w-full mt-2 px-3 py-1 text-sm rounded-lg bg-gray-500/30 text-gray-100 hover:bg-gray-500/50 transition"
              >
                ➕ Add Set
              </button>
            </div>
          ))}

          {/* Form Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={addExercise}
              className="w-full px-4 py-2 rounded-lg bg-blue-500/30 text-blue-100 hover:bg-blue-500/50 transition"
            >
              ➕ Add Another Exercise
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-gray-500"
            >
              {submitting ? "Saving..." : "Save Workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}