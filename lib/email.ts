import nodemailer from 'nodemailer';

// const resendApiKey = process.env.RESEND_API_KEY;
// const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface InviteEmailData {
  inviteeEmail: string;
  inviterName: string;
  teamName: string;
  inviteUrl: string;
}

// Create transporter for Nodemailer
const createTransporter = () => {
  // For development/testing, you can use a service like Gmail, Outlook, or a service like Mailtrap
  // For production, you should use a proper SMTP service like SendGrid, Mailgun, etc.
  
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  return nodemailer.createTransport(smtpConfig);
};

export async function sendTeamInvite(data: InviteEmailData) {
  const transporter = createTransporter();
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Email sending is disabled.');
    console.log('=== INVITATION EMAIL WOULD BE SENT ===');
    console.log('To:', data.inviteeEmail);
    console.log('Subject: You\'ve been invited to join ' + data.teamName + ' on MotionMuse');
    console.log('Invitation URL:', data.inviteUrl);
    console.log('Inviter:', data.inviterName);
    console.log('Team:', data.teamName);
    console.log('=====================================');
    return { messageId: 'mock-email-id' };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'MotionMuse <noreply@motionmuse.com>',
    to: data.inviteeEmail,
    subject: `You've been invited to join ${data.teamName} on MotionMuse`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">MotionMuse</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Team Collaboration Platform</p>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">You've been invited!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            <strong>${data.inviterName}</strong> has invited you to join the team <strong>${data.teamName}</strong> on MotionMuse.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            MotionMuse is a powerful platform for creating, collaborating, and managing video content with your team.
          </p>
          <div style="text-align: center;">
            <a href="${data.inviteUrl}" 
               style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Accept Invitation
            </a>
          </div>
        </div>
        <div style="text-align: center; color: #999; font-size: 14px;">
          <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${data.inviteUrl}</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
          <p>This invitation was sent from MotionMuse. If you didn't expect this email, you can safely ignore it.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw new Error('Failed to send invitation email');
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const transporter = createTransporter();
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured. Email sending is disabled.');
    console.log('=== WELCOME EMAIL WOULD BE SENT ===');
    console.log('To:', email);
    console.log('Subject: Welcome to MotionMuse!');
    console.log('Name:', name);
    console.log('==================================');
    
    return { messageId: 'mock-email-id' };
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'MotionMuse <noreply@motionmuse.com>',
    to: email,
    subject: 'Welcome to MotionMuse!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MotionMuse!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Welcome to MotionMuse! We're excited to have you on board.
          </p>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Start creating amazing videos and collaborating with your team today.
          </p>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
               style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Get Started
            </a>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send welcome email');
  }
} 