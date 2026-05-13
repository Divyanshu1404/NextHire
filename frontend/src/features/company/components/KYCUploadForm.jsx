import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { companyAPI, uploadAPI } from '../../../services/api';
import styles from './Company.module.css';

const KYCUploadForm = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    website: '',
    registrationNumber: '',
  });
  const [kycFile, setKycFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setKycFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      
      if (!kycFile) {
        setError('Please upload a KYC document');
        setLoading(false);
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', kycFile);
      const uploadResponse = await uploadAPI.uploadFile(formDataUpload);
      const kycDocumentUrl = uploadResponse.data.data?.url || uploadResponse.data.url;

      await companyAPI.registerCompany({
        companyName: formData.companyName,
        email: formData.email,
        website: formData.website || undefined,
        registrationNumber: formData.registrationNumber,
        kycDocumentUrl: kycDocumentUrl,
      });

      onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.kycFormContainer}>
      <div className={styles.kycHeader}>
        <h2 className={styles.kycTitle}>Complete Company Verification</h2>
        <p className={styles.kycSubtitle}>Register your company and upload KYC documents to get verified and start posting jobs.</p>
      </div>

      {error && (
        <div className={styles.alertDanger}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.kycForm}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Company Details</h3>
          <div className={styles.inputGrid}>
            <Input
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleTextChange}
              placeholder="e.g. TechCorp Pvt Ltd"
              required
            />
            <Input
              label="Company Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleTextChange}
              placeholder="contact@company.com"
              required
            />
            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleTextChange}
              placeholder="e.g. CIN/GSTIN"
              required
            />
            <Input
              label="Website (optional)"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleTextChange}
              placeholder="https://company.com"
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>KYC Document Upload</h3>
          <div className={styles.uploadBox}>
            <label className={styles.uploadLabel}>
              <Upload size={24} className={styles.uploadIcon} />
              <span className={styles.uploadText}>Upload KYC Document</span>
              <span className={styles.uploadHint}>Registration Certificate, GST Certificate, etc. (PDF, JPG, PNG — Max 5MB)</span>
              <input 
                type="file" 
                name="kycDocument" 
                onChange={handleFileChange} 
                className={styles.hiddenInput} 
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
            </label>
            {kycFile && (
              <div className={styles.fileSelected}>
                <CheckCircle size={16} className="text-secondary" />
                <span className={styles.fileName}>{kycFile.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" variant="primary" size="lg" disabled={loading} fullWidth>
            {loading ? 'Registering Company...' : 'Submit for Verification'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KYCUploadForm;
