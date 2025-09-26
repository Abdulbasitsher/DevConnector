// src/components/dashboard/Dashboard.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showAlert } from '../../slices/alertSlice';
import { getCurrentProfile } from '../../slices/profileSlice';
import { Link } from 'react-router-dom'


const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, loading } = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(showAlert(`Welcome to your dashboard, ${user.name}!`, 'success'));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="spinner-container">
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user?.name}
      </p>

      {profile ? (
        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-6">
              <h3>Your Profile</h3>
              <p><strong>Status:</strong> {profile.status}</p>
              <p><strong>Company:</strong> {profile.company || 'Not specified'}</p>
              <p><strong>Location:</strong> {profile.location || 'Not specified'}</p>
              <p><strong>Skills:</strong> {profile.skills?.join(', ') || 'No skills listed'}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {new Date(user?.date).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <h3>Quick Actions</h3>
              <button className="btn btn-primary">Edit Profile</button>
              <button className="btn btn-secondary">View Posts</button>
              <button className="btn btn-light">Add Experience</button>
              <button className="btn btn-light">Add Education</button>
            </div>
          </div>

          {profile.experience && profile.experience.length > 0 && (
            <div className="experience">
              <h3>Experience</h3>
              {profile.experience.map(exp => (
                <div key={exp._id} className="experience-item">
                  <h4>{exp.title} at {exp.company}</h4>
                  <p>{new Date(exp.from).toLocaleDateString()} - {exp.to ? new Date(exp.to).toLocaleDateString() : 'Current'}</p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {profile.education && profile.education.length > 0 && (
            <div className="education">
              <h3>Education</h3>
              {profile.education.map(edu => (
                <div key={edu._id} className="education-item">
                  <h4>{edu.degree} in {edu.fieldofstudy}</h4>
                  <p>{edu.school}</p>
                  <p>{new Date(edu.from).toLocaleDateString()} - {edu.to ? new Date(edu.to).toLocaleDateString() : 'Current'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="no-profile">
          <p>You have not yet created a profile, please add some info</p>
          <Link to="/layout/profile-forms/create-profile" className="btn btn-primary">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;