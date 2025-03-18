import sgMail from "@sendgrid/mail";

class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }
  
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const msg = {
        to: email,
        from: 'noreply@yourdomain.com', // Use a verified sender
        subject: 'Your Verification Code',
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">NotesHub Verification</h2>
            <p>Please use the following code to verify your email address:</p>
            <div style="background-color: #f4f4f8; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        `
      };
      
      await sgMail.send(msg);
      console.log(`OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export default new EmailService(); 