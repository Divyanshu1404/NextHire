import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, Building, FileText, ExternalLink } from 'lucide-react';
import KYCUploadForm from '../../features/company/components/KYCUploadForm';
import { companyAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

const KYCPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyStatus = async () => {
    if (!user?.companyId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const companyId = user.companyId._id || user.companyId;
      const response = await companyAPI.getCompanyDetails(companyId);
      setCompany(response.data.data.company || response.data.data);
    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Failed to fetch company status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyStatus();
  }, [user?.companyId]);

  const handleUploadSuccess = () => {
    fetchCompanyStatus(); 
  };

  if (loading) return <Loader fullScreen />;

  if (!user?.companyId) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Register Your Company
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Fill in your company details and upload KYC documents to get started.
          </p>
        </div>
        <KYCUploadForm onUploadSuccess={() => window.location.reload()} />
      </div>
    );
  }


  const status = company?.verificationStatus?.toLowerCase() || 'not_submitted';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Company Verification
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your business identity and verification status.
        </p>
      </div>

      {status === 'approved' ? (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            color: 'var(--success)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem' 
          }}>
            <CheckCircle size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Business Verified</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', marginInline: 'auto' }}>
            Congratulations! Your company **  {company?.companyName}** has been successfully verified. You can now post jobs and access all platform features.
          </p>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: 'var(--background)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
          }}>
            <Building size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 600 }}>{company?.companyName}</span>
            <Badge variant="success">Verified</Badge>
          </div>
          
          <div style={{ marginTop: '2.5rem' }}>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Admin Dashboard
            </Button>
          </div>
        </div>
      ) : status === 'pending' ? (
        <div style={{ 
          background: 'var(--surface)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'rgba(245, 158, 11, 0.1)', 
            color: 'var(--warning)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1.5rem' 
          }}>
            <Clock size={40} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Verification in Progress</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            We've received your documents and our team is currently reviewing them. 
            This process usually takes 24-48 hours.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge variant="warning">Under Review</Badge>
          </div>
        </div>
      ) : status === 'rejected' ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--danger)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '1.5rem',
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <AlertTriangle style={{ color: 'var(--danger)', flexShrink: 0 }} size={24} />
            <div>
              <h4 style={{ color: 'var(--danger)', fontWeight: 700, margin: 0 }}>Verification Rejected</h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                Your documents were not approved. Please review our requirements and re-upload clear documents.
              </p>
            </div>
          </div>
          <KYCUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>
      ) : (
        <KYCUploadForm onUploadSuccess={handleUploadSuccess} />
      )}
    </div>
  );
};

export default KYCPage;
