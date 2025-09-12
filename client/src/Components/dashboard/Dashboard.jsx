
// src/components/dashboard/Dashboard.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '../../slices/alertSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // You can load user profile or dashboard data here
    dispatch(showAlert(`Welcome to your dashboard, ${user?.name || 'User'}!`, 'success'));
  }, [dispatch, user]);

  return (
    <div>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user?.name}
      </p>
      
      <div className="dashboard-content">
        <div className="row">
          <div className="col-md-6">
            <h3>Your Profile</h3>
            <p>Email: {user?.email}</p>
            <p>Member since: {new Date(user?.date).toLocaleDateString()}</p>
          </div>
          <div className="col-md-6">
            <h3>Quick Actions</h3>
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-secondary">View Posts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
