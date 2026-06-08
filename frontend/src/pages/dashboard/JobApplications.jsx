import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, User, Mail, FileText, CheckCircle, XCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { fetchJobById } from '../../store/thunks/jobThunks';
import { fetchJobApplications, updateApplicationStatus, sendAssessment } from '../../store/thunks/applicationThunks';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedJob: job, loading: jobLoading } = useSelector(state => state.jobs);
  const { jobApplications: applications, loading: appsLoading } = useSelector(state => state.applications);

  const [updatingId, setUpdatingId] = useState(null);
  const [assessmentModal, setAssessmentModal] = useState({ isOpen: false, appId: null, link: '' });

  useEffect(() => {
    dispatch(fetchJobById(jobId));
    dispatch(fetchJobApplications(jobId));
  }, [jobId, dispatch]);

  const handleStatusUpdate = async (appId, status) => {
    try {
      setUpdatingId(appId);
      await dispatch(updateApplicationStatus({ id: appId, status })).unwrap();
    } catch (err) {
      alert(err || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendAssessment = async (e) => {
    e.preventDefault();
    try {
      setUpdatingId(assessmentModal.appId);
      await dispatch(sendAssessment({ id: assessmentModal.appId, assessmentLink: assessmentModal.link })).unwrap();
      setAssessmentModal({ isOpen: false, appId: null, link: '' });
      alert('Assessment link sent successfully via email!');
    } catch (err) {
      alert(err || 'Failed to send assessment link');
    } finally {
      setUpdatingId(null);
    }
  };

  if (jobLoading || appsLoading) return <Loader fullScreen />;

  return (
    <div>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 500 }}
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </button>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Applications for {job?.title}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review and manage candidates who applied for this position. Total: {applications.length}
        </p>
      </div>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <User size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No applications yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>As soon as candidates apply, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map(app => (
            <div key={app._id} style={{ 
              background: 'white', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>

              <div style={{ 
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)' }}>
                    <img 
                      src={app.userId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId?.name || 'U')}&background=6366f1&color=fff`} 
                      alt={app.userId?.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{app.userId?.name || 'Unknown'}</h3>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={14} /> {app.userId?.email || 'N/A'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={14} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Badge variant={
                    app.status === 'selected' ? 'success' : 
                    app.status === 'rejected' ? 'danger' : 
                    app.status === 'shortlisted' ? 'info' : 'default'
                  }>
                    {app.status?.toUpperCase() || 'APPLIED'}
                  </Badge>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>

                    {app.status === 'applied' && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        disabled={updatingId === app._id}
                        onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                        style={{ backgroundColor: '#3b82f6' }}
                      >
                        <CheckCircle size={16} style={{ marginRight: '0.25rem' }} /> Shortlist
                      </Button>
                    )}

                    {(app.status === 'shortlisted' || app.status === 'selected') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={updatingId === app._id}
                        onClick={() => setAssessmentModal({ isOpen: true, appId: app._id, link: app.assessmentLink || '' })}
                        style={{ color: '#4f46e5', borderColor: '#4f46e5', borderWidth: '1px', borderStyle: 'solid' }}
                      >
                        <MessageSquare size={16} style={{ marginRight: '0.25rem' }} /> Send Assessment
                      </Button>
                    )}

                    {(app.status === 'shortlisted' || app.status === 'assessment_sent') && (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        disabled={updatingId === app._id}
                        onClick={() => handleStatusUpdate(app._id, 'selected')}
                        style={{ backgroundColor: 'var(--success)' }}
                      >
                        <CheckCircle size={16} style={{ marginRight: '0.25rem' }} /> Select Candidate
                      </Button>
                    )}

                    {(app.status === 'applied' || app.status === 'shortlisted' || app.status === 'assessment_sent') && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        disabled={updatingId === app._id}
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      >
                        <XCircle size={16} style={{ marginRight: '0.25rem' }} /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {app.assessmentLink && (
                <div style={{ backgroundColor: '#eef2ff', padding: '0.75rem 1.5rem', borderTop: '1px solid #c7d2fe', borderBottom: '1px solid #c7d2fe', fontSize: '0.85rem', color: '#4338ca', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} /> 
                  <span>Assessment link sent to candidate: <a href={app.assessmentLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>{app.assessmentLink}</a></span>
                </div>
              )}

              <div style={{ 
                borderTop: '1px solid var(--border)', 
                padding: '1.25rem 1.5rem', 
                background: '#f9fafb',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Resume</p>
                  {app.resumeUrl ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const url = app.resumeUrl.startsWith('http') ? app.resumeUrl : `https://${app.resumeUrl}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, padding: '0.25rem 0' }}
                    >
                      <ExternalLink size={16} /> Open Resume Link
                    </Button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No resume provided</span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>Cover Letter</p>
                  {app.coverLetter ? (
                    app.coverLetter.startsWith('http') ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => window.open(app.coverLetter, '_blank', 'noopener,noreferrer')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, padding: '0.25rem 0' }}
                      >
                        <ExternalLink size={16} /> View Cover Letter (PDF)
                      </Button>
                    ) : (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>{app.coverLetter}</p>
                    )
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No cover letter provided</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {assessmentModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Send Assessment Link</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              The candidate will receive an email with this link to complete their assessment.
            </p>
            <form onSubmit={handleSendAssessment}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Assessment URL</label>
                <input 
                  type="url" 
                  required 
                  value={assessmentModal.link}
                  onChange={(e) => setAssessmentModal({...assessmentModal, link: e.target.value})}
                  placeholder="https://docs.google.com/forms/..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button variant="ghost" type="button" onClick={() => setAssessmentModal({ isOpen: false, appId: null, link: '' })}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={updatingId === assessmentModal.appId}>
                  {updatingId === assessmentModal.appId ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;

