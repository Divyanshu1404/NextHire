import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Briefcase, ArrowLeft } from 'lucide-react';
import JobPostForm from '../../features/jobs/components/JobPostForm';
import Button from '../../components/ui/Button';
import { jobsAPI } from '../../services/api';
import { ROLES } from '../../constants/roles';
import Loader from '../../components/ui/Loader';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, role } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobsAPI.getJobById(id);
        const jobData = response.data.data.job || response.data.data;
        
        // Authorization check
        const isAuthorized = 
          role === ROLES.SUPER_ADMIN || 
          role === ROLES.COMPANY_ADMIN || 
          jobData.createdBy === user?._id || 
          jobData.createdBy === user?.id;

        if (!isAuthorized) {
          alert('You are not authorized to edit this job.');
          navigate('/dashboard/jobs');
          return;
        }
        
        setJob(jobData);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchJob();
    }
  }, [id, user, role, navigate]);

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/jobs')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back to Jobs
        </Button>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={28} color="var(--primary)" /> Edit Job Listing
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Update the details of your job listing to ensure candidates have the most accurate information.
        </p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {job && (
          <JobPostForm 
            initialData={job} 
            onSuccess={() => {
              alert('Job updated successfully!');
              navigate('/dashboard/jobs');
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default EditJob;
