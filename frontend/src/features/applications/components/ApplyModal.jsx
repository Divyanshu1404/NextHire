import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Send, X, AlertCircle, Upload } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { applicationAPI, userAPI, uploadAPI } from '../../../services/api';

const ApplyModal = ({ isOpen, onClose, jobId, jobTitle, companyName, onSuccess }) => {
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({ 
    resumeUrl: '', 
    coverLetter: '' 
  });
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const response = await userAPI.getProfile();
          const profile = response.data.data.user || response.data.data;
          if (profile.profile?.resumeUrl) {
            setFormData(prev => ({ ...prev, resumeUrl: profile.profile.resumeUrl }));
          }
        } catch (err) {
          console.error("Couldn't fetch profile for pre-fill", err);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let coverLetterValue = formData.coverLetter;

      if (coverLetterFile) {
        const uploadData = new FormData();
        uploadData.append('file', coverLetterFile);
        const uploadRes = await uploadAPI.uploadFile(uploadData);
        // Assuming the response structure is { data: { url: '...' } } or similar
        coverLetterValue = uploadRes.data.data?.url || uploadRes.data.url || uploadRes.data;
      }

      await applicationAPI.applyToJob({ 
        ...formData, 
        coverLetter: coverLetterValue,
        jobId 
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Apply for Role`}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{jobTitle}</h3>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>at {companyName}</p>
      </div>
      
      {error && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid var(--danger)', 
          borderRadius: 'var(--radius-md)',
          color: 'var(--danger)',
          display: 'flex',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Resume Link</label>
          <div style={{ position: 'relative' }}>
            <Input
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="Link to your resume (Drive/Dropbox)"
              required
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Make sure the link is public or shared with "Anyone with link".
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cover Letter (PDF)</label>
          <div 
            onClick={() => document.getElementById('coverLetterUpload').click()}
            style={{ 
              border: '2px dashed var(--border)', 
              borderRadius: 'var(--radius-md)', 
              padding: '1.5rem', 
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: coverLetterFile ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
              borderColor: coverLetterFile ? 'var(--primary)' : 'var(--border)'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = coverLetterFile ? 'var(--primary)' : 'var(--border)'}
          >
            <input 
              id="coverLetterUpload"
              type="file" 
              accept=".pdf" 
              onChange={(e) => setCoverLetterFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            {coverLetterFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <FileText size={20} />
                <span style={{ fontWeight: 500 }}>{coverLetterFile.name}</span>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to upload cover letter (PDF)</p>
              </div>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Uploading a cover letter is recommended to increase your chances.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyModal;
