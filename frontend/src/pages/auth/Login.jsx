import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin } from '../../store/thunks/authThunks';
import { clearError, setError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';

const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    dispatch(loginUser(formData));
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
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Login to your account to find jobs</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
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
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
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
            Don't have an account? <Link to="/register" className={styles.authLink}>Sign up</Link>
          </p>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <p>
            Are you an employer? <Link to="/employer/login" className={styles.authLink}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
