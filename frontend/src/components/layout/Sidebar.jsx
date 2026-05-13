import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building,
  Settings,
  User
} from 'lucide-react';
import { ROLES } from '../../constants/roles';
import { companyAPI } from '../../services/api';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { role, user } = useSelector((state) => state.auth);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const compId = user?.companyId?._id || user?.companyId;
        if (compId && [ROLES.COMPANY_ADMIN, ROLES.RECRUITER, ROLES.HR].includes(role)) {
          const res = await companyAPI.getCompanyDetails(compId);
          const compData = res.data.data.company || res.data.data;
          setCompany(compData);
        }
      } catch (err) {
        console.error('Error fetching company:', err);
      }
    };
    fetchCompany();
  }, [user, role]);

  const getMenuItems = () => {
    const items = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: Object.values(ROLES) },
      { path: '/dashboard/profile', label: 'My Profile', icon: User, roles: [ROLES.USER] },
      { path: '/dashboard/applications', label: 'My Applications', icon: FileText, roles: [ROLES.USER] },
      { path: '/dashboard/jobs', label: 'Manage Jobs', icon: Briefcase, roles: [ROLES.RECRUITER, ROLES.HR, ROLES.MANAGER, ROLES.COMPANY_ADMIN] },
      { path: '/dashboard/candidates', label: 'Candidates', icon: Users, roles: [ROLES.RECRUITER, ROLES.HR, ROLES.MANAGER] },
      { path: '/dashboard/kyc', label: 'Company KYC', icon: Building, roles: [ROLES.COMPANY_ADMIN] },
      { path: '/dashboard/organization', label: 'Organization', icon: Building, roles: [ROLES.COMPANY_ADMIN] },
      { path: '/dashboard/settings', label: 'Profile', icon: User, roles: Object.values(ROLES) },
    ];

    return items.filter(item => item.roles.includes(role));
  };

  const menuItems = getMenuItems();

  return (
    <aside className={styles.sidebar}>
      {company && (
        <div className={styles.companySection}>
          <div className={styles.companyLogo}>
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.companyName} />
            ) : (
              <span>{company.companyName?.charAt(0) || 'C'}</span>
            )}
          </div>
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>{company.companyName}</h3>
          </div>
        </div>
      )}
      <div className={styles.menuList}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `${styles.menuItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Company links shown as top-level items */}
      </div>
    </aside>
  );
};

export default Sidebar;
