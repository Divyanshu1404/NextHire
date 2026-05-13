import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, Building, Users, ArrowRight, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import styles from './Home.module.css';
import { jobsAPI } from '../services/api';

const Home = () => {
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, statsRes] = await Promise.all([
          jobsAPI.getAllJobs(),
          jobsAPI.getPublicStats()
        ]);
        
        const allJobs = jobsRes.data?.data?.jobs || jobsRes.data?.data || [];
        setLatestJobs(Array.isArray(allJobs) ? allJobs.slice(0, 4) : []);
        
        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div className={styles.home}>
      
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Find Your <span className="text-primary">Dream Job</span> Today
            </h1>
            <p className={styles.subtitle}>
              Connect with top employers and discover opportunities that match your skills and aspirations.
            </p>
            
            <form className={styles.searchBox} onSubmit={handleSearch}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className={styles.searchBtn}>Find Jobs</Button>
            </form>
            
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <h3 className={styles.statNumber}>{stats.jobs > 1000 ? `${(stats.jobs/1000).toFixed(1)}k+` : stats.jobs}</h3>
                <p className={styles.statLabel}>Active Jobs</p>
              </div>
              <div className={styles.statItem}>
                <h3 className={styles.statNumber}>{stats.companies > 1000 ? `${(stats.companies/1000).toFixed(1)}k+` : stats.companies}</h3>
                <p className={styles.statLabel}>Companies</p>
              </div>
              <div className={styles.statItem}>
                <h3 className={styles.statNumber}>{stats.candidates > 1000 ? `${(stats.candidates/1000).toFixed(1)}k+` : stats.candidates}</h3>
                <p className={styles.statLabel}>Candidates</p>
              </div>
            </div>
          </div>
          
          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImage}>
              <div className={styles.floatingCard1}>
                <Briefcase className="text-primary" size={24} />
                <div>
                  <h4>{latestJobs[0]?.title || 'UI/UX Designer'}</h4>
                  <p>{latestJobs[0]?.companyId?.companyName || 'NextHire Partner'} • {latestJobs[0]?.location || 'Remote'}</p>
                </div>
              </div>
              <div className={styles.floatingCard2}>
                <div className={styles.successBadge}>Selected</div>
                <p>Congratulations!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.latestJobs}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Latest Opportunities</h2>
              <p style={{ color: 'var(--text-muted)' }}>Hand-picked jobs for you</p>
            </div>
            <Link to="/jobs" style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              View All Jobs <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}><Loader /></div>
          ) : latestJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No jobs posted yet. Be the first to post!</p>
            </div>
          ) : (
            <div className={styles.jobGrid}>
              {latestJobs.map(job => (
                <Link key={job._id} to={`/jobs/${job._id}`} className={styles.jobCard}>
                  <div className={styles.jobCardHeader}>
                    <div className={styles.companyLogo}>
                      <Building size={24} />
                    </div>
                    <div>
                      <h3 className={styles.jobTitle}>{job.title}</h3>
                      <p className={styles.companyName}>{job.companyId?.companyName || 'NextHire Partner'}</p>
                    </div>
                  </div>
                  <div className={styles.jobDetails}>
                    <div className={styles.jobDetailItem}>
                      <MapPin size={16} /> {job.location}
                    </div>
                    <div className={styles.jobDetailItem}>
                      <Clock size={16} /> {job.jobType}
                    </div>
                  </div>
                  <div className={styles.jobCardFooter}>
                    <div className={styles.salary}>
                      {job.salaryRange?.min ? `₹${job.salaryRange.min/1000}k - ₹${job.salaryRange.max/1000}k` : 'Competitive Pay'}
                    </div>
                    <Button variant="ghost" size="sm">Apply Now</Button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose NextHire?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Search size={28} />
              </div>
              <h3 className={styles.featureTitle}>Smart Matching</h3>
              <p className={styles.featureDesc}>Our algorithm matches your profile with the best-fit opportunities automatically.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Building size={28} />
              </div>
              <h3 className={styles.featureTitle}>Top Companies</h3>
              <p className={styles.featureDesc}>Get hired by verified companies passing our strict KYC verification process.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={28} />
              </div>
              <h3 className={styles.featureTitle}>Transparent Process</h3>
              <p className={styles.featureDesc}>Track your application status in real-time through our multi-stage pipeline.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`container ${styles.ctaContainer}`}>
          <div className={styles.ctaContent}>
            <h2>Ready to hire top talent?</h2>
            <p>Join thousands of companies building their dream teams.</p>
            <Link to="/employer/register">
              <Button variant="secondary" size="lg">Post a Job Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
