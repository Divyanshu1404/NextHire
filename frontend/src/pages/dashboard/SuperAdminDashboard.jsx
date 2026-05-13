import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Shield, Building, Users, AlertCircle, CheckCircle, XCircle, Clock, ExternalLink, Trash2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import { adminAPI } from '../../services/api';

const SuperAdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllCompanies();
      setCompanies(response.data.data?.companies || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleKYCAction = async (companyId, status) => {
    try {
      setActionLoading(companyId);
      await adminAPI.updateKYCStatus(companyId, status);
      
      await fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} KYC`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      setActionLoading(companyId);
      await adminAPI.deleteCompany(companyId);
      setError(null);
      await fetchCompanies();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete company');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCompanies = companies.filter(c => c.verificationStatus === 'pending');
  const approvedCompanies = companies.filter(c => c.verificationStatus === 'approved');
  const rejectedCompanies = companies.filter(c => c.verificationStatus === 'rejected');

  const stats = [
    { title: 'Pending KYC', value: String(pendingCompanies.length), icon: AlertCircle, trend: pendingCompanies.length > 0 ? { value: 'Requires action', isPositive: false, label: '' } : undefined },
    { title: 'Total Companies', value: String(companies.length), icon: Building },
    { title: 'Approved', value: String(approvedCompanies.length), icon: CheckCircle },
    { title: 'System Health', value: '99.9%', icon: Shield },
  ];

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="info">Unknown</Badge>;
    switch (status.toLowerCase()) {
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="info">{status}</Badge>;
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '999px', background: 'rgba(79,70,229,0.1)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          <Shield size={14} />
          Portal Root Access
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Shield style={{ color: 'var(--primary)' }} />
          NextHire Portal Super Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          You are the highest-level administrator of the NextHire portal with full platform governance privileges.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
          Manage company onboarding, KYC lifecycle, and organization compliance across the entire portal.
        </p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Clock size={20} style={{ color: 'var(--warning)' }} />
          Pending KYC Approvals ({pendingCompanies.length})
        </h2>

        {pendingCompanies.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No companies are waiting for KYC approval.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingCompanies.map(company => (
              <div key={company._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: 'var(--background)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{company.companyName}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {company.email} · Reg: {company.registrationNumber}
                  </p>
                  {company.createdBy && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Submitted by: {company.createdBy.name} ({company.createdBy.email})
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {company.kycDocumentUrl && (
                    <a href={company.kycDocumentUrl} target="_blank" rel="noopener noreferrer"
                       style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                      <ExternalLink size={14} /> View Doc
                    </a>
                  )}
                  {getStatusBadge(company.verificationStatus)}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={actionLoading === company._id}
                    onClick={() => handleKYCAction(company._id, 'approved')}
                  >
                    <CheckCircle size={14} style={{ marginRight: '0.25rem' }} />
                    {actionLoading === company._id ? '...' : 'Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={actionLoading === company._id}
                    onClick={() => handleKYCAction(company._id, 'rejected')}
                  >
                    <XCircle size={14} style={{ marginRight: '0.25rem' }} />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Building size={20} style={{ color: 'var(--primary)' }} />
          All Companies ({companies.length})
        </h2>

        {companies.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No companies registered yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Company</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reg. Number</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>KYC Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Document</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(company => (
                  <tr key={company._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500, color: 'var(--text-main)' }}>{company.companyName}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{company.email}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{company.registrationNumber}</td>
                    <td style={{ padding: '0.75rem' }}>{getStatusBadge(company.verificationStatus)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {company.kycDocumentUrl ? (
                        <a href={company.kycDocumentUrl} target="_blank" rel="noopener noreferrer"
                           style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ExternalLink size={14} /> View
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={actionLoading === company._id}
                        onClick={() => setDeleteConfirm(company._id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Trash2 size={14} />
                        {actionLoading === company._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxWidth: '400px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <AlertCircle size={24} style={{ color: 'var(--danger)' }} />
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>Delete Company</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Are you sure you want to delete this company? This action will:
              <ul style={{ marginTop: '0.5rem', marginLeft: '1rem', color: 'var(--text-muted)' }}>
                <li>Delete all associated jobs</li>
                <li>Delete all applications</li>
                <li>Remove company from all users</li>
              </ul>
              This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button 
                variant="ghost" 
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading === deleteConfirm}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleDeleteCompany(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
              >
                {actionLoading === deleteConfirm ? 'Deleting...' : 'Delete Company'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
