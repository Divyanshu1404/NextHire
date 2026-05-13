import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Briefcase, DollarSign, Clock, Building, ChevronLeft, Calendar, Tag } from 'lucide-react';
import { jobsAPI, applicationAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import ApplyModal from '../applications/components/ApplyModal';
import styles from '../../components/jobs/Jobs.module.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await jobsAPI.getJobById(id);
        const jobData = response.data.data.job || response.data.data;
        setJob(jobData);

        if (isAuthenticated && user?.role === 'user') {
          const appRes = await applicationAPI.getMyApplications();
          const myApps = appRes.data.data.applications || appRes.data.data || [];
          const alreadyApplied = myApps.some(app => 
            (app.jobId?._id || app.jobId) === id
          );
          setHasApplied(alreadyApplied);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details', error);
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id, isAuthenticated]);

  const handleApplyClick = () => {
    console.log('Apply button clicked!');
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }
    console.log('Opening Apply Modal');
    setIsApplyModalOpen(true);
  };

  if (loading) return <Loader fullScreen />;
  if (!job) return (
    <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
      <h2>Job not found</h2>
      <Link to="/jobs"><Button variant="ghost" className="mt-4">Back to Jobs</Button></Link>
    </div>
  );

  const companyName = job.companyId?.companyName || 'NextHire Partner';
  const companyLogoUrl = job.companyId?.logoUrl || '';

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 500 }}>
        <ChevronLeft size={20} />
        Back to Jobs
      </button>

      <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ padding: '2.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--background)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              {companyLogoUrl ? (
                <img src={companyLogoUrl} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Building size={40} />
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{job.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{companyName}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {job.location}</span>
              </div>
            </div>
          </div>
          
          <div>
            {(!isAuthenticated || user?.role === 'user') ? (
              <Button 
                variant={hasApplied ? "secondary" : "primary"} 
                size="lg"
                onClick={handleApplyClick}
                disabled={hasApplied}
                style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem' }}
              >
                {hasApplied ? 'Applied' : 'Apply for this position'}
              </Button>
            ) : (
              <Badge variant="info">Viewing as {user?.role?.replace('_', ' ').toUpperCase()}</Badge>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem 2.5rem', backgroundColor: '#f9fafb' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem', background: 'white', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}><Clock size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Job Type</p>
              <p style={{ fontWeight: 600, margin: 0 }}>{job.jobType}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem', background: 'white', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}><DollarSign size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Salary Range</p>
              <p style={{ fontWeight: 600, margin: 0 }}>
                {job.salaryRange?.min ? `₹${job.salaryRange.min/1000}k - ₹${job.salaryRange.max/1000}k` : 'Competitive'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.5rem', background: 'white', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}><Calendar size={20} /></div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Experience</p>
              <p style={{ fontWeight: 600, margin: 0 }}>{job.experienceLevel}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          <div>
            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>About the role</h3>
              <div style={{ lineHeight: 1.7, color: '#4b5563', whiteSpace: 'pre-wrap' }}>
                {job.description}
              </div>
            </section>
          </div>

          <div>
            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={20} /> Required Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.skillsRequired?.map((skill, index) => (
                  <Badge key={index} variant="info" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{skill}</Badge>
                ))}
              </div>
            </section>

            <section style={{ padding: '1.5rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Employer Information</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {companyLogoUrl ? (
                    <img src={companyLogoUrl} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Building size={20} />
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>{companyName}</p>
                  <a href={job.companyId?.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Visit Website</a>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                This employer has been verified by NextHire for authenticity and business standards.
              </p>
            </section>
          </div>
        </div>
      </div>

      <ApplyModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
        companyName={companyName}
        onSuccess={() => {
          setHasApplied(true);
          setIsApplyModalOpen(false);
          alert('Application submitted successfully!');
        }}
      />
    </div>
  );
};

export default JobDetail;
