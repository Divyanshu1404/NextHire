import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building, MapPin, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { APPLICATION_STATUS } from '../../../constants/status';
import styles from '../Applications.module.css';

const ApplicationCard = ({ application }) => {
  
  const job = application.jobId || {};
  const company = job.companyId || {};
  const status = application.status;
  const createdAt = application.createdAt;
  
  const steps = [
    { id: 'applied', label: 'Applied' },
    { id: 'under_review', label: 'Review' },
    { id: 'assessment_sent', label: 'Assessment' },
    { id: 'selected', label: 'Final' }
  ];

  let currentStepIdx = 0;
  if (status === 'rejected') {
    currentStepIdx = -1;
  } else {
    currentStepIdx = steps.findIndex(s => s.id === status);
    if (currentStepIdx === -1) {
      if (status === 'shortlisted') currentStepIdx = 1;
      else if (status === 'applied') currentStepIdx = 0;
    }
  }

  const jobTitle = job.title || 'Unknown Position';
  const companyName = company.companyName || 'NextHire Partner';
  const jobType = job.jobType || 'Full-time';
  const location = job.location || 'Remote';

  return (
    <div className={styles.applicationCard}>
      <div className={styles.cardHeader}>
        <div className={styles.jobInfo}>
          <Link to={`/jobs/${job._id}`} className="hover:text-primary">
            <h3 className={styles.jobTitle}>{jobTitle}</h3>
          </Link>
          <p className={styles.companyName}>{companyName}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <Briefcase size={16} className={styles.detailIcon} />
          <span>{jobType}</span>
        </div>
        <div className={styles.detailItem}>
          <MapPin size={16} className={styles.detailIcon} />
          <span>{location}</span>
        </div>
        <div className={styles.detailItem}>
          <Calendar size={16} className={styles.detailIcon} />
          <span>Applied: {new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {status !== 'rejected' && (
        <div className={styles.timeline}>
          <h4 className={styles.timelineTitle}>Application Progress</h4>
          <div className={styles.timelineSteps}>
            {steps.map((step, idx) => {
              const isActive = idx <= currentStepIdx;
              return (
                <div key={step.id} className={`${styles.step} ${isActive ? styles.active : ''}`}>
                  <div className={styles.stepDot}>
                    {isActive ? <CheckCircle2 size={14} /> : null}
                  </div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const Briefcase = ({ size, className }) => (
  <Building size={size} className={className} />
);

export default ApplicationCard;
