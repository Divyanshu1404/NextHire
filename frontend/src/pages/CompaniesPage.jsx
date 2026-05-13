import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Globe, ChevronRight } from 'lucide-react';
import { companyAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await companyAPI.getAllApprovedCompanies();
        setCompanies(res.data?.data?.companies || []);
      } catch (error) {
        console.error('Error fetching companies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Top Companies Hiring
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Explore verified companies and startups looking for top talent like you. 
          Discover your next workplace today.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : companies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)' }}>
          <Building size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Companies Found</h2>
          <p style={{ color: 'var(--text-muted)' }}>There are currently no verified companies listed on the platform.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {companies.map(company => (
            <div key={company._id} style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius-xl)', 
              border: '1px solid var(--border)', 
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <div style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-lg)', background: company.logoUrl ? 'transparent' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Building size={32} color="var(--primary)" />
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {company.companyName}
                </h3>
                {company.website && (
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', textDecoration: 'none' }}
                     onClick={(e) => e.stopPropagation()}
                  >
                    <Globe size={16} /> 
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {company.website.replace(/^https?:\/\//, '')}
                    </span>
                  </a>
                )}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => navigate(`/jobs?companyId=${company._id}`)}
                  style={{ color: 'var(--primary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  View Open Roles <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;
