import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { registerUser, googleLogin } from '../../store/thunks/authThunks';
import { clearError, setError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';

const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      // We could use a local error state here if we don't want to pollute global error
      // but for consistency with existing logic:
      return; 
    }
    
    const { name, email, password } = formData;
    dispatch(registerUser({ name, email, password, role: 'user' }));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      dispatch(setError('Google login failed'));
      return;
    }

    try {
      await dispatch(googleLogin({ idToken })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      dispatch(setError(err || 'Google login failed'));
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Briefcase size={32} className="text-primary" />
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>Join us and find your dream job</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <div className={styles.errorAlert}>Passwords do not match</div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || (formData.password !== formData.confirmPassword && formData.confirmPassword)}
            className="mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          {hasGoogleClientId && (
            <div className="mt-3 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => dispatch(setError('Google login failed'))}
                theme="outline"
                shape="rectangular"
                text="continue_with"
              />
            </div>
          )}
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account? <Link to="/login" className={styles.authLink}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
