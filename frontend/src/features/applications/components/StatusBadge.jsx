import React from 'react';
import Badge from '../../../components/ui/Badge';
import { APPLICATION_STATUS } from '../../../constants/status';

const StatusBadge = ({ status }) => {
  let variant = 'default';
  let label = status.replace('_', ' ');

  switch (status) {
    case APPLICATION_STATUS.APPLIED:
      variant = 'info';
      break;
    case APPLICATION_STATUS.SHORTLISTED:
    case APPLICATION_STATUS.UNDER_REVIEW:
    case APPLICATION_STATUS.ASSESSMENT_SENT:
      variant = 'warning';
      break;
    case APPLICATION_STATUS.SELECTED:
      variant = 'success';
      break;
    case APPLICATION_STATUS.REJECTED:
      variant = 'danger';
      break;
    default:
      variant = 'default';
  }

  return <Badge variant={variant}>{label}</Badge>;
};

export default StatusBadge;
