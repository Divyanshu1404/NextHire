import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Building } from 'lucide-react';
import { loginUser } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';

const EmployerLogin = () => {
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
          <Building size={32} className="text-primary" />
          <h1 className={styles.authTitle}>Employer Login</h1>
          <p className={styles.authSubtitle}>Access your company dashboard</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label="Work Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hr@company.com"
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
            {loading ? 'Logging in...' : 'Employer Login'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Is your company new here? <Link to="/employer/register" className={styles.authLink}>Register Company</Link>
          </p>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <p>
            Looking for a job? <Link to="/login" className={styles.authLink}>Candidate Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;
