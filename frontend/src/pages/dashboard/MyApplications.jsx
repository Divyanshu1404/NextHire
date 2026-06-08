import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, Search } from 'lucide-react';
import { fetchMyApplications } from '../../store/thunks/applicationThunks';
import ApplicationCard from '../../features/applications/components/ApplicationCard';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { myApplications: applications, loading } = useSelector(state => state.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const filteredApplications = applications.filter(app => {
    const jobTitle = app.jobId?.title?.toLowerCase() || '';
    const companyName = app.jobId?.companyId?.companyName?.toLowerCase() || '';
    const matchesSearch = jobTitle.includes(searchTerm.toLowerCase()) || 
                          companyName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>My Applications</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track and manage all your job applications in one place.</p>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '1.25rem', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--border)',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by job title or company..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.625rem 1rem 0.625rem 2.5rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ 
            padding: '0.625rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)',
            outline: 'none',
            fontSize: '0.9rem',
            minWidth: '150px'
          }}
        >
          <option value="all">All Status</option>
          <option value="applied">Applied</option>
          <option value="under_review">In Review</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '5rem 2rem', 
          background: 'var(--surface)', 
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)'
        }}>
          <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No applications found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {searchTerm || statusFilter !== 'all' 
              ? "We couldn't find any applications matching your filters." 
              : "You haven't applied to any jobs yet."}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button variant="primary" onClick={() => window.location.href = '/jobs'}>Find Jobs</Button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredApplications.map(app => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
