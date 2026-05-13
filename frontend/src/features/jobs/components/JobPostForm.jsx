import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Tag, Clock, Award, Plus, X } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import styles from './JobPostForm.module.css';
import { jobsAPI } from '../../../services/api';

const JobPostForm = ({ onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    salaryRange: { 
      min: initialData?.salaryRange?.min || '', 
      max: initialData?.salaryRange?.max || '', 
      currency: initialData?.salaryRange?.currency || 'INR' 
    },
    jobType: initialData?.jobType || 'Full-time',
    experienceLevel: initialData?.experienceLevel || 'Entry',
    skillsRequired: initialData?.skillsRequired || []
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        salaryRange: { ...prev.salaryRange, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !formData.skillsRequired.includes(currentSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, currentSkill.trim()]
      }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      
      const payload = {
        ...formData,
        salaryRange: {
          min: Number(formData.salaryRange.min) || undefined,
          max: Number(formData.salaryRange.max) || undefined,
          currency: formData.salaryRange.currency
        }
      };

      if (initialData?._id) {
        await jobsAPI.updateJob(initialData._id, payload);
      } else {
        await jobsAPI.postJob(payload);
      }
      
      if (onSuccess) onSuccess();

      if (!initialData) {
        setFormData({
          title: '',
          description: '',
          location: '',
          salaryRange: { min: '', max: '', currency: 'INR' },
          jobType: 'Full-time',
          experienceLevel: 'Entry',
          skillsRequired: []
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job. Make sure your company is approved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        
        <div className={styles.section}>
          <label className={styles.label}><Briefcase size={16} /> Job Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Developer"
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}><MapPin size={16} /> Location</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote, Bangalore, Delhi"
            required
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}><Clock size={16} /> Job Type</label>
          <select 
            name="jobType" 
            value={formData.jobType} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label}><Award size={16} /> Experience Level</label>
          <select 
            name="experienceLevel" 
            value={formData.experienceLevel} 
            onChange={handleChange}
            className={styles.select}
          >
            <option value="Entry">Entry Level</option>
            <option value="Mid">Mid Level</option>
            <option value="Senior">Senior Level</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        <div className={styles.section}>
          <label className={styles.label}><DollarSign size={16} /> Min Salary</label>
          <Input
            type="number"
            name="salary.min"
            value={formData.salaryRange.min}
            onChange={handleChange}
            placeholder="Min Salary"
          />
        </div>

        <div className={styles.section}>
          <label className={styles.label}><DollarSign size={16} /> Max Salary</label>
          <Input
            type="number"
            name="salary.max"
            value={formData.salaryRange.max}
            onChange={handleChange}
            placeholder="Max Salary"
          />
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Job Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, responsibilities, and benefits..."
          className={styles.textarea}
          required
        ></textarea>
      </div>

      <div className={styles.section}>
        <label className={styles.label}><Tag size={16} /> Required Skills</label>
        <div className={styles.skillInputWrapper}>
          <Input
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            placeholder="Press Add to include a skill"
            className={styles.skillInput}
          />
          <Button type="button" variant="ghost" onClick={addSkill}>
            <Plus size={20} /> Add
          </Button>
        </div>
        <div className={styles.skillsList}>
          {formData.skillsRequired.map(skill => (
            <span key={skill} className={styles.skillBadge}>
              {skill}
              <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
            </span>
          ))}
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <Button type="submit" variant="primary" fullWidth disabled={loading}>
        {loading ? (initialData ? 'Updating...' : 'Posting...') : (initialData ? 'Update Job Listing' : 'Post Job Listing')}
      </Button>
    </form>
  );
};

export default JobPostForm;
