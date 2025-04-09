'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaSearch, FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import Image from 'next/image';
import { makeToast } from '../../../../utils/helpers';
import UserEditModal from '@/components/adminPanel/UserEditModal ';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/getUsers');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      setError(err.message);
      makeToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        setIsDeleting(userId);
        await axios.delete(`/api/users/deleteUser/${userId}`);
        setUsers(prev => prev.filter(user => user._id !== userId));
        makeToast('User deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting user:', err);
        makeToast('Failed to delete user', 'error');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
    setEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl text-blue-600 mb-4" />
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded max-w-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 text-2xl mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error loading users</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-3 text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            {searchTerm ? 'No matching users found' : 'No users available'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try a different search term' : 'When users register, they will appear here'}
          </p>
          {!searchTerm && (
            <button
              onClick={fetchUsers}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Users
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={`${user.name}'s profile`}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        <a 
                          href={`mailto:${user.email}`} 
                          className="hover:text-blue-600 transition-colors"
                        >
                          {user.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserTag className="mr-2 text-gray-400" />
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setUserToEdit(user);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                          title="Edit"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1"
                          disabled={isDeleting === user._id}
                          title="Delete"
                        >
                          {isDeleting === user._id ? (
                            <FiLoader className="animate-spin h-4 w-4" />
                          ) : (
                            <FaTrash className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editModalOpen && (
        <UserEditModal
          user={userToEdit}
          onClose={() => setEditModalOpen(false)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default UserList;