import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileText, Plus, Search, Filter, Edit2, Trash2, UserPlus, Mail, Shield, X } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import JobPostForm from '../../features/jobs/components/JobPostForm';
import { jobsAPI, companyAPI, uploadAPI } from '../../services/api';

const CompanyAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('jobs');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [team, setTeam] = useState([]);
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, shortlisted: 0 });
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({ companyName: '', email: '', website: '' });

  const [teamEmail, setTeamEmail] = useState('');
  const [teamRole, setTeamRole] = useState('recruiter');
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, jobsRes, teamRes] = await Promise.all([
        companyAPI.getCompanyStats().catch(err => ({ data: { data: { stats: { totalJobs: 0, totalApplications: 0, shortlisted: 0 } } } })),
        jobsAPI.getCompanyJobs().catch(err => ({ data: { data: { jobs: [] } } })),
        companyAPI.getCompanyTeam().catch(err => ({ data: { data: { team: [] } } }))
      ]);

      const statsData = statsRes.data.data.stats || statsRes.data.data;
      setStats({
        totalJobs: statsData.activeJobs || statsData.totalJobs || 0,
        totalApplications: statsData.totalCandidates || statsData.totalApplications || 0,
        shortlisted: statsData.shortlisted || 0
      });

      const jobsData = jobsRes.data.data.jobs || jobsRes.data.data;
      setJobs(Array.isArray(jobsData) ? jobsData : []);

      const teamData = teamRes.data.data.team || teamRes.data.data;
      setTeam(Array.isArray(teamData) ? teamData : []);
      // fetch company details if available
      try {
        const compId = user?.companyId?._id || user?.companyId;
        if (compId) {
          const compRes = await companyAPI.getCompanyDetails(compId).catch(() => ({ data: { data: null } }));
          const compData = compRes.data.data.company || compRes.data.data;
          setCompany(compData || null);
          if (compData) {
            setCompanyForm({ companyName: compData.companyName || '', email: compData.email || '', website: compData.website || '', logoUrl: compData.logoUrl || '' });
          }
        }
      } catch (e) {
        console.error('Error fetching company details', e);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (!teamEmail) return;
    
    try {
      setIsAddingMember(true);
      const res = await companyAPI.addTeamMember({ email: teamEmail, role: teamRole });
      alert('Team member added successfully!');
      setTeamEmail('');
      
      const teamRes = await companyAPI.getCompanyTeam();
      const teamData = teamRes.data.data.team || teamRes.data.data;
      setTeam(Array.isArray(teamData) ? teamData : []);
    } catch (err) {
      console.error('Add Team Member Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to add team member. Make sure the user is registered first.');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyUpdate = async (e) => {
    e.preventDefault();
    try {
      const compId = user?.companyId?._id || user?.companyId;
      if (!compId) return alert('Company not found');
      const res = await companyAPI.updateCompany(compId, companyForm);
      const updated = res.data.data.company || res.data.data;
      setCompany(updated);
      setIsEditOpen(false);
      alert('Company updated successfully');
    } catch (err) {
      console.error('Update Company Error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to update company');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          {company?.logoUrl && (
            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={company.logoUrl} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {company?.companyName || user?.companyId?.companyName || 'Company'} Dashboard
              </h1>
              {company ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>Edit Company</Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/kyc')}>Add Company</Button>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Welcome, {user?.name}. View your company's hiring pipeline and manage your team.</p>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ width: '520px', background: 'white', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 6px 18px rgba(9,30,66,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>Edit Company</h3>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>
            <form onSubmit={handleCompanyUpdate}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Company Name</label>
                <input name="companyName" value={companyForm.companyName} onChange={handleCompanyChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Email</label>
                <input name="email" type="email" value={companyForm.email} onChange={handleCompanyChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Company Logo</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {companyForm.logoUrl ? <img src={companyForm.logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#9ca3af' }}>No logo</span>}
                  </div>
                  <div>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      try {
                        const upRes = await uploadAPI.uploadFile(fd);
                        const url = upRes.data.data.url || upRes.data.data;
                        setCompanyForm(prev => ({ ...prev, logoUrl: url }));
                        alert('Logo uploaded');
                      } catch (err) {
                        console.error('Upload error', err.response || err.message);
                        alert('Failed to upload logo');
                      }
                    }} />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Website</label>
                <input name="website" value={companyForm.website} onChange={handleCompanyChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="primary" type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard title="Active Jobs" value={String(stats.totalJobs)} icon={Briefcase} />
        <StatCard title="Total Applications" value={String(stats.totalApplications)} icon={Users} />
        <StatCard title="Shortlisted" value={String(stats.shortlisted)} icon={FileText} />
        <div onClick={() => navigate('/dashboard/jobs')} style={{ cursor: 'pointer' }}>
          <StatCard title="Job Management" value="Manage All" icon={Plus} />
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem', gap: '2rem' }}>
        <button 
          onClick={() => setActiveTab('jobs')}
          style={{ 
            padding: '1rem 0.5rem', 
            borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Company Jobs ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          style={{ 
            padding: '1rem 0.5rem', 
            borderBottom: activeTab === 'team' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'team' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Team Members ({team.length})
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Job Title</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Location</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No jobs posted yet by your recruitment team.
                  </td>
                </tr>
              ) : jobs.map(job => (
                <tr key={job._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{job.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posted on {new Date(job.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{job.location}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant="info">{job.jobType}</Badge>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/jobs/${job._id}/applications`)}
                        style={{ color: 'var(--primary)', fontWeight: 600 }}
                      >
                        View Applications
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} color="var(--primary)" /> Add Team Member
              </h3>
              <form onSubmit={handleAddTeamMember}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>User Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      placeholder="Candidate's registered email..."
                      value={teamEmail}
                      onChange={(e) => setTeamEmail(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Assign Role</label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select 
                      value={teamRole}
                      onChange={(e) => setTeamRole(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none', appearance: 'none' }}
                    >
                      <option value="hr">Human Resource (HR)</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
                <Button variant="primary" type="submit" fullWidth disabled={isAddingMember}>
                  {isAddingMember ? 'Adding...' : 'Add Team Member'}
                </Button>
              </form>
            </div>
            
            <div style={{ background: '#f0f9ff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #bae6fd' }}>
              <p style={{ fontSize: '0.85rem', color: '#0369a1', lineHeight: 1.5 }}>
                <strong>Tip:</strong> Users must already be registered on NextHire before you can add them to your team.
              </p>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Existing Team</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {team.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No other team members yet.</div>
              ) : team.map((member) => (
                <div key={member._id} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                      {member.profilePicture ? <img src={member.profilePicture} style={{ width: '100%', height: '100%', borderRadius: '50%' }} alt="" /> : member.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{member.name} {member.email === user.email && '(You)'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{member.email}</div>
                    </div>
                  </div>
                  <Badge variant={member.role === 'company_admin' ? 'success' : 'info'}>
                    {member.role?.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAdminDashboard;

