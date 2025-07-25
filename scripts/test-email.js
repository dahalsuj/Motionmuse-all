import { sendTeamInvite } from '../lib/email.ts';

async function testEmailSending() {
  console.log('🔍 Testing email sending...');
  
  // Check environment variables
  console.log('Environment variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
  console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
  console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET');
  console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET');
  
  try {
    const testData = {
      inviteeEmail: 'test@example.com',
      inviterName: 'Test User',
      teamName: 'Test Team',
      inviteUrl: 'http://localhost:3000/join-team?token=test&team=test'
    };
    
    console.log('\n📧 Sending test invitation email...');
    const result = await sendTeamInvite(testData);
    
    console.log('✅ Email sending result:', result);
    console.log('✅ Email test completed successfully!');
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
}

testEmailSending(); 