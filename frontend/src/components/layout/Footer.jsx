import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageSquare, Heart, Share2 } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          <div className={styles.footerInfo}>
            <div className={styles.logo}>
              <span className={styles.logoText}>Next<span className="text-primary">Hire</span></span>
            </div>
            <p className={styles.description}>
              Connecting talent with opportunities. Your one-stop destination for finding the perfect job or the perfect candidate.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}><Globe size={20} /></a>
              <a href="#" className={styles.socialLink}><MessageSquare size={20} /></a>
              <a href="#" className={styles.socialLink}><Share2 size={20} /></a>
              <a href="#" className={styles.socialLink}><Heart size={20} /></a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.heading}>For Candidates</h4>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/dashboard/applications">My Applications</Link></li>
              <li><Link to="/jobs">Job Alerts</Link></li>
            </ul>
          </div>

          <div className={styles.footerLinks}>
            <h4 className={styles.heading}>For Employers</h4>
            <ul>
              <li><Link to="/employer/register">Post a Job</Link></li>
              <li><Link to="/employer/login">Employer Dashboard</Link></li>
              <li><Link to="/employer/register">Hire Talent</Link></li>
            </ul>
          </div>

          <div className={styles.footerContact}>
            <h4 className={styles.heading}>Contact Us</h4>
            <div className={styles.contactItem}>
              <Mail size={18} />
              <span>support@nexthire.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={18} />
              <span>+91 9506880176</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={18} />
              <span>Tech Hub, Noida, Uttar Pradesh, India</span>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} NextHire. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
