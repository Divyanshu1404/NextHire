import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/thunks/jobThunks';
import { fetchMyApplications } from '../../store/thunks/applicationThunks';
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
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    companyId: companyIdFromQuery,
  });

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { jobs, loading } = useSelector(state => state.jobs);
  const { myApplications } = useSelector(state => state.applications);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    dispatch(fetchJobs(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'user') {
      dispatch(fetchMyApplications());
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, companyId: companyIdFromQuery }));
  }, [companyIdFromQuery]);

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
            // Optionally dispatch fetchMyApplications here to update immediate state
            dispatch(fetchMyApplications());
          }}
        />
      )}
    </div>
  );
};

export default JobsPage;
