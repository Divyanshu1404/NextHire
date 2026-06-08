import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase } from 'lucide-react';
import { loginUser } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';

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
