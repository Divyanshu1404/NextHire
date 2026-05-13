import React from 'react';
import styles from './Jobs.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.jobCard}>
      <div className={styles.cardHeader}>
        <div className={styles.companyLogoSkeleton}></div>
        <div className={styles.jobHeaderInfo}>
          <div className={`${styles.skeletonText} ${styles.w3_4} ${styles.h6}`}></div>
          <div className={`${styles.skeletonText} ${styles.w1_2} ${styles.mt2}`}></div>
        </div>
      </div>
      <div className={styles.jobTags}>
        <div className={styles.skeletonTag}></div>
        <div className={styles.skeletonTag}></div>
        <div className={styles.skeletonTag}></div>
      </div>
      <div className={styles.cardFooter}>
        <div className={`${styles.skeletonText} ${styles.w1_3}`}></div>
        <div className={styles.skeletonBtn}></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
