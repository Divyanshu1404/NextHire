import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ApplicationCard from '../../features/applications/components/ApplicationCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { applicationAPI } from '../../services/api';

const UserDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await applicationAPI.getMyApplications();
        const apps = response.data?.data?.applications || response.data?.data || [];
        setApplications(Array.isArray(apps) ? apps : []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { 
      title: 'Total Applications', 
      value: String(applications.length), 
      icon: Briefcase 
    },
    { 
      title: 'In Review', 
      value: String(applications.filter(app => app.status === 'under_review' || app.status === 'applied').length), 
      icon: Clock 
    },
    { 
      title: 'Shortlisted', 
      value: String(applications.filter(app => app.status === 'shortlisted').length), 
      icon: FileText 
    },
    { 
      title: 'Selected', 
      value: String(applications.filter(app => app.status === 'selected').length), 
      icon: CheckCircle 
    },
  ];

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  if (loading) return <Loader fullScreen />;

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Here is what's happening with your job applications today.</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3rem' 
      }}>
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--danger)', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '2rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center'
        }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Recent Applications</h2>
          <Link to="/dashboard/applications" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600 }}>
            View All Applications
          </Link>
        </div>
        
        {applications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            background: 'white', 
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)'
          }}>
            <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No applications yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't applied to any jobs yet. Start exploring!</p>
            <Link to="/jobs">
              <Button variant="primary">Explore Jobs</Button>
            </Link>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {recentApplications.map(app => (
              <ApplicationCard key={app._id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
