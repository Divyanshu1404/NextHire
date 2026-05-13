import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAPI, uploadAPI } from '../../services/api';
import { MapPin, Phone, Mail, Edit2, Plus, Download, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import Input from '../../components/ui/Input';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('summary');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      setProfile(res.data.data.user || res.data.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = (section) => {
    setFormData(profile);
    setEditMode(section);
  };

  const handleSave = async () => {
    try {
      await userAPI.updateProfile(formData);
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) return <Loader fullScreen />;

  const quickLinks = [
    { id: 'summary', label: 'Profile Summary' },
    { id: 'skills', label: 'Key Skills' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Header Profile Card */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f3f4f6', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          {profile?.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 600, color: '#9ca3af' }}>
              {profile?.name?.charAt(0)}
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, position: 'relative' }}>
          {editMode === 'basic' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
                <Input name="name" value={formData.name || ''} onChange={handleChange} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Location</label>
                <Input name="location" value={formData.location || ''} onChange={handleChange} placeholder="City, State" />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</label>
                <Input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ position: 'absolute', top: 0, right: 0 }}>
                <Button variant="ghost" size="sm" onClick={() => handleEditToggle('basic')}><Edit2 size={16} /> Edit Basic Details</Button>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', paddingRight: '120px' }}>{profile?.name}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> {profile?.location || 'Add Location'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {profile?.phone || 'Add Phone'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {profile?.email}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Quick Links */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setActiveSection(link.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: activeSection === link.id ? '#eff6ff' : 'transparent',
                  color: activeSection === link.id ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: activeSection === link.id ? 600 : 400,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Profile Summary */}
          {(activeSection === 'summary' || activeSection === 'all') && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile Summary</h3>
                <Button variant="ghost" size="sm" onClick={() => handleEditToggle('summary')}><Edit2 size={16} /> Edit</Button>
              </div>
              
              {editMode === 'summary' ? (
                <div>
                  <textarea 
                    name="profile.profileSummary"
                    value={formData.profile?.profileSummary || ''} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minHeight: '120px', marginBottom: '1rem' }}
                    placeholder="Write a meaningful summary of more than 50 characters..."
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  {profile?.profile?.profileSummary || 'Your Profile Summary should mention the highlights of your career and education...'}
                </p>
              )}
            </div>
          )}

          {/* Key Skills */}
          {(activeSection === 'skills' || activeSection === 'all') && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Key Skills</h3>
                <Button variant="ghost" size="sm" onClick={() => handleEditToggle('skills')}><Edit2 size={16} /> Edit</Button>
              </div>

              {editMode === 'skills' ? (
                <div>
                  <Input 
                    name="profile.skills"
                    value={formData.profile?.skills?.join(', ') || ''} 
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev, 
                        profile: { ...prev.profile, skills: e.target.value.split(',').map(s => s.trim()) }
                      }));
                    }}
                    placeholder="Enter skills separated by commas (e.g. React, Node.js)"
                  />
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {profile?.profile?.skills?.length > 0 ? (
                    profile.profile.skills.map((skill, i) => (
                      <span key={i} style={{ padding: '0.5rem 1rem', background: '#f3f4f6', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Add skills to stand out to employers.</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {(activeSection === 'education' || activeSection === 'all') && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Education</h3>
                <Button variant="ghost" size="sm" onClick={() => handleEditToggle('education')}><Edit2 size={16} /> Edit / Add</Button>
              </div>

              {editMode === 'education' ? (
                <div>
                  {(formData.profile?.education || []).map((edu, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Degree / Course</label>
                        <Input 
                          value={edu.degree || ''} 
                          onChange={(e) => {
                            const newEdu = [...(formData.profile?.education || [])];
                            newEdu[idx].degree = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, education: newEdu } }));
                          }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Institution / University</label>
                        <Input 
                          value={edu.institution || ''} 
                          onChange={(e) => {
                            const newEdu = [...(formData.profile?.education || [])];
                            newEdu[idx].institution = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, education: newEdu } }));
                          }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Passing Year</label>
                        <Input 
                          type="number"
                          value={edu.graduationYear || ''} 
                          onChange={(e) => {
                            const newEdu = [...(formData.profile?.education || [])];
                            newEdu[idx].graduationYear = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, education: newEdu } }));
                          }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Grade / Percentage</label>
                        <Input 
                          value={edu.score || ''} 
                          placeholder="e.g. 85% or 8.5 CGPA"
                          onChange={(e) => {
                            const newEdu = [...(formData.profile?.education || [])];
                            newEdu[idx].score = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, education: newEdu } }));
                          }} 
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} onClick={() => {
                          const newEdu = formData.profile.education.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, profile: { ...prev.profile, education: newEdu } }));
                        }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      profile: { ...prev.profile, education: [...(prev.profile?.education || []), { degree: '', institution: '', graduationYear: '', score: '' }] }
                    }));
                  }}>+ Add Education</Button>
                  
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {profile?.profile?.education?.length > 0 ? (
                    profile.profile.education.map((edu, idx) => (
                      <div key={idx} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.5rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border)' }}></div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{edu.degree}</h4>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{edu.institution}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          Class of {edu.graduationYear || 'N/A'} {edu.score ? ` • Score: ${edu.score}` : ''}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Add your educational details to help recruiters know your academic background.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {(activeSection === 'projects' || activeSection === 'all') && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Projects</h3>
                <Button variant="ghost" size="sm" onClick={() => handleEditToggle('projects')}><Edit2 size={16} /> Edit / Add</Button>
              </div>

              {editMode === 'projects' ? (
                <div>
                  {(formData.profile?.projects || []).map((proj, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project Title</label>
                        <Input 
                          value={proj.title || ''} 
                          onChange={(e) => {
                            const newProj = [...(formData.profile?.projects || [])];
                            newProj[idx].title = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, projects: newProj } }));
                          }} 
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea 
                          value={proj.description || ''} 
                          onChange={(e) => {
                            const newProj = [...(formData.profile?.projects || [])];
                            newProj[idx].description = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, projects: newProj } }));
                          }}
                          style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', minHeight: '80px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Project Link (Optional)</label>
                        <Input 
                          value={proj.link || ''} 
                          placeholder="e.g. GitHub or Live URL"
                          onChange={(e) => {
                            const newProj = [...(formData.profile?.projects || [])];
                            newProj[idx].link = e.target.value;
                            setFormData(prev => ({ ...prev, profile: { ...prev.profile, projects: newProj } }));
                          }} 
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }} onClick={() => {
                          const newProj = formData.profile.projects.filter((_, i) => i !== idx);
                          setFormData(prev => ({ ...prev, profile: { ...prev.profile, projects: newProj } }));
                        }}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      profile: { ...prev.profile, projects: [...(prev.profile?.projects || []), { title: '', description: '', link: '' }] }
                    }));
                  }}>+ Add Project</Button>
                  
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {profile?.profile?.projects?.length > 0 ? (
                    profile.profile.projects.map((proj, idx) => (
                      <div key={idx} style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{proj.title}</h4>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                              View Project <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{proj.description}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>Add projects you've worked on to showcase your practical skills.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Resume */}
          {(activeSection === 'resume' || activeSection === 'all') && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Resume</h3>
              </div>
              <div style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center' }}>
                {profile?.profile?.resumeUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle color="var(--success)" />
                      <span style={{ fontWeight: 500 }}>Resume Uploaded</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <a href={profile.profile.resumeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={16} /> View
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Your resume is the first impression you make on potential employers.</p>
                    <Input 
                      name="profile.resumeUrl"
                      value={formData.profile?.resumeUrl || ''} 
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev, 
                          profile: { ...prev.profile, resumeUrl: e.target.value }
                        }));
                      }}
                      placeholder="Paste link to your resume (Drive/PDF URL)"
                    />
                    <Button variant="primary" style={{ marginTop: '1rem' }} onClick={handleSave}>Save Resume Link</Button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
