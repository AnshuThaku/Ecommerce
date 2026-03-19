const router = require('express').Router();
const { protect }         = require('../../middleware/authMiddleware');
const { superAdminOnly }  = require('../../middleware/roleMiddleware');
const {
  createAdmin,
  getAllAdmins,
  toggleAdminStatus,
  deleteAdmin,
  getCompanyProfile,
  updateCompanyProfile,
  getAnalytics,
} = require('../../controllers/superAdminController/superAdminController');

// All routes require a valid JWT + Super-Admin role
router.use(protect, superAdminOnly);

// ── Admin management ──────────────────────────────────────
router.post  ('/create-admin',         createAdmin);
router.get   ('/all-admins',           getAllAdmins);
router.put   ('/:id/toggle-status',    toggleAdminStatus);
router.delete('/:id',                  deleteAdmin);

// ── Company profile ───────────────────────────────────────
router.get   ('/company-profile',      getCompanyProfile);
router.put   ('/company-profile',      updateCompanyProfile);

// ── Analytics ─────────────────────────────────────────────
router.get   ('/analytics',            getAnalytics);

module.exports = router;
