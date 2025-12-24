import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../apis/userApi";

export default function Profile() {
  const navigate = useNavigate();
  const { getUser, updateProfile } = useMemo(() => userApi(), []);
  const userID = useMemo(() => parseInt(localStorage.getItem("userID"), 10), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", email: "" });

  useEffect(() => {
    const load = async () => {
      if (!userID) {
        setLoading(false);
        navigate("/home");
        return;
      }
      try {
        setLoading(true);
        const user = await getUser(userID);
        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
        });
      } catch (err) {
        setMessage(["Failed to load profile", "error"]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userID, getUser, navigate]);

  const handleSave = async () => {
    if (!form.name && !form.username && !form.email) {
      setMessage(["Enter at least one field", "error"]);
      return;
    }
    try {
      setSaving(true);
      await updateProfile(userID, form);
      setMessage(["Profile updated", "success"]);
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setMessage([backendMessage || "Failed to update profile", "error"]);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-4 shadow-lg">
            <span className="text-3xl text-white">👤</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          
          <div className="p-6 sm:p-8">
            {message && (
              <div className={`mb-6 rounded-lg p-4 text-sm font-medium shadow-sm ${message[1] === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{message[1] === "error" ? "⚠️" : "✅"}</span>
                  <span>{message[0]}</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-base">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                />
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-base">✨</span>
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Choose a unique username"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-base">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 shadow-sm"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {saving ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    💾 Save Changes
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
