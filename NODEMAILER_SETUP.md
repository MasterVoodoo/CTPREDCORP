# Nodemailer Setup Instructions for Appointment Scheduling

This guide will help you set up the email functionality for the appointment scheduling feature using Nodemailer.

## Overview

The appointment scheduling system now uses **Nodemailer** to send emails to:
1. **Company email** (aseantower@ctpred.com.ph) - Notification of new appointment requests
2. **Customer email** - Confirmation of their appointment request
3. **Admin database** - Stores all appointments for the admin panel

## Backend Setup

### 1. Install Dependencies

Navigate to the backend folder and install nodemailer:

```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment Variables

Create or update your `backend/.env` file with the following SMTP settings:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ctpredcorp_db
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Settings
CLIENT_URL=http://localhost:5173

# SMTP Configuration for Email Sending
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@ctpred.com.ph
COMPANY_EMAIL=aseantower@ctpred.com.ph
```

### 3. Gmail Configuration (Recommended)

If using Gmail:

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "CTP RED Appointment System"
   - Copy the generated 16-character password
3. Use this app password in `SMTP_PASSWORD`

### 4. Alternative SMTP Providers

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

**Outlook/Office365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your_password
```

**Custom SMTP Server:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your_password
```

### 5. Create Database Table

Run the migration to create the appointments table:

```bash
mysql -u root -p ctpredcorp_db < backend/database/migrations/create_appointments_table.sql
```

Or manually create the table:

```sql
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  property VARCHAR(255) NOT NULL,
  floor VARCHAR(50) NOT NULL,
  additional_notes TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_preferred_date (preferred_date),
  INDEX idx_created_at (created_at)
);
```

### 6. Start Backend Server

```bash
cd backend
npm run dev
```

The server should display:
```
📧 Email API: http://localhost:5000/api/email
```

## Frontend Setup

### 1. Environment Configuration

The frontend `.env` file should already be set up:

**Development (`.env`):**
```env
VITE_API_URL=http://localhost:5000
```

**Production (`.env.production`):**
```env
VITE_API_URL=https://ctpred.com.ph
```

### 2. Start Frontend

```bash
npm run dev
```

## Testing

### 1. Test the Email Functionality

1. Navigate to the Schedule Appointment page
2. Fill in all required fields
3. Submit the form
4. Check for:
   - Success popover appears in the top-right corner
   - Toast notification appears
   - Form is reset
   - Email sent to company inbox
   - Confirmation email sent to customer
   - Entry created in database

### 2. Test Email Sending Manually

You can test the email endpoint directly:

```bash
curl -X POST http://localhost:5000/api/email/send-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "phoneNumber": "555-1234",
    "email": "test@example.com",
    "preferredDate": "2026-03-01",
    "preferredTime": "10:00",
    "property": "CTP Asean Tower",
    "floor": "5th Floor",
    "additionalNotes": "Test appointment"
  }'
```

### 3. Verify Database Entry

```sql
SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5;
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials**: Verify username and password are correct
2. **Check firewall**: Ensure port 587 (or 465) is not blocked
3. **Check Gmail security**: If using Gmail, ensure "Less secure app access" is enabled or use App Password
4. **Check logs**: Look at backend console for error messages

### CORS Errors

If you see CORS errors in the browser console:

1. Verify `CLIENT_URL` in `backend/.env` matches your frontend URL
2. Check the backend console for blocked origins
3. Restart the backend server after changing environment variables

### Database Errors

If appointments aren't being saved:

1. Verify database connection settings in `backend/.env`
2. Ensure the `appointments` table exists
3. Check database user has INSERT permissions

## Production Deployment

### 1. Update Production Environment Variables

On your production server, update `backend/.env.production`:

```env
NODE_ENV=production
CLIENT_URL=https://ctpred.com.ph
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
SMTP_PASSWORD=your-production-password
COMPANY_EMAIL=aseantower@ctpred.com.ph
```

### 2. SSL Certificate

Make sure your SSL certificate (the one we fixed earlier!) is valid to ensure the API endpoint works properly.

### 3. Test Production

After deploying:
1. Submit a test appointment through the live website
2. Verify emails are received
3. Check database entries
4. Monitor backend logs for any errors

## Features

✅ **Nodemailer Integration** - Professional email sending
✅ **Dual Email Sending** - Company notification + customer confirmation
✅ **Database Storage** - All appointments saved for admin panel
✅ **Success Popover** - Beautiful UI feedback
✅ **Environment Variables** - Separate dev/production configs
✅ **Error Handling** - Graceful error messages
✅ **Form Validation** - Client-side and server-side validation

## Need Help?

If you encounter any issues:

1. Check the backend console logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test SMTP credentials with a simple nodemailer test script
5. Ensure database table exists and is accessible

## Next Steps

Consider adding:
- Email templates with HTML/CSS styling
- Email attachments (PDFs, brochures)
- Calendar invites (.ics files)
- SMS notifications via Twilio
- Admin panel to view/manage appointments
- Automated reminder emails