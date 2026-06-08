import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Briefcase, FileText, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { fetchCompanyStats, fetchCompanyDetails } from '../../store/thunks/companyThunks';
import Loader from '../../components/ui/Loader';
import { formatDistanceToNow } from 'date-fns';
import styles from './RecruiterDashboard.module.css';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { companyStats, selectedCompany: company, loading } = useSelector(state => state.company);
  const stats = companyStats?.stats;

  useEffect(() => {
    dispatch(fetchCompanyStats());
    
    const compId = user?.companyId?._id || user?.companyId;
    if (compId) {
      dispatch(fetchCompanyDetails(compId));
    }
  }, [dispatch, user]);

  if (loading) return <Loader />;

  const statCards = [
    { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase },
    { title: 'Total Candidates', value: stats?.totalCandidates || 0, icon: Users },
    { 
      title: 'New Applications', 
      value: stats?.newApplications || 0, 
      icon: FileText, 
      trend: { value: '+12%', label: 'this week', isPositive: true } 
    },
    { title: 'Shortlisted', value: stats?.shortlisted || 0, icon: Activity },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {company?.logoUrl && (
          <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
            <img src={company.logoUrl} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div>
          <h1 className={styles.title}>
            {company?.companyName || 'Recruiter'} Dashboard
          </h1>
          <p className={styles.subtitle}>
            Welcome back, <span className={styles.userName}>{user?.name}</span>. Here is an overview of your recruitment pipeline.
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className={styles.activityCard}>
        <div className={styles.activityHeader}>
          <h2 className={styles.activityTitle}>Recent Activity</h2>
          <button className={styles.viewAll}>View All</button>
        </div>

        <div className={styles.activityList}>
          {stats?.recentActivity?.length > 0 ? (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.iconCircle}>
                  <Clock size={20} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityMain}>
                    <p className={styles.activityText}>
                      <span className={styles.bold}>{activity.user}</span> applied for <span className={styles.bold}>{activity.job}</span>
                    </p>
                    <span className={styles.time}>
                      <Clock size={12} />
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                    </span>
                  </div>
                  <div>
                    <span className={`${styles.badge} ${
                      activity.status === 'applied' ? styles.applied :
                      activity.status === 'shortlisted' ? styles.shortlisted :
                      activity.status === 'rejected' ? styles.rejected :
                      ''
                    }`}>
                      {activity.status === 'applied' && <AlertCircle size={12} />}
                      {activity.status === 'shortlisted' && <CheckCircle size={12} />}
                      {activity.status === 'rejected' && <XCircle size={12} />}
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Activity size={48} className={styles.emptyIcon} />
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No recent activity to show.</p>
              <p style={{ fontSize: '0.875rem' }}>New applications will appear here once they arrive.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
