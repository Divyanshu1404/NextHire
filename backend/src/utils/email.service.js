import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, 
      pass: process.env.SMTP_PASS, 
    },
  });
};

export const sendAssessmentEmail = async (candidateEmail, candidateName, jobTitle, companyName, assessmentLink) => {
  try {
    const transporter = createTransporter();

    // If SMTP details are not configured, log a warning (useful for dev without env vars)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ SMTP credentials not found in .env! Simulating email send...");
      console.log(`\n📧 EMAIL SIMULATION:
To: ${candidateEmail}
Subject: Assessment Link for ${jobTitle} at ${companyName}
Body: Hi ${candidateName},\n\nYou have been selected for the next round for the position of ${jobTitle} at ${companyName}.\nPlease complete your assessment using the following link:\n\n${assessmentLink}\n\nBest regards,\n${companyName} Hiring Team\n`);
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"${companyName} Hiring Team" <${process.env.SMTP_USER}>`,
      to: candidateEmail,
      subject: `Assessment Link for ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e293b;">Next Steps for Your Application</h2>
          <p style="color: #334155; font-size: 16px;">Hi <strong>${candidateName}</strong>,</p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">
            Congratulations! You have been selected for the next round of the interview process for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.5;">
            As the next step, please complete the assessment by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${assessmentLink}" target="_blank" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Start Assessment</a>
          </div>
          <p style="color: #334155; font-size: 14px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br/>
            <a href="${assessmentLink}" style="color: #4f46e5;">${assessmentLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #64748b; font-size: 14px;">
            Best regards,<br/>
            <strong>The ${companyName} Hiring Team</strong>
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send assessment email: ' + error.message);
  }
};
