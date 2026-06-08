import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Building } from 'lucide-react';
import { registerUser } from '../../store/thunks/authThunks';
import { clearError } from '../../store/slices/authSlice';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';

const EmployerSignup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'company_admin') {
        navigate('/dashboard/kyc');
      } else {
        navigate('/dashboard');
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    const { name, email, password } = formData;
    dispatch(registerUser({ name, email, password, role: 'company_admin' }));
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <Building size={32} className="text-primary" />
          <h1 className={styles.authTitle}>Register Company</h1>
          <p className={styles.authSubtitle}>Create an employer account to post jobs</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <div className={styles.errorAlert}>Passwords do not match</div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label="Admin Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
          <Input
            label="Work Email Address"
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
            {loading ? 'Creating Account...' : 'Register Company'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already registered? <Link to="/employer/login" className={styles.authLink}>Employer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
