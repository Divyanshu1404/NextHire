import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, UserCheck, FileText, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import { companyAPI, jobsAPI } from '../../services/api';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({ activeJobs: 0, totalCandidates: 0, newApplications: 0, shortlisted: 0, recentActivity: [] });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        companyAPI.getCompanyStats(),
        jobsAPI.getCompanyJobs()
      ]);
      const apiStats = statsRes.data.data.stats || statsRes.data.data || {};
      setStats({
        activeJobs: apiStats.activeJobs || apiStats.totalJobs || 0,
        totalCandidates: apiStats.totalCandidates || apiStats.totalApplications || 0,
        newApplications: apiStats.newApplications || 0,
        shortlisted: apiStats.shortlisted || 0,
        recentActivity: apiStats.recentActivity || []
      });
      setRecentJobs(jobsRes.data.data.jobs?.slice(0, 5) || jobsRes.data.data?.slice(0, 5) || []);
    } catch (err) {
      console.error('Error fetching HR dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { title: 'Active Jobs', value: String(stats.activeJobs || 0), icon: Briefcase },
    { title: 'Total Applicants', value: String(stats.totalCandidates || 0), icon: Users },
    { title: 'Shortlisted', value: String(stats.shortlisted || 0), icon: UserCheck },
    { title: 'Pending Reviews', value: String(Math.max(0, (stats.totalCandidates || 0) - (stats.shortlisted || 0))), icon: FileText },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>HR Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}. Manage your company's recruitment pipeline.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {dashboardStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Job Postings</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/jobs')}>View All</Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentJobs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No jobs posted yet.</div>
            ) : recentJobs.map((job) => (
              <div key={job._id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.location} • {job.jobType}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/dashboard/jobs/${job._id}/applications`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}
                >
                  Manage <ChevronRight size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Need Help?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Contact your Company Admin for any permission changes.</p>
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/dashboard/settings')}>Account Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;