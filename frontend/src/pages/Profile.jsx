import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Admin from '../component/Admin';
import UserProfile from '../component/userprofile';
import { API_BASE } from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  // Use user.role to determine admin

  React.useEffect(() => {
    console.log('[Profile] isHydrating:', isHydrating, 'isAuthenticated:', isAuthenticated, 'user:', user);
    if (!isHydrating && !isAuthenticated) {
      console.log('[Profile] Redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, isHydrating, navigate, user]);



  // Debug: log user object to inspect structure
  console.log('Profile user object:', user);
  // While auth hydration runs, show skeletons (no loading text)
  if (isHydrating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start pt-24 px-6 md:px-10">
        <div className="w-full max-w-6xl animate-pulse">
          <div className="h-24 bg-gray-200 rounded-2xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          </div>
          {/* Delete Account Button */}
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                try {
                  // Call backend delete user endpoint (to be implemented)
                  const res = await fetch(`${API_BASE}/api/v1/users/me`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  if (res.ok) {
                    window.location.href = '/login';
                  } else {
                    alert('Failed to delete account.');
                  }
                } catch (err) {
                  alert('Error deleting account.');
                }
              }
            }}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex justify-center items-start px-4 pt-4">
      <div className="w-full max-w-md md:max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Blue Header Background */}
        <div className="h-24 bg-linear-to-r from-[#4169e1] to-[#667eea] w-full"></div>

        {/* Profile Content */}
        <div className="px-6 md:px-8 pb-8 -mt-12 flex flex-col items-center">
          {/* User Photo with Emoji */}
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-linear-to-br from-purple-200 to-blue-200 flex items-center justify-center text-5xl">
            👤
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.username || user.name || 'User'}</h2>

          {/* Input Fields */}
          <div className="w-full space-y-4 mt-6">
            <div className="flex items-center gap-2 md:gap-4">
              <label className="w-20 md:w-24 text-sm text-gray-500 font-medium">Username</label>
              <input
                type="text"
                value={user.username || user.name || ''}
                readOnly
                className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-[#4169e1] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <label className="w-20 md:w-24 text-sm text-gray-500 font-medium">Email</label>
              <input
                type="email"
                value={user.email || ''}
                readOnly
                className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-[#4169e1] transition-colors"
              />
            </div>
          </div>

          <hr className="w-full my-6 border-gray-100" />

          {user?.role === 'admin' ? <Admin user={user} /> : <UserProfile user={user} />}

          <hr className="w-full my-6 border-gray-100" />
          {/* Delete Account Button */}
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                try {
                  const res = await fetch(`${API_BASE}/api/v1/users/me`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                  if (res.ok) {
                    window.location.href = '/login';
                  } else {
                    alert('Failed to delete account.');
                  }
                } catch (err) {
                  alert('Error deleting account.');
                }
              }
            }}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-sm"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;