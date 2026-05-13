import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './Jobs.module.css';

const JobFilters = ({ filters, onFilterChange }) => {
  return (
    <div className={styles.filtersCard}>
      <div className={styles.filtersHeader}>
        <Filter size={20} />
        <h3 className={styles.filtersTitle}>Filters</h3>
      </div>
      
      <div className={styles.filterGroup}>
        <Input
          placeholder="Job title or keyword"
          value={filters.keyword || ''}
          onChange={(e) => onFilterChange('keyword', e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Location</label>
        <Input
          placeholder="City, state, or Remote"
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Job Type</label>
        <select 
          className={styles.filterSelect}
          value={filters.jobType || ''}
          onChange={(e) => onFilterChange('jobType', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <Button variant="primary" fullWidth className="mt-4">
        Apply Filters
      </Button>
    </div>
  );
};

export default JobFilters;
