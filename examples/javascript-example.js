/**
 * Mifumo SMS API v2.0 - JavaScript Example
 *
 * This example demonstrates how to use the Mifumo SMS API v2.0 with JavaScript/Node.js
 */

const BASE_URL = 'https://mifumosms.mifumolabs.com';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

/**
 * Send SMS using the Core SMS API
 */
async function sendSMS(message, recipients, senderId, tenantAccountId = null) {
  try {
    const requestBody = {
      message,
      recipients,
      sender_id: senderId,
    };

    // Add tenant_account_id for white-label mode
    if (tenantAccountId) {
      requestBody.tenant_account_id = tenantAccountId;
    }

    const response = await fetch(`${BASE_URL}/api/integration/v1/sms/send/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('SMS sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
}

/**
 * Check SMS message status
 */
async function checkMessageStatus(messageId) {
  try {
    const response = await fetch(`${BASE_URL}/api/integration/v1/sms/status/${messageId}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Message status:', data);
    return data;
  } catch (error) {
    console.error('Check status error:', error);
    throw error;
  }
}

/**
 * Get SMS balance
 */
async function getSMSBalance() {
  try {
    const response = await fetch(`${BASE_URL}/api/integration/v1/sms/balance/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('SMS Balance:', data);
    return data;
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}

/**
 * Create a tenant account (White-Label API)
 */
async function createTenant(tenantData) {
  try {
    const response = await fetch(`${BASE_URL}/api/integration/v1/partner/tenants/create/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenant_name: tenantData.tenantName,
        owner_email: tenantData.ownerEmail,
        owner_name: tenantData.ownerName,
        contact_phone: tenantData.contactPhone,
        initial_credits: tenantData.initialCredits || 0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Tenant created successfully:', data);
    return data;
  } catch (error) {
    console.error('Create tenant error:', error);
    throw error;
  }
}

/**
 * Initiate payment for tenant (ZenoPay Mobile Money)
 */
async function initiateTenantPayment(tenantId, paymentData) {
  try {
    const response = await fetch(`${BASE_URL}/api/integration/v1/partner/tenants/${tenantId}/payments/initiate/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: paymentData.packageId,
        buyer_email: paymentData.buyerEmail,
        buyer_name: paymentData.buyerName,
        buyer_phone: paymentData.buyerPhone,
        mobile_money_provider: paymentData.mobileMoneyProvider,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Payment initiated:', data);
    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
}

/**
 * Get SMS balance
 */
async function getSMSBalance() {
  try {
    const response = await fetch(`${BASE_URL}/messaging/sms/balance/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Get balance error:', error);
    throw error;
  }
}

/**
 * List contacts with pagination
 */
async function listContacts(page = 1, pageSize = 20, search = null, tags = null) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });

    if (search) params.append('search', search);
    if (tags) params.append('tags', tags);

    const response = await fetch(`${BASE_URL}/messaging/contacts/?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('List contacts error:', error);
    throw error;
  }
}

/**
 * Create a new contact
 */
async function createContact(contactData) {
  try {
    const response = await fetch(`${BASE_URL}/messaging/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: contactData.name,
        phone_e164: contactData.phoneE164,
        email: contactData.email,
        attributes: contactData.attributes || {},
        tags: contactData.tags || [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Contact created:', data);
    return data;
  } catch (error) {
    console.error('Create contact error:', error);
    throw error;
  }
}

/**
 * Create a campaign
 */
async function createCampaign(campaignData) {
  try {
    const response = await fetch(`${BASE_URL}/messaging/campaigns/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: campaignData.name,
        message: campaignData.message,
        recipients: campaignData.recipients || [],
        sender_id: campaignData.senderId,
        scheduled_at: campaignData.scheduledAt,
        segment_ids: campaignData.segmentIds || [],
        contact_ids: campaignData.contactIds || [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Campaign created:', data);
    return data;
  } catch (error) {
    console.error('Create campaign error:', error);
    throw error;
  }
}

/**
 * Get dashboard overview
 */
async function getDashboardOverview() {
  try {
    const response = await fetch(`${BASE_URL}/messaging/dashboard/overview/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Get dashboard error:', error);
    throw error;
  }
}

// Example usage
async function main() {
  try {
    // Get SMS balance
    const balance = await getSMSBalance();
    console.log('Current Balance:', balance);

    // Send SMS
    const smsResult = await sendSMS(
      'Hello from Mifumo SMS API v2.0!',
      ['+255614853618'],
      'QUANTUM'
    );
    console.log('SMS Result:', smsResult);

    // Check message status
    if (smsResult.success && smsResult.message_id) {
      setTimeout(async () => {
        const status = await checkMessageStatus(smsResult.message_id);
        console.log('Message Status:', status);
      }, 5000); // Check after 5 seconds
    }

    // Create a tenant account (White-Label)
    const tenant = await createTenant({
      tenantName: 'Restaurant Chain A',
      ownerEmail: 'owner@restaurant.com',
      ownerName: 'John Doe',
      contactPhone: '+255123456789',
      initialCredits: 0,
    });
    console.log('Tenant Created:', tenant);

    // Initiate payment for tenant
    if (tenant.success && tenant.data.mifumo_account_id) {
      const payment = await initiateTenantPayment(tenant.data.mifumo_account_id, {
        packageId: 'uuid-of-starter-package', // Get from list packages endpoint
        buyerEmail: 'buyer@restaurant.com',
        buyerName: 'Jane Smith',
        buyerPhone: '0614853618',
        mobileMoneyProvider: 'vodacom',
      });
      console.log('Payment Initiated:', payment);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sendSMS,
    checkMessageStatus,
    getSMSBalance,
    createTenant,
    initiateTenantPayment,
  };
}

