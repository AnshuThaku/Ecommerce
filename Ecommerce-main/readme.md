

💎 Truee Luxury: Core Engine Documentation
Version 1.0.0 | Architecture: MERN Stack | Auth: Stateless JWT + RBAC

This document outlines the 10 foundational modules of the Truee Luxury ecosystem, detailing the "5W + How" of the platform's security, administration, and identity management.

🏗️ 1. Company Registration (One-Time Setup)
The "Big Bang" of the platform.

What: A specialized form that registers the business entity and the primary Super-Admin simultaneously.

Who: The Business Owner (one-time use).

When: Post-deployment, before any other action.

Where: POST /api/company/register → Frontend: /company/register

Why: Ensures no hardcoded credentials and validates access via email ownership.

How: 1.  Guard: Backend checks if a CompanyProfile exists. If YES, returns 403 Forbidden.
2.  Security: Generates a crypto-random temp password; hashes with bcrypt (Cost Factor 10).
3.  Persistence: Saves User { role: 'super-admin' } and CompanyProfile.
4.  Atomic Transaction: If the HTML credential email fails to send, the User and Company records are rolled back (deleted).

🔑 2. JWT Authentication
The stateless gatekeeper.

What: Token-based authentication valid for 7 days.

Who: Unified endpoint for Super-Admins, Admins, and Customers.

When: On every request to protected resources.

Where: POST /api/auth/login | authMiddleware.js

Why: Eliminates server-side session bloat and scales horizontally.

How:

Validation: Checks isActive === true and compares bcrypt hashes.

Issuance: Signs JWT containing only the user._id.

Verification: authMiddleware extracts the Bearer token, verifies the signature, and populates req.user (excluding the password).

🔒 3. First-Login Password Change
Closing the security loop.

What: Mandatory password rotation for new administrative accounts.

Who: Any Admin/Super-Admin with isFirstLogin: true.

When: Immediately after the first successful login.

Where: PUT /api/auth/update-password → Frontend: /admin/setup-password

Why: Mitigates the risk of plain-text temporary passwords sitting in email inboxes.

How: 1.  Frontend validates newPassword === confirmPassword.
2.  Backend verifies currentPassword against the DB.
3.  Updates hash and flips isFirstLogin to false.

🛡️ 4. Role-Based Access Control (RBAC)
Hierarchical permission enforcement.

What: A 3-tier system: super-admin > admin > customer.

Who: Enforced across all protected routes.

Where: roleMiddleware.js (Node) | ProtectedRoute.jsx (React)

Why: Prevents standard admins from altering company sensitive data or creating other staff.

How:

Backend: router.use(protect, superAdminOnly) checks req.user.role.

Frontend: ProtectedRoute checks the AuthContext state; unauthorized users are redirected to /unauthorized.

👥 5. Admin Management (Create/Suspend/Delete)
Staff lifecycle control.

What: Super-Admin tools to manage the workforce.

Who: Super-Admin exclusive.

Where: POST /api/admin/create-admin | DELETE /api/admin/:id

How:

Creation: Similar to Company Registration—auto-generates credentials and emails the user.

Suspension: A toggle on isActive. On the next request, the JWT middleware rejects the user.

Deletion: Permanent removal. The authMiddleware will fail to find the user in the DB, instantly voiding their token.

🏢 6. Company Profile Management
The "Source of Truth" for the brand.

What: Management of GST, PAN, Bank details, and Branding.

Who: Super-Admin only.

Where: GET/PUT /api/admin/company-profile

Why: These details are dynamically injected into invoices and legal headers.

How: 1.  GET request pre-fills the form via CompanyProfile.findOne().
2.  PUT request updates fields using { runValidators: true } to ensure GST/Email formats remain valid.

📊 7. Analytics Dashboard
Real-time platform oversight.

What: Visual summary of users and company status.

Where: GET /api/admin/analytics

How: To optimize performance, the backend executes 6 parallel queries using Promise.all():

Counts for Admins (Active/Inactive).

Counts for Customers (Active/Inactive).

Company metadata (Brand name, creation date).

🔌 8. AuthContext & Axios Interceptors
The frontend "Central Nervous System".

What: Global state for the user and an automated HTTP client.

Where: AuthContext.jsx | utils/axiosInstance.js

Why: Automates token attachment and handles "Session Expired" logic globally.

How:

Context: Syncs localStorage with React state so the UI stays reactive to login/logout.

Axios: An interceptor injects Authorization: Bearer <token> into every request. If a 401 Unauthorized is received, it triggers a global logout.

🚧 9. ProtectedRoute Component
The Client-Side Guard.

What: A wrapper component for React Router.

Where: src/components/ProtectedRoute.jsx

How: ```javascript
<ProtectedRoute roles={['super-admin']}>
<AdminManagement />
</ProtectedRoute>

If the user is missing or the role doesn't match the allowed array, the component prevents rendering and redirects the user.

🚀 Implementation Summary Table
Module	Access Level	Primary Tech	Primary Logic
Registration	Public (Once)	Bcrypt + NodeMailer	Guard: Company.count() === 0
Auth	All Users	JWT + Axios Interceptors	7-day stateless tokens
RBAC	Super/Admin	Middleware	req.user.role validation
Profile	Super-Admin	Mongoose Schema	Single-document persistence
Analytics	Super-Admin	Promise.all()	Multi-collection aggregatio