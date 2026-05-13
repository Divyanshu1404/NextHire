import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Briefcase, Menu, X, User as UserIcon } from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { companyAPI } from '../../services/api';
import Button from '../ui/Button';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [company, setCompany] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const compId = user?.companyId?._id || user?.companyId;
        if (compId && isAuthenticated) {
          const res = await companyAPI.getCompanyDetails(compId);
          const compData = res.data.data.company || res.data.data;
          setCompany(compData);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    };
    fetchCompany();
  }, [user, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          <svg width="160" height="40" viewBox="0 0 320 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="30" fill="url(#grad1)" />
            <text x="50" y="58" fontSize="28" fontFamily="Arial" fill="white" textAnchor="middle" fontWeight="bold">N</text>
            <text x="100" y="60" fontSize="36" fontFamily="Poppins, Arial, sans-serif" fill="#111827" fontWeight="600">
              NextHire
            </text>
          </svg>
        </Link>

        <div className={styles.desktopMenu}>
          <Link to="/jobs" className={styles.navLink}>JOBS</Link>
          <Link to="/companies" className={styles.navLink}>COMPANIES</Link>
          
          {isAuthenticated ? (
            <div className={styles.authMenu}>
              {company?.logoUrl && (
                <div className={styles.companyLogo}>
                  <img src={company.logoUrl} alt={company.companyName} title={company.companyName} />
                </div>
              )}
              <Link to="/dashboard" className={styles.dashboardBtn}>
                <UserIcon size={18} />
                Dashboard
              </Link>
              <div className={styles.userDropdown}>
                <div className={styles.userTrigger}>
                  <div className={styles.userAvatar}>
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className={styles.avatarImg} />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <span className={styles.userName}>{user?.name || 'User'}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                <div className={styles.dropdownMenu}>
                  <Link to="/dashboard/settings" className={styles.dropdownItem} >
                    <UserIcon size={16} />
                    Profile
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.authMenu}>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
              <Link to="/employer/login" className={styles.employerLink}>
                EMPLOYERS
              </Link>
            </div>
          )}
        </div>

        <button className={styles.mobileMenuBtn} onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/jobs" className={styles.mobileLink} onClick={toggleMenu}>Jobs</Link>
          <Link to="/companies" className={styles.mobileLink} onClick={toggleMenu}>Companies</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={styles.mobileLink} onClick={toggleMenu}>Dashboard</Link>
              <button className={styles.mobileLink} onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={toggleMenu}>Login</Link>
              <Link to="/register" className={styles.mobileLink} onClick={toggleMenu}>Sign Up</Link>
              <Link to="/employer/login" className={styles.mobileLink} onClick={toggleMenu}>Employers</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
