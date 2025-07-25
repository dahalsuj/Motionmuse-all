# Motionmuse
# MotionMuse - Team Collaboration Platform

A powerful platform for creating, collaborating, and managing video content with your team.

## Features

- **Team Management**: Create teams and invite members
- **Video Creation**: Generate and edit videos
- **Brand Kits**: Manage brand assets and templates
- **Enterprise Dashboard**: Advanced team collaboration features
- **User Management**: Invite and manage team members

## Email Setup (Required for Team Invitations)

To enable team invitation emails, you need to set up SMTP email service:

### 1. Configure SMTP Settings

You can use any SMTP service like Gmail, Outlook, SendGrid, Mailgun, etc. Add the following to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=MotionMuse <noreply@motionmuse.com>

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Gmail Setup Example

If using Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password (Google Account → Security → App Passwords)
3. Use the App Password as `SMTP_PASS`

### 3. Production Setup

For production, use a proper email service like:
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **Amazon SES**: `email-smtp.us-east-1.amazonaws.com:587`

### 4. Test Email Functionality

Without SMTP credentials, the system will log invitation details to the console instead of sending emails.

## Team Invitation Flow

1. **Admin invites user**: Admin clicks "Invite Member" and enters email
2. **Email sent**: System sends invitation email with unique link
3. **User clicks link**: User visits `/join-team?token=xxx&team=yyy`
4. **User joins**: User enters name and joins the team
5. **Redirect to dashboard**: User is redirected to enterprise dashboard

## Development

```bash
npm install
npm run dev
```

## Environment Variables

```env
# Database (with connection pool settings)
DATABASE_URL="postgresql://username:password@localhost:5432/motionmuse?connection_limit=20&pool_timeout=30"
DIRECT_URL="postgresql://username:password@localhost:5432/motionmuse?connection_limit=20&pool_timeout=30"

# Email Service (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
SMTP_FROM="MotionMuse <noreply@motionmuse.com>"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Troubleshooting

### Database Connection Issues

If you encounter connection pool timeout errors, try:

1. **Test database connection:**
   ```bash
   npm run test-db
   ```

2. **Check your DATABASE_URL** includes connection pool parameters:
   ```
   ?connection_limit=20&pool_timeout=30
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```