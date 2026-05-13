import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Save, AlertCircle, CheckCircle, Camera, Upload, Phone, MapPin, Calendar, Building } from 'lucide-react';
import { userAPI, uploadAPI } from '../../services/api';
import { setUser } from '../../store/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/ui/Loader';

const Settings = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    location: ''
  });
  const [companyName, setCompanyName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        const userData = response.data.data.user || response.data.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          profilePicture: userData.profilePicture || '',
          phone: userData.phone || '',
          gender: userData.gender || '',
          dateOfBirth: userData.dateOfBirth || '',
          location: userData.location || ''
        });
        if (userData.companyId?.companyName) {
          setCompanyName(userData.companyId.companyName);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: '', message: '' });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await uploadAPI.uploadFile(formDataUpload);
      const imageUrl = response.data.data.url;
      setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
      setStatus({ type: 'success', message: 'Image uploaded! Don\'t forget to save changes.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await userAPI.updateProfile({ 
        name: formData.name,
        profilePicture: formData.profilePicture,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        location: formData.location
      });
      const updatedUser = response.data.data.user || response.data.data;
      
      dispatch(setUser(updatedUser));
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader fullScreen />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>My Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Update your personal information and profile picture.</p>
      </div>

      <div style={{ 
        background: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              backgroundColor: 'var(--background)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {formData.profilePicture ? (
                <img 
                  src={formData.profilePicture} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <User size={60} style={{ color: 'var(--text-muted)' }} />
              )}
              {uploading && (
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Loader size="sm" />
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                position: 'absolute', 
                bottom: '5px', 
                right: '5px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.4)'
              }}
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Click the camera icon to upload a new photo
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Personal Information</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} /> Full Name
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
                <Mail size={16} /> Email Address
              </label>
              <Input
                name="email"
                value={formData.email}
                disabled
                style={{ backgroundColor: 'var(--background)', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> Phone Number
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> Date of Birth
                </label>
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> Location
                </label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, India"
                />
              </div>
            </div>

            {companyName && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
                  <Building size={16} /> Company
                </label>
                <Input
                  value={companyName}
                  disabled
                  style={{ backgroundColor: 'var(--background)', cursor: 'not-allowed' }}
                />
              </div>
            )}
          </div>

          {status.message && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
              border: `1px solid ${status.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
            }}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{status.message}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || uploading}
              style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              <Save size={18} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>

      <div style={{ 
        marginTop: '2rem',
        background: 'var(--background)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 600 }}>Account Status</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Logged in as {user?.role?.replace('_', ' ')}
            {user?.companyId?.companyName && ` at ${user.companyId.companyName}`}
          </p>
        </div>
        <div style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'white', 
          padding: '0.25rem 1rem', 
          borderRadius: 'var(--radius-full)',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'capitalize'
        }}>
          {user?.role?.toLowerCase().replace('_', ' ')}
        </div>
      </div>
    </div>
  );
};

export default Settings;
