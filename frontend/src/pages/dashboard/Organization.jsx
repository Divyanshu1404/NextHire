import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Building2, Globe, Mail, Save, RotateCcw, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { fetchCompanyDetails, updateCompany } from '../../store/thunks/companyThunks';
import { uploadAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import styles from './Organization.module.css';

const Organization = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { selectedCompany: company, loading } = useSelector(state => state.company);
  
  const [form, setForm] = useState({ companyName: '', email: '', website: '', logoUrl: '' });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const compId = user?.companyId?._id || user?.companyId;
    if (compId) {
      dispatch(fetchCompanyDetails(compId));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || '',
        email: company.email || '',
        website: company.website || '',
        logoUrl: company.logoUrl || ''
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const compId = user?.companyId?._id || user?.companyId;
      if (!compId) return alert('No company found');
      await dispatch(updateCompany({ id: compId, data: form })).unwrap();
      alert('Organization updated');
    } catch (err) {
      alert(err || 'Failed to update organization');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!company) return;
    setForm({
      companyName: company.companyName || '',
      email: company.email || '',
      website: company.website || '',
      logoUrl: company.logoUrl || ''
    });
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    try {
      setUploadingLogo(true);
      const upRes = await uploadAPI.uploadFile(fd);
      const url = upRes.data.data.url || upRes.data.data;
      setForm(prev => ({ ...prev, logoUrl: url }));
    } catch (err) {
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading && !company) return <Loader fullScreen={false} />;

  const previewLogoUrl = form.logoUrl || company?.logoUrl || '';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Company settings</p>
          <h2 className={styles.title}>Organization</h2>
          <p className={styles.subtitle}>Keep your company identity, contact details, and logo up to date.</p>
        </div>
        {company?.verificationStatus && (
          <div className={styles.statusPill}>
            <Building2 size={16} />
            <span>{company.verificationStatus}</span>
          </div>
        )}
      </div>

      {!company ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <AlertCircle size={28} />
          </div>
          <h3>No organization found</h3>
          <p>Please complete Company KYC first so your organization profile can be loaded here.</p>
        </div>
      ) : (
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span className={styles.label}>Company Name</span>
                <div className={styles.inputWrap}>
                  <Building2 size={16} className={styles.inputIcon} />
                  <input name="companyName" value={form.companyName} onChange={handleChange} required className={styles.input} />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className={styles.input} />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Website</span>
                <div className={styles.inputWrap}>
                  <Globe size={16} className={styles.inputIcon} />
                  <input name="website" value={form.website} onChange={handleChange} className={styles.input} placeholder="https://yourcompany.com" />
                </div>
              </label>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeading}>
                <div>
                  <h3>Company Logo</h3>
                  <p>Upload a logo that will appear across your company profile.</p>
                </div>
                {uploadingLogo && <span className={styles.helperText}>Uploading...</span>}
              </div>

              <div className={styles.logoRow}>
                <div className={styles.logoPreview}>
                  {previewLogoUrl ? (
                    <img src={previewLogoUrl} alt="Company logo preview" />
                  ) : (
                    <div className={styles.logoPlaceholder}>
                      <ImageIcon size={22} />
                      <span>No logo</span>
                    </div>
                  )}
                </div>

                <div className={styles.uploadArea}>
                  <label className={styles.uploadButton}>
                    <Upload size={16} />
                    <span>{uploadingLogo ? 'Uploading...' : 'Choose logo file'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.hiddenInput}
                      onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                      disabled={uploadingLogo}
                    />
                  </label>
                  <p className={styles.uploadHint}>PNG, JPG, or WEBP recommended. A square image works best.</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="ghost" onClick={handleReset} disabled={saving}>
                <RotateCcw size={16} />
                <span>Reset</span>
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Organization;
