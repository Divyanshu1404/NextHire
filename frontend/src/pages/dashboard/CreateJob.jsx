import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import JobPostForm from '../../features/jobs/components/JobPostForm';
import Button from '../../components/ui/Button';

const CreateJob = () => {
  const navigate = useNavigate();

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
          <Briefcase size={28} color="var(--primary)" /> Post a New Job
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Create a new job listing to attract top talent. It will be immediately visible to candidates.
        </p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <JobPostForm onSuccess={() => {
          alert('Job posted successfully!');
          navigate('/dashboard/jobs');
        }} />
      </div>
    </div>
  );
};

export default CreateJob;
