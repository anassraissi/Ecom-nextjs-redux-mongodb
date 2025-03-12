'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/getUsers');
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDeleted = (deletedUserId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deletedUserId));
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/deleteUser/${userId}`);
      console.log('User deleted successfully');
      handleUserDeleted(userId);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User List</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user._id}
            className="bg-white rounded-xl shadow-lg p-6 w-full flex justify-between items-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-6">
              {user.image && (
                <img
                  src={user.image}
                  alt={`${user.name}'s profile`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href={`mailto:${user.email}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {user.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  <span>Role: {user.role}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => console.log('Edit clicked for', user._id)}
              >
                <FaEdit className="w-6 h-6" />
              </button>
              <button
                className="text-red-600 hover:text-red-800 transition-colors"
                onClick={() => handleDelete(user._id)}
              >
                <FaTrash className="w-6 h-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;