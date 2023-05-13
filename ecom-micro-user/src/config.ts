export const EMAIL_HTML = (token: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px;">
      <h1 style="font-size: 24px; color: #333; text-align: center;">Password Reset Request</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        We have received a request to reset your password. If you didn't make this request, please ignore this email.
      </p>
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        To reset your password, please click the button below:
      </p>
      <div style="text-align: center;">
        <a href="https://yourwebsite.com/reset-password?token=${token}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px; margin-top: 10px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; line-height: 1.5; color: #666; text-align: center; margin-top: 20px;">
        If you can't click the button, please copy and paste the following link into your browser's address bar:
      </p>
      <p style="font-size: 14px; line-height: 1.5; color: #666; text-align: center; word-break: break-all;">
        https://yourwebsite.com/reset-password?token=${token}
      </p>
    </div>
  `;
};

export default () => ({

  name: 'ecom-micro-product Api',
  version: '1.0.0',
  host: process.env.APP_HOST || '',
  port: +(process.env.APP_PORT || '0'),
  urlPrefix: process.env.APP_URL_PREFIX || '',
  environment: process.env.NODE_ENV || 'development',
  project_dir: __dirname,
  elastic_search_node: process.env.ELASTICSEARCH_NODE_URL || 'http://localhost:9200',
  jwt_secret: process.env.JWT_SECRET || 'your-secret-key'
  email: {
    from: process.env.EMAIL_FROM || '',
    subject: process.env.EMAIL_SUBJECT || '',
    smtpHost: process.env.EMAIL_SMTP_HOST || '',
    smtpPort: process.env.EMAIL_SMTP_PORT || '0',
    smtpUser: process.env.EMAIL_AUTH_USER || '',
    smtpPassword: process.env.EMAIL_AUTH_PASS || '',
  }

});