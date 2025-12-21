import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../apis/userApi";

export default function Appointment() {
  const [scheduleOwner, setScheduleOwner] = useState("");
  const [form, setForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const { getUserByUsername, getUser } = userApi();

  const handleAppointmentButton = () => setForm(true);

  const handleScheduleOwnerChange = (e) => {
    setScheduleOwner(e.target.value);
  };

  const handleMakeAppointment = async () => {
    if (!scheduleOwner.trim()) {
      setMessage(["Please enter a username", "error"]);
      return;
    }

    setLoading(true);
    try {
      const user = await getUserByUsername(scheduleOwner);
      const currentUserID = parseInt(localStorage.getItem("userID"));
      const currentUser = await getUser(currentUserID);

      if (scheduleOwner === currentUser.username) {
        setMessage(["You can't make an appointment with yourself", "error"]);
        setLoading(false);
        return;
      }

      if (user?.userID) {
        setMessage(["Redirecting to schedule", "success"]);
        setTimeout(() => {
          navigate("/schedule", { state: { userID: user.userID } });
          setScheduleOwner("");
          setForm(false);
        }, 500);
      } else {
        setMessage(["User not found", "error"]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage(["The user doesn't exist, please try again", "error"]);
      } else {
        setMessage(["Failed to find user", "error"]);
      }
      setScheduleOwner("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {!form ? (
        <button
          onClick={handleAppointmentButton}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200"
        >
          Make an Appointment
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Find a Schedule</h3>
          <input
            type="text"
            value={scheduleOwner}
            placeholder="Enter username"
            onChange={handleScheduleOwnerChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2">
            <button
              onClick={handleMakeAppointment}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={() => {
                setForm(false);
                setMessage(null);
                setScheduleOwner("");
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>

          {message && message[1] === "error" && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 rounded-lg p-3">
              <p className="text-red-800 text-sm">{message[0]}</p>
            </div>
          )}
          {message && message[1] === "success" && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 rounded-lg p-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-800 text-sm">{message[0]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
