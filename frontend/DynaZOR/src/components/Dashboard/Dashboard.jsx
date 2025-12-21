import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../../apis/userApi';
import Appointment from '../Appointment/Appointment';

export default function Dashboard({ userID }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const { getUser } = userApi();
  const navigate = useNavigate();

  const isOwner = useMemo(() => {
    const currentUserID = parseInt(localStorage.getItem("userID"));
    return currentUserID === parseInt(userID);
  }, [userID]);

  useEffect(() => {
    const loadUser = async () => {
      console.log(isOwner)
      try {
        setLoading(true);
        const user = await getUser(userID);
        setName(user.name);
      } catch (err) {
        console.error("Error fetching user", err);
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
  
    if (userID) loadUser();
  }, [userID, navigate]);

  if(!isOwner){
    setTimeout(() => {
      navigate("/home");
    }, 1000);
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: "📅", label: "Total Appointments", value: "12" },
    { icon: "📊", label: "Utilization Rate", value: "68%" },
    { icon: "⏰", label: "Peak Hour", value: "10:15 AM" },
    { icon: "📈", label: "This Month", value: "8" },
  ];

  const quickActions = [
    { title: "View My Schedule", description: "Manage your availability", color: "from-blue-500 to-cyan-500", icon: "📋" },
    { title: "Manage Profile", description: "Edit your profile", color: "from-purple-500 to-pink-500", icon: "👤" },
    { title: "View History", description: "Past appointments", color: "from-green-500 to-emerald-500", icon: "📜" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
            <h1 className="text-5xl font-extrabold mb-2">Welcome back, {name}! 👋</h1>
            <p className="text-indigo-100 text-lg">Manage your schedule and track your appointments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, idx) => {
              const handleQuickAction = () => {
                if (idx === 0) {
                  navigate("/schedule", { state: { userID } });
                } else if (idx === 1) {
                  navigate("/home");
                }
              };

              return (
                <button
                  key={idx}
                  onClick={handleQuickAction}
                  className={`bg-gradient-to-br ${action.color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 text-white cursor-pointer h-full block w-full text-left border-none`}
                >
                  <div className="text-5xl mb-4">{action.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm font-semibold">Explore</span>
                    <span>→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Make Appointment */}
        <div className="max-w-4xl mx-auto mb-12">
          <Appointment />
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">📊 Analytics</h2>
            <p className="text-indigo-100 mt-1">Coming soon - Track your scheduling insights</p>
          </div>
          
          <div className="p-12">
            <div className="flex flex-col items-center justify-center min-h-96">
              <div className="text-center">
                <div className="inline-block bg-indigo-100 rounded-full p-6 mb-6">
                  <svg className="w-16 h-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md">
                  Detailed insights about your scheduling patterns, appointment trends, and utilization metrics coming soon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-blue-600 font-semibold text-sm">📈 Booking Trends</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-purple-600 font-semibold text-sm">⏰ Peak Hours</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <p className="text-pink-600 font-semibold text-sm">👥 User Activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

      </div>
    </div>
  );
}