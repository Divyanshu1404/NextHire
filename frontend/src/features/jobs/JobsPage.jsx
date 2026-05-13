import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsAPI, applicationAPI } from '../../services/api';
import { useSelector } from 'react-redux';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import SkeletonCard from '../../components/jobs/SkeletonCard';
import EmptyState from '../../components/ui/EmptyState';
import ApplyModal from '../applications/components/ApplyModal';
import { Search } from 'lucide-react';
import styles from '../../components/jobs/Jobs.module.css';

const JobsPage = () => {
  const [searchParams] = useSearchParams();
  const companyIdFromQuery = searchParams.get('companyId') || '';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    companyId: companyIdFromQuery,
  });
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, companyId: companyIdFromQuery }));
  }, [companyIdFromQuery]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getAllJobs(filters);
      const jobList = response.data?.data?.jobs || response.data?.data || [];
      setJobs(Array.isArray(jobList) ? jobList : []);
      
      if (isAuthenticated && user?.role === 'user') {
        const appRes = await applicationAPI.getMyApplications();
        const apps = appRes.data?.data?.applications || appRes.data?.data || [];
        setMyApplications(apps);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="container">
      <div className={styles.jobsContainer}>
        <aside>
          <JobFilters filters={filters} onFilterChange={handleFilterChange} />
        </aside>
        
        <main>
          <div className={styles.jobsHeader}>
            <h1 className={styles.jobsTitle}>
              {loading ? 'Finding jobs...' : `${jobs.length} Jobs Found`}
            </h1>
          </div>

          <div className={styles.jobsGrid}>
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : jobs.length > 0 ? (
              jobs.map(job => {
                const hasApplied = myApplications.some(app => 
                  (app.jobId?._id || app.jobId) === job._id
                );
                return (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    onApply={handleApplyClick} 
                    hasApplied={hasApplied}
                  />
                );
              })
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <EmptyState 
                  icon={Search}
                  title="No jobs found"
                  description="We couldn't find any jobs matching your current filters. Try adjusting your search criteria."
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedJob && (
        <ApplyModal 
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={selectedJob._id}
          jobTitle={selectedJob.title}
          companyName={selectedJob.companyId?.companyName || 'NextHire Partner'}
          onSuccess={() => {
            setIsApplyModalOpen(false);
            alert('Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
};

export default JobsPage;
