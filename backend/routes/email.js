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

    console.log('📧 Received appointment request:', { companyName, email, property, floor });

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

        // Configure nodemailer transporter - NOTE: it's createTransport not createTransporter!
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

        const formattedDate = new Date(preferredDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Email to company
        const companyEmailContent = `
          <h2>New Appointment Request</h2>
          <p><strong>Company Name:</strong> ${companyName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Preferred Date:</strong> ${formattedDate}</p>
          <p><strong>Preferred Time:</strong> ${preferredTime}</p>
          <p><strong>Property:</strong> ${property}</p>
          <p><strong>Floor:</strong> ${floor}</p>
          <p><strong>Additional Notes:</strong> ${additionalNotes || 'N/A'}</p>
        `;

        // Email to sender (confirmation)
        const senderEmailContent = `
          <h2>Appointment Request Confirmation</h2>
          <p>Dear ${companyName},</p>
          <p>Thank you for your interest in CTP RED properties. We have received your appointment request with the following details:</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${preferredTime}</p>
          <p><strong>Property:</strong> ${property}</p>
          <p><strong>Floor:</strong> ${floor}</p>
          <p>Our team will contact you within 24 hours to confirm your appointment.</p>
          <p>If you have any questions, please contact us at:</p>
          <p>Phone: (02) 8334-2091</p>
          <p>Email: aseantower@ctpred.com.ph</p>
          <br>
          <p>Best regards,<br>CTP RED Corporation</p>
        `;

        console.log('📤 Sending email to company:', process.env.COMPANY_EMAIL);
        // Send email to company
        await transporter.sendMail({
          from: process.env.SMTP_FROM_EMAIL,
          to: process.env.COMPANY_EMAIL,
          subject: `New Appointment Request from ${companyName}`,
          html: companyEmailContent
        });
        console.log('✅ Company email sent');

        console.log('📤 Sending confirmation email to:', email);
        // Send confirmation email to sender
        await transporter.sendMail({
          from: process.env.SMTP_FROM_EMAIL,
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