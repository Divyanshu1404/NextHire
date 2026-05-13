import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>{title}</p>
          <h3 className={styles.value}>{value}</h3>
        </div>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon size={24} className={styles.icon} />
          </div>
        )}
      </div>
      {trend && (
        <div className={styles.trend}>
          <span className={trend.isPositive ? styles.positive : styles.negative}>
            {trend.value}
          </span>
          <span className={styles.trendLabel}>{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
