import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice.js';
import { showAlert } from '../../slices/alertSlice.js';

function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(showAlert('Logged out successfully', 'success'));
  };

  // Links for authenticated users
  const authLinks = (
    <ul>
      <li><Link to="/developers">Developers</Link></li>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li>
        <a onClick={onLogout} href="#!" style={{ cursor: 'pointer' }}>
          <i className="fas fa-sign-out-alt"></i>{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
      {user && (
        <li style={{ color: '#17a2b8', marginLeft: '10px' }}>
          Welcome, {user.name}
        </li>
      )}
    </ul>
  );

  // Links for guests (non-authenticated users)
  const guestLinks = (
    <ul>
      <li><Link to="/developers">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      {isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
}

export default Navbar;