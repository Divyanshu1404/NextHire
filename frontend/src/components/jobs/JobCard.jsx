import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import styles from './Jobs.module.css';

const JobCard = ({ job, onApply, hasApplied }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const isCandidate = !isAuthenticated || user?.role === 'user';
  
  return (
    <div className={styles.jobCard}>
      <div className={styles.cardHeader}>
        <div className={styles.companyLogo}>
          {job.companyId?.logoUrl ? (
            <img src={job.companyId.logoUrl} alt={job.companyId.companyName || 'Company'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            job.companyId?.companyName?.charAt(0) || 'C'
          )}
        </div>
        <div className={styles.jobHeaderInfo}>
          <Link to={`/jobs/${job._id}`} className={styles.jobTitleLink}>
            <h3 className={styles.jobTitle}>{job.title}</h3>
          </Link>
          <p className={styles.companyName}>{job.companyId?.companyName || 'NextHire Partner'}</p>
        </div>
      </div>
      
      <div className={styles.jobTags}>
        <div className={styles.tag}>
          <MapPin size={14} />
          <span>{job.location || 'Remote'}</span>
        </div>
        <div className={styles.tag}>
          <Briefcase size={14} />
          <span>{job.jobType || 'Full-time'}</span>
        </div>
        <div className={styles.tag}>
          <DollarSign size={14} />
          <span>
            {job.salaryRange?.min 
              ? `₹${job.salaryRange.min/1000}k - ₹${job.salaryRange.max/1000}k` 
              : 'Not specified'}
          </span>
        </div>
        <div className={styles.tag}>
          <Clock size={14} />
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className={styles.skills}>
        {job.skills?.slice(0, 3).map((skill, index) => (
          <Badge key={index} variant="default">{skill}</Badge>
        ))}
        {job.skills?.length > 3 && (
          <Badge variant="default">+{job.skills.length - 3}</Badge>
        )}
      </div>

      <div className={styles.cardFooter}>
        <Link to={`/jobs/${job._id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
        {isCandidate && (
          <Button 
            variant={hasApplied ? "secondary" : "primary"} 
            size="sm" 
            onClick={(e) => {
              e.preventDefault();
              if (!hasApplied) onApply(job);
            }}
            disabled={hasApplied}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
