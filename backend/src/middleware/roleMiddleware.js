// Restrict to admins or super-admins
exports.adminOnly = (req, res, next) => {
  console.log('🔍 Admin Role Check:');
  console.log('   req.user:', req.user);
  console.log('   req.user?.role:', req.user?.role);
  console.log('   Is admin:', req.user?.role === 'admin' || req.user?.role === 'super-admin');
  
  if (!req.user || !['admin', 'super-admin'].includes(req.user.role)) {
    console.log('   ❌ ACCESS DENIED - Role is not admin/super-admin');
    return res.status(403).json({ success: false, error: 'Access denied. Admins only.' });
  }
  console.log('   ✅ ACCESS ALLOWED');
  next();
};

// Restrict to super-admin only
exports.superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'super-admin') {
    return res.status(403).json({ success: false, error: 'Access denied. Super-Admin only.' });
  }
  next();
};
