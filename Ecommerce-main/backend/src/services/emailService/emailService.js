const transporter = require('../../config/mailConfig/mailConfig');
const sendWelcomeEmail = async (companyEmail, founderName, tempPassword) => {
  await transporter.sendMail({
    from: `"Truee Luxury Support" <${process.env.EMAIL_USER}>`,
    to: companyEmail,
    subject: 'Welcome to Truee Luxury – Your Admin Credentials',
    html: `
      <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#0A0A0A;padding:30px;text-align:center;color:#ffffff;border-bottom: 4px solid #C8A253;">
                    <h2 style="margin:0; font-family: Georgia, serif; font-size: 28px; color: #C8A253;">Truee Luxury</h2>
                    <p style="margin:5px 0 0;font-size:14px; letter-spacing: 1px;">E-Commerce Administration</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;color:#333333;">
                    <p style="font-size:16px;margin-bottom:15px;">
                      Dear <strong>${founderName}</strong>,
                    </p>
                    <p style="font-size:15px;line-height:1.6;">
                      Welcome to <strong>Truee Luxury</strong>. 
                      Your company profile and super-admin account have been successfully generated.
                    </p>
                    <div style="background:#f9f9f9;border-left:4px solid #C8A253;padding:20px;margin:25px 0;border-radius:4px;">
                      <h3 style="margin-top: 0; color: #0A0A0A;">Your Access Credentials</h3>
                      <p style="margin:10px 0;"><strong>Login Email:</strong> ${companyEmail}</p>
                      <p style="margin:10px 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #e0e0e0; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 16px;">${tempPassword}</span></p>
                    </div>
                    <p style="font-size:14px;line-height:1.6;color:#555;">
                      <em>Security Notice:</em> For security reasons, you will be required to change your password 
                      upon your first login to the admin dashboard.
                    </p>
                    <p style="margin-top:30px;">
                      Best Regards,<br/>
                      <strong>Truee Luxury Support Team</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#1A1A1A;padding:20px;text-align:center;font-size:12px;color:#C8A253;">
                    © ${new Date().getFullYear()} Truee Luxury. All Rights Reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      `
  });
};

const sendAdminCreationEmail = async (email, name, tempPassword) => {
  await transporter.sendMail({
    from:    `"Truee Luxury Support" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: 'Your Truee Luxury Admin Account',
    html: `
        <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);">
            <tr><td style="background:#0A0A0A;padding:28px;text-align:center;border-bottom:4px solid #C8A253;">
              <h2 style="margin:0;color:#C8A253;font-family:Georgia,serif;">Truee Luxury</h2>
              <p style="margin:4px 0 0;color:#fff;font-size:13px;letter-spacing:1px;">Admin Account Created</p>
            </td></tr>
            <tr><td style="padding:30px;color:#333;">
              <p style="font-size:16px;">Dear <strong>${name}</strong>,</p>
              <p>You have been added as an <strong>Admin</strong> on Truee Luxury platform.</p>
              <div style="background:#f9f9f9;border-left:4px solid #C8A253;padding:20px;margin:20px 0;border-radius:4px;">
                <p style="margin:8px 0;"><strong>Login Email:</strong> ${email}</p>
                <p style="margin:8px 0;"><strong>Temporary Password:</strong>
                  <span style="font-family:monospace;background:#e0e0e0;padding:4px 8px;border-radius:4px;font-weight:bold;">${tempPassword}</span>
                </p>
              </div>
              <p style="font-size:13px;color:#666;">You will be prompted to set a new password on first login.</p>
              <p style="margin-top:28px;">Regards,<br/><strong>Truee Luxury Team</strong></p>
            </td></tr>
            <tr><td style="background:#1A1A1A;padding:16px;text-align:center;font-size:12px;color:#C8A253;">
              © ${new Date().getFullYear()} Truee Luxury. All Rights Reserved.
            </td></tr>
          </table>
        </div>`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAdminCreationEmail
};
