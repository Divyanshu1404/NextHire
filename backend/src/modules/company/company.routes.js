import express from 'express';
import { registerCompany, getCompany, addTeamMember, getCompanyStats, getTeam, getApprovedCompanies, updateCompany, deleteCompany } from './company.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorizeRoles } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { registerCompanySchema, addTeamMemberSchema, updateCompanySchema } from './company.validation.js';
import { ROLES } from '../../constants/roles.js';

const router = express.Router();

// Public
router.get('/', getApprovedCompanies);

// Register (Static)
router.post('/register', protect, validate(registerCompanySchema), registerCompany);

// Dashboard & Team (Static - Unique names to avoid :id conflict)
router.get('/dashboard/stats', protect, getCompanyStats);
router.get('/team/all', protect, authorizeRoles(ROLES.COMPANY_ADMIN), getTeam);
router.post('/team/add', protect, authorizeRoles(ROLES.COMPANY_ADMIN), validate(addTeamMemberSchema), addTeamMember);

// Update company (company admin or super admin)
router.put('/:id', protect, authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.SUPER_ADMIN), validate(updateCompanySchema), updateCompany);

// Delete company (super admin only)
router.delete('/:id', protect, authorizeRoles(ROLES.SUPER_ADMIN), deleteCompany);

// Get company by ID (Dynamic - Must be at the bottom)
router.get('/:id', getCompany);

export default router;
