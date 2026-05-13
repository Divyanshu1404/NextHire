import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Globe, Mail, Save, RotateCcw, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { companyAPI, uploadAPI } from '../../services/api';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import styles from './Organization.module.css';

const Organization = () => {
  const { user } = useSelector(state => state.auth);
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ companyName: '', email: '', website: '', logoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const compId = user?.companyId?._id || user?.companyId;
        if (!compId) {
          setCompany(null);
          return;
        }
        const res = await companyAPI.getCompanyDetails(compId);
        const data = res.data.data.company || res.data.data;
        setCompany(data);
        if (data) {
          setForm({
            companyName: data.companyName || '',
            email: data.email || '',
            website: data.website || '',
            logoUrl: data.logoUrl || ''
          });
        }
      } catch (err) {
        console.error('Fetch company error', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [user]);

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
      const res = await companyAPI.updateCompany(compId, form);
      const updated = res.data.data.company || res.data.data;
      setCompany(updated);
      setForm({
        companyName: updated.companyName || '',
        email: updated.email || '',
        website: updated.website || '',
        logoUrl: updated.logoUrl || ''
      });
      alert('Organization updated');
    } catch (err) {
      console.error('Update error', err.response || err.message);
      alert(err.response?.data?.message || 'Failed to update organization');
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
      console.error('Upload error', err.response || err.message);
      alert('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <Loader fullScreen={false} />;

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
