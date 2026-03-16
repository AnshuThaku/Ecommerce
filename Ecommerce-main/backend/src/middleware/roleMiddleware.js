// Restrict to admins or super-admins
exports.adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'super-admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
  }
  next();
};

// Restrict to super-admin only
exports.superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'super-admin') {
    return res.status(403).json({ success: false, error: 'Access denied. Super-Admin only.' });
  }
  next();
};
