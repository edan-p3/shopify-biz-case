import type { VercelRequest, VercelResponse } from '@vercel/node';

interface LeadData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyEmail: string;
  phone: string;
  downloadType: 'pdf' | 'project-plan';
  timestamp: string;
  source: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData: LeadData = req.body;

    // Validate required fields
    if (!leadData.firstName || !leadData.lastName || !leadData.companyEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Log lead data (in production, save to database or send to CRM)
    console.log('Lead captured:', leadData);

    // Option 1: Save to database
    // await saveLeadToDatabase(leadData);

    // Option 2: Send to CRM (HubSpot, Salesforce, etc.)
    // await sendToHubSpot(leadData);

    // Option 3: Send email notification
    await sendEmailNotification(leadData);

    // Return success
    return res.status(200).json({ 
      success: true, 
      message: 'Lead captured successfully' 
    });
  } catch (error) {
    console.error('Error processing lead:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function sendEmailNotification(leadData: LeadData) {
  // Send email to sales team using SendGrid, AWS SES, or similar
  // Example with a generic email service:
  
  const emailBody = `
    New Lead from Business Case Calculator:
    
    Name: ${leadData.firstName} ${leadData.lastName}
    Company: ${leadData.companyName}
    Email: ${leadData.companyEmail}
    Phone: ${leadData.phone}
    
    Download Type: ${leadData.downloadType}
    Source: ${leadData.source}
    Timestamp: ${leadData.timestamp}
    
    Follow up with this lead within 24 hours!
  `;

  // In production, replace with actual email service
  console.log('Email notification:', emailBody);

  // Example with SendGrid:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: 'sales@p3media.com',
    from: 'notifications@p3media.com',
    subject: `New Lead: ${leadData.firstName} ${leadData.lastName} from ${leadData.companyName}`,
    text: emailBody,
    html: emailBody.replace(/\n/g, '<br>'),
  };
  
  await sgMail.send(msg);
  */
}

// Optional: Function to save to HubSpot
async function sendToHubSpot(leadData: LeadData) {
  const hubspotApiKey = process.env.HUBSPOT_API_KEY;
  
  if (!hubspotApiKey) {
    console.warn('HubSpot API key not configured');
    return;
  }

  try {
    const response = await fetch('https://api.hubapi.com/contacts/v1/contact/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hubspotApiKey}`,
      },
      body: JSON.stringify({
        properties: [
          { property: 'email', value: leadData.companyEmail },
          { property: 'firstname', value: leadData.firstName },
          { property: 'lastname', value: leadData.lastName },
          { property: 'company', value: leadData.companyName },
          { property: 'phone', value: leadData.phone },
          { property: 'download_type', value: leadData.downloadType },
          { property: 'lead_source', value: leadData.source },
        ],
      }),
    });

    if (!response.ok) {
      console.error('HubSpot API error:', await response.text());
    }
  } catch (error) {
    console.error('Error sending to HubSpot:', error);
  }
}
