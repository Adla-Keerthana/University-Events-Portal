import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserPlusIcon,
  UserMinusIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { manageCommittee, updateUserStatus } from '../../store/slices/authSlice';
import './CommitteeManagement.css';

const CommitteeManagement = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleManageCommittee = async () => {
    try {
      await dispatch(manageCommittee({
        userId: selectedUser._id,
        permissions,
        action
      })).unwrap();
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      setError('Failed to update committee member');
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await dispatch(updateUserStatus({
        userId,
        status
      })).unwrap();
      fetchUsers();
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  const availablePermissions = [
    'create_events',
    'edit_events',
    'delete_events',
    'manage_participants',
    'manage_venues',
    'manage_committee'
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user || !user.canManageCommittee()) {
    return (
      <div className="error-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to manage committee members.</p>
      </div>
    );
  }

  return (
    <div className="committee-management">
      <div className="header">
        <h1>Committee Management</h1>
        <p>Manage committee members and their permissions</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className="permissions-list">
                    {user.committeePermissions?.map(permission => (
                      <span key={permission} className="permission-tag">
                        {permission}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="actions">
                    {user.role === 'student' ? (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setAction('add');
                          setShowModal(true);
                        }}
                        className="action-button add"
                      >
                        <UserPlusIcon className="icon" />
                        Add to Committee
                      </button>
                    ) : user.role === 'committee_member' ? (
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setAction('remove');
                          setShowModal(true);
                        }}
                        className="action-button remove"
                      >
                        <UserMinusIcon className="icon" />
                        Remove from Committee
                      </button>
                    ) : null}
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusUpdate(user._id, 'suspended')}
                        className="action-button suspend"
                      >
                        <ShieldExclamationIcon className="icon" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusUpdate(user._id, 'active')}
                        className="action-button activate"
                      >
                        <ShieldCheckIcon className="icon" />
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              {action === 'add' ? 'Add to Committee' : 'Remove from Committee'}
            </h2>
            <p>Select permissions for {selectedUser?.name}</p>
            <div className="permissions-grid">
              {availablePermissions.map(permission => (
                <label key={permission} className="permission-checkbox">
                  <input
                    type="checkbox"
                    value={permission}
                    checked={permissions.includes(permission)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPermissions([...permissions, permission]);
                      } else {
                        setPermissions(permissions.filter(p => p !== permission));
                      }
                    }}
                  />
                  {permission.replace('_', ' ')}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button
                onClick={handleManageCommittee}
                className="confirm-button"
              >
                <CheckIcon className="icon" />
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                <XMarkIcon className="icon" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteeManagement; 