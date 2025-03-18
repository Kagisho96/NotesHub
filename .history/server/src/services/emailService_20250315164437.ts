import nodemailer from "nodemailer";

class EmailService {
  private transporter: nodemailer.Transporter;
  
  constructor() {
    // Create a test account at https://ethereal.email/
    this.initialize();
  }
  
  private async initialize() {
    // Generate a test account with Ethereal
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter using the test account
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    console.log('Ethereal Email configured with account:', testAccount.user);
    console.log('View emails at: https://ethereal.email/login');
    console.log('Username:', testAccount.user);
    console.log('Password:', testAccount.pass);
  }
  
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: '"NotesHub" <noreply@noteshub.com>',
        to: email,
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
      });
      
      console.log(`OTP sent to ${email}, preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export default new EmailService(); 