import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Briefcase, Plus, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { fetchCompanyJobs, deleteJob } from '../../store/thunks/jobThunks';
import { ROLES } from '../../constants/roles';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const ManageJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role, user } = useSelector(state => state.auth);
  const { companyJobs: jobs, loading } = useSelector(state => state.jobs);

  useEffect(() => {
    dispatch(fetchCompanyJobs());
  }, [dispatch]);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await dispatch(deleteJob(jobId)).unwrap();
      } catch (err) {
        alert(err || 'Failed to delete job.');
      }
    }
  };

  const isManagementRole = [ROLES.RECRUITER, ROLES.HR, ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN].includes(role);

  const canManageJob = (job) => {
    if (role === ROLES.SUPER_ADMIN || role === ROLES.COMPANY_ADMIN) return true;
    return job.createdBy === user?._id || job.createdBy === user?.id;
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Briefcase size={28} color="var(--primary)" /> Manage Jobs
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            View and manage all job postings for your company.
          </p>
        </div>
        {isManagementRole && (
          <Button variant="primary" onClick={() => navigate('/dashboard/jobs/new')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Post New Job
          </Button>
        )}
      </div>

      {jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No jobs posted</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{isManagementRole ? "You haven't posted any jobs yet. Get started by creating your first listing." : "Your team hasn't posted any jobs yet."}</p>
          {isManagementRole && <Button variant="outline" onClick={() => navigate('/dashboard/jobs/new')}>Create Job Post</Button>}
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Job Title</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Location</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={16} /> {job.location}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{job.jobType}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <Badge variant={job.status === 'open' ? 'success' : 'default'}>{job.status || 'Open'}</Badge>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/jobs/${job._id}/applications`)}
                        style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Users size={16} /> Applications
                      </Button>
                      {isManagementRole && canManageJob(job) && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/dashboard/jobs/edit/${job._id}`)}
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(job._id)}
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
