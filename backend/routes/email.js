const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// Email sending endpoint
router.post('/send-appointment', async (req, res) => {
  try {
    const {
      companyName,
      phoneNumber,
      email,
      preferredDate,
      preferredTime,
      property,
      floor,
      additionalNotes
    } = req.body;

    console.log('📧 Received appointment request:', { 
      companyName, 
      email, 
      property, 
      floor,
      preferredDate,
      preferredTime,
      additionalNotes
    });

    // Validate required fields
    if (!companyName || !phoneNumber || !email || !preferredDate || !preferredTime || !property || !floor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️ SMTP not configured, skipping email sending');
    }

    // Try to send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        console.log('📬 Creating nodemailer transporter...');
        console.log('SMTP Config:', {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER
        });

        // Import nodemailer
        const nodemailer = require('nodemailer');

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });

        // Verify transporter configuration
        console.log('✅ Verifying SMTP connection...');
        await transporter.verify();
        console.log('✅ SMTP connection verified');

        // Format date without timezone conversion issues
        const formattedDate = new Date(preferredDate + 'T00:00:00').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        });

        // Format time to 12-hour format with AM/PM
        const formatTime = (timeString) => {
          const [hours, minutes] = timeString.split(':');
          const hour = parseInt(hours);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minutes} ${ampm}`;
        };

        const formattedTime = formatTime(preferredTime);

        // Use custom sender name with actual SMTP email
        // Format: "Display Name <email@address.com>"
        const fromEmail = `"CTP RED Corporation" <${process.env.SMTP_USER}>`;

        // Email to company
        const companyEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c41e3a;">New Appointment Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; width: 40%;">Company Name:</td>
                <td style="padding: 10px;">${companyName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Email:</td>
                <td style="padding: 10px;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Phone:</td>
                <td style="padding: 10px;">${phoneNumber}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 10px;">${formattedDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 10px;">${formattedTime}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Property:</td>
                <td style="padding: 10px;">${property}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Floor:</td>
                <td style="padding: 10px;">${floor}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Additional Notes:</td>
                <td style="padding: 10px;">${additionalNotes || 'N/A'}</td>
              </tr>
            </table>
          </div>
        `;

        // Email to sender (confirmation) - NOW INCLUDES ADDITIONAL NOTES
        const senderEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c41e3a;">Appointment Request Confirmation</h2>
            <p>Dear ${companyName},</p>
            <p>Thank you for your interest in CTP RED properties. We have received your appointment request with the following details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; width: 40%;">Date:</td>
                <td style="padding: 10px;">${formattedDate}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Time:</td>
                <td style="padding: 10px;">${formattedTime}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Property:</td>
                <td style="padding: 10px;">${property}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold;">Floor:</td>
                <td style="padding: 10px;">${floor}</td>
              </tr>
              ${additionalNotes ? `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Additional Notes:</td>
                <td style="padding: 10px;">${additionalNotes}</td>
              </tr>
              ` : ''}
            </table>
            <p>Our team will contact you within 24 hours to confirm your appointment.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666;">If you have any questions, please contact us at:</p>
            <p style="color: #666;"><strong>Phone:</strong> (02) 8334-2091<br>
            <strong>Email:</strong> aseantower@ctpred.com.ph</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>CTP RED Corporation</strong></p>
          </div>
        `;

        console.log('📤 Sending email to company:', process.env.COMPANY_EMAIL);
        // Send email to company
        await transporter.sendMail({
          from: fromEmail,
          to: process.env.COMPANY_EMAIL,
          subject: `New Appointment Request from ${companyName}`,
          html: companyEmailContent
        });
        console.log('✅ Company email sent');

        console.log('📤 Sending confirmation email to:', email);
        // Send confirmation email to sender
        await transporter.sendMail({
          from: fromEmail,
          to: email,
          subject: 'Appointment Request Confirmation - CTP RED',
          html: senderEmailContent
        });
        console.log('✅ Confirmation email sent');
      } catch (emailError) {
        console.error('⚠️ Email sending failed (non-critical):', emailError.message);
        // Continue to save in database even if email fails
      }
    }

    // Save to database for admin panel
    try {
      console.log('💾 Saving to database...');
      const insertQuery = `
        INSERT INTO appointments 
        (company_name, phone_number, email, preferred_date, preferred_time, property, floor, additional_notes, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `;
      
      await promisePool.query(insertQuery, [
        companyName,
        phoneNumber,
        email,
        preferredDate,
        preferredTime,
        property,
        floor,
        additionalNotes || ''
      ]);
      console.log('✅ Saved to database');
    } catch (dbError) {
      console.error('❌ Database error:', dbError.message);
      throw new Error('Failed to save appointment to database');
    }

    res.json({ 
      success: true, 
      message: 'Appointment request sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error processing appointment:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send appointment request. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
