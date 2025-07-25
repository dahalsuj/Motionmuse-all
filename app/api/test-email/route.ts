import { NextResponse } from "next/server";
import { sendTeamInvite } from "@/lib/email";

export async function POST(req: Request) {
  try {
    console.log('🔍 Testing email sending...');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
    console.log('SMTP_FROM:', process.env.SMTP_FROM || 'NOT SET');
    console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'NOT SET');
    
    const { testEmail } = await req.json();
    
    if (!testEmail) {
      return NextResponse.json({ error: "Please provide a test email address" }, { status: 400 });
    }
    
    const testData = {
      inviteeEmail: testEmail,
      inviterName: 'Test User',
      teamName: 'Test Team',
      inviteUrl: 'http://localhost:3000/join-team?token=test&team=test'
    };
    
    console.log('\n📧 Sending test invitation email...');
    const result = await sendTeamInvite(testData);
    
    console.log('✅ Email sending result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully",
      result: result
    });
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to send test email",
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 