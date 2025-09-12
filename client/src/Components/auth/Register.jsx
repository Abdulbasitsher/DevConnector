// src/components/auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from "../../slices/alertSlice";
import { registerUser, clearError } from "../../slices/authSlice";
import { Navigate } from 'react-router-dom';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  // DEBUG: Add this to see what's happening
  console.log('Register component state:', { 
    loading, 
    isAuthenticated, 
    isSubmitting,
    error 
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  // Handle errors
  useEffect(() => {
    if (error) {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach((err) => 
          dispatch(showAlert(err.msg || err.message, 'danger'))
        );
      } else if (error.message) {
        dispatch(showAlert(error.message, 'danger'));
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

 // Redirect after successful registration
useEffect(() => {
  if (isAuthenticated) {
    dispatch(showAlert('Registration successful! Welcome!', 'success'));
    // Small delay to show the success message
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  }
}, [isAuthenticated, navigate, dispatch]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!name.trim()) {
      dispatch(showAlert('Name is required', 'danger'));
      return;
    }
    
    if (!isValidEmail(email)) {
      dispatch(showAlert('Please enter a valid email address', 'danger'));
      return;
    }
    
    if (password.length < 6) {
      dispatch(showAlert('Password must be at least 6 characters', 'danger'));
      return;
    }
    
    if (password !== password2) {
      dispatch(showAlert('Passwords do not match', 'danger'));
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(registerUser({ 
        name: name.trim(), 
        email: email.toLowerCase(), 
        password 
      })).unwrap();
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  // TEMPORARY FIX: Just use isSubmitting for now
  const isFormDisabled = isSubmitting; // Remove loading dependency

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      
      {/* DEBUG INFO - Remove this later */}
      <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
        <strong>Debug:</strong> loading: {loading.toString()}, isSubmitting: {isSubmitting.toString()}, 
        isAuthenticated: {isAuthenticated?.toString() || 'null'}
      </div>
      
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
            disabled={isFormDisabled}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
            disabled={isFormDisabled}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
            disabled={isFormDisabled}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            minLength="6"
            required
            disabled={isFormDisabled}
          />
        </div>
        <input 
          type="submit" 
          className="btn btn-primary" 
          value={isSubmitting ? "Creating Account..." : "Register"}
          disabled={isFormDisabled}
        />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  );
}

export default Register;