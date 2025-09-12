import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from "../../slices/alertSlice";
import { loginUser, clearError } from "../../slices/authSlice";
import { Navigate } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

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
// Redirect after successful login
useEffect(() => {
  if (isAuthenticated) {
    dispatch(showAlert('Login successful! Welcome back!', 'success'));
    // Small delay to show the success message
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  }
}, [isAuthenticated, navigate, dispatch]);

  // Handle input change
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Basic email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Client-side validation
    if (!isValidEmail(email)) {
      dispatch(showAlert('Please enter a valid email address', 'danger'));
      return;
    }
    
    if (password.length < 6) {
      dispatch(showAlert('Password must be at least 6 characters', 'danger'));
      return;
    }

    // Set loading state and dispatch login action
    setIsSubmitting(true);
    try {
      await dispatch(loginUser({ 
        email: email.toLowerCase(), 
        password 
      })).unwrap();
      // Success is handled by the useEffect above
    } catch (err) {
      // Error is handled by the useEffect above
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent access if already authenticated
  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  // Use isSubmitting for form state (avoiding loading issue from auth slice)
  const isFormDisabled = isSubmitting;

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Login to Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
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
        <input 
          type="submit" 
          className="btn btn-primary" 
          value={isSubmitting ? "Logging in..." : "Login"}
          disabled={isFormDisabled}
        />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
}

export default Login;