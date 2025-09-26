import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { createProfile, clearError } from '../../../slices/profileSlice';
// If using React Router, uncomment this:
import { useNavigate } from 'react-router-dom';

const CreateProfile = () => {
  const dispatch = useDispatch();
  // Only use navigate if React Router is properly set up
  const navigate = useNavigate();
  
  // Get profile state from Redux
  const { loading, error, profile } = useSelector((state) => state.profile);
const [formData, setFormData] = useState({
  // Profile basics
  status: "",
  company: "",
  website: "",
  location: "",
  skills: "",
  githubUsername: "",
  bio: "",
  twitter: "",
  facebook: "",
  youtube: "",
  linkedin: "",   // ✅ fixed casing
  instagram: "",

  // --- Experience fields ---
  expTitle: "",
  expCompany: "",
  expLocation: "",
  expFrom: "",
  expTo: "",
  expCurrent: false,   // ✅ boolean matches schema
  expDescription: "",

  // --- Education fields ---
  eduSchool: "",
  eduDegree: "",
  eduFieldOfStudy: "",
  eduFrom: "",
  eduTo: "",
  eduCurrent: false,   // ✅ boolean matches schema
  eduDescription: "",
});


  const [showSocialInputs, setShowSocialInputs] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear Redux errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      console.log('Profile Error:', error); // Debug logging
      if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const newErrors = {};
        error.errors.forEach(err => {
          if (err.param) {
            newErrors[err.param] = err.msg;
          }
        });
        setValidationErrors(newErrors);
      } else {
        // Handle general errors
        setValidationErrors({ general: error.message || 'An error occurred creating the profile' });
      }
    } else {
      setValidationErrors({});
    }
  }, [error]);

  // Handle successful profile creation
  useEffect(() => {
    console.log('Profile state changed:', { profile, loading, error }); // Debug logging
    if (profile && !loading && !error) {
      alert('Profile created successfully!');
      // Use React Router navigation
      navigate('/dashboard');
    }
  }, [profile, loading, error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear validation error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.status) {
      errors.status = 'Professional status is required';
    }
    
    if (!formData.skills.trim()) {
      errors.skills = 'Skills are required';
    }

    // Basic URL validation for social media fields
    const urlFields = ['website', 'twitter', 'facebook', 'youtube', 'linkedIn', 'instagram'];
    urlFields.forEach(field => {
      if (formData[field] && !isValidUrl(formData[field])) {
        errors[field] = 'Please enter a valid URL';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});
    dispatch(clearError());

    // Client-side validation
    if (validateForm()) {
      const profileData = {
        status: formData.status,
        company: formData.company,
        website: formData.website,
        location: formData.location,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
        githubUsername: formData.githubUsername,
        bio: formData.bio,
        experience: [
            {
            title: formData.expTitle,
            company: formData.expCompany,
            location: formData.expLocation,
            from: formData.expFrom ? new Date(formData.expFrom) : null,
            to: formData.expTo ? new Date(formData.expTo) : null,
            current: formData.expCurrent,
            description: formData.expDescription,
            },
        ],
        education: [
            {
            school: formData.eduSchool,
            degree: formData.eduDegree,
            fieldOfStudy: formData.eduFieldOfStudy,
            from: formData.eduFrom ? new Date(formData.eduFrom) : null,
            to: formData.eduTo ? new Date(formData.eduTo) : null,
            current: formData.eduCurrent,
            description: formData.eduDescription,
            },
        ],  
        // Structure social media according to schema (as array with single object)

        social: [{
          twitter: formData.twitter,
          facebook: formData.facebook,
          youtube: formData.youtube,
          linkedIn: formData.linkedIn,
          instagram: formData.instagram,
        }]
      };

      // Dispatch Redux action to create profile
      dispatch(createProfile(profileData));
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Create Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>

      {/* Display general errors */}
      {validationErrors.general && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          {validationErrors.general}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        {/* Professional Status */}
        <div className="form-group">
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            className={validationErrors.status ? 'error' : ''}
          >
            <option value="">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
          {validationErrors.status && (
            <small className="form-text text-danger">{validationErrors.status}</small>
          )}
        </div>

        {/* Company */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={validationErrors.company ? 'error' : ''}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
          {validationErrors.company && (
            <small className="form-text text-danger">{validationErrors.company}</small>
          )}
        </div>

        {/* Website */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className={validationErrors.website ? 'error' : ''}
          />
          <small className="form-text">Could be your own or a company website</small>
          {validationErrors.website && (
            <small className="form-text text-danger">{validationErrors.website}</small>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={validationErrors.location ? 'error' : ''}
          />
          <small className="form-text">City & state suggested (eg. Boston, MA)</small>
          {validationErrors.location && (
            <small className="form-text text-danger">{validationErrors.location}</small>
          )}
        </div>

        {/* Skills */}
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={validationErrors.skills ? 'error' : ''}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
          {validationErrors.skills && (
            <small className="form-text text-danger">{validationErrors.skills}</small>
          )}
        </div>

        {/* Github Username */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubUsername"
            value={formData.githubUsername}
            onChange={handleChange}
            className={validationErrors.githubUsername ? 'error' : ''}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your username
          </small>
          {validationErrors.githubUsername && (
            <small className="form-text text-danger">{validationErrors.githubUsername}</small>
          )}
        </div>

        {/* Bio */}
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={validationErrors.bio ? 'error' : ''}
          />
          <small className="form-text">Tell us a little about yourself</small>
          {validationErrors.bio && (
            <small className="form-text text-danger">{validationErrors.bio}</small>
          )}
        </div>

        {/* Experience*/}
        <h2 className="text-primary">Experience</h2>

        <div className="form-group">
        <input
            type="text"
            placeholder="* Job Title"
            name="expTitle"
            value={formData.expTitle}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <input
            type="text"
            placeholder="* Company"
            name="expCompany"
            value={formData.expCompany}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <input
            type="text"
            placeholder="Location"
            name="expLocation"
            value={formData.expLocation}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <h4>From Date</h4>
        <input
            type="date"
            name="expFrom"
            value={formData.expFrom}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <h4>To Date</h4>
        <input
            type="date"
            name="expTo"
            value={formData.expTo}
            onChange={handleChange}
            disabled={formData.expCurrent}  // disable if current job
        />
        </div>

        <div className="form-group">
        <p>
            <input
            type="checkbox"
            name="expCurrent"
            checked={formData.expCurrent}
            onChange={(e) =>
                setFormData({ ...formData, expCurrent: e.target.checked })
            }
            />{" "}
            Current Job
        </p>
        </div>

        <div className="form-group">
        <textarea
            placeholder="Job Description"
            name="expDescription"
            value={formData.expDescription}
            onChange={handleChange}
        />
        </div>
            {/*Education */}
            <h2 className="text-primary">Education</h2>

        <div className="form-group">
        <input
            type="text"
            placeholder="* School"
            name="eduSchool"
            value={formData.eduSchool}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <input
            type="text"
            placeholder="* Degree"
            name="eduDegree"
            value={formData.eduDegree}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <input
            type="text"
            placeholder="* Field of Study"
            name="eduFieldOfStudy"
            value={formData.eduFieldOfStudy}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <h4>From Date</h4>
        <input
            type="date"
            name="eduFrom"
            value={formData.eduFrom}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
        <h4>To Date</h4>
        <input
            type="date"
            name="eduTo"
            value={formData.eduTo}
            onChange={handleChange}
            disabled={formData.eduCurrent}
        />
        </div>

        <div className="form-group">
        <p>
            <input
            type="checkbox"
            name="eduCurrent"
            checked={formData.eduCurrent}
            onChange={(e) =>
                setFormData({ ...formData, eduCurrent: e.target.checked })
            }
            />{" "}
            Current Study
        </p>
        </div>

        <div className="form-group">
        <textarea
            placeholder="Program Description"
            name="eduDescription"
            value={formData.eduDescription}
            onChange={handleChange}
        />
        </div>

        {/* Social Links Toggle */}
        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => setShowSocialInputs(!showSocialInputs)}
          >
            {showSocialInputs ? "Hide Social Network Links" : "Add Social Network Links"}
          </button>
          <span>Optional</span>
        </div>

        {showSocialInputs && (
          <>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className={validationErrors.twitter ? 'error' : ''}
              />
              {validationErrors.twitter && (
                <small className="form-text text-danger">{validationErrors.twitter}</small>
              )}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className={validationErrors.facebook ? 'error' : ''}
              />
              {validationErrors.facebook && (
                <small className="form-text text-danger">{validationErrors.facebook}</small>
              )}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                className={validationErrors.youtube ? 'error' : ''}
              />
              {validationErrors.youtube && (
                <small className="form-text text-danger">{validationErrors.youtube}</small>
              )}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="LinkedIn URL"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className={validationErrors.linkedIn ? 'error' : ''}
              />
              {validationErrors.linkedIn && (
                <small className="form-text text-danger">{validationErrors.linkedIn}</small>
              )}
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className={validationErrors.instagram ? 'error' : ''}
              />
              {validationErrors.instagram && (
                <small className="form-text text-danger">{validationErrors.instagram}</small>
              )}
            </div>
          </>
        )}

        {/* Buttons */}
        <input 
          type="submit" 
          className="btn btn-primary my-1" 
          value={loading ? "Creating Profile..." : "Create Profile"}
          disabled={loading}
        />
        <a className="btn btn-light my-1" href="dashboard.html">
          Go Back
        </a>
      </form>
    </section>
  );
};

export default CreateProfile;