/**
 * Mifumo SMS API - JavaScript Example
 *
 * This example demonstrates how to use the Mifumo SMS API with JavaScript/Node.js
 */

const BASE_URL = 'https://mifumosms.mifumolabs.com/api';

// Store tokens
let accessToken = null;
let refreshToken = null;

/**
 * Register a new user
 */
async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone_number: userData.phoneNumber,
        password: userData.password,
        password_confirm: userData.passwordConfirm,
        timezone: userData.timezone || 'Africa/Dar_es_Salaam',
        business_name: userData.businessName,
        company_name: userData.companyName,
        subdomain: userData.subdomain,
        country: userData.country || 'Tanzania',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Login and get access tokens
 */
async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    accessToken = data.tokens.access;
    refreshToken = data.tokens.refresh;

    console.log('Login successful');
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Refresh access token
 */
async function refreshAccessToken() {
  try {
    const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    accessToken = data.access;
    console.log('Token refreshed');
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
}

/**
 * Get authenticated user profile
 */
async function getProfile() {
  try {
    const response = await fetch(`${BASE_URL}/auth/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        await refreshAccessToken();
        return getProfile();
      }
      throw new Error(JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

/**
 * Send SMS
 */
async function sendSMS(recipient, message, senderId) {
  try {
    const response = await fetch(`${BASE_URL}/messaging/sms/send/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        message,
        sender_id: senderId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 402) {
        console.error('Insufficient credits:', data);
      }
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
    // Login
    await login('user@example.com', 'SecurePassword123!');

    // Get profile
    const profile = await getProfile();
    console.log('Profile:', profile);

    // Get balance
    const balance = await getSMSBalance();
    console.log('Balance:', balance);

    // Send SMS
    await sendSMS('+255614853618', 'Hello from Mifumo SMS API!', 'MIFUMO');

    // List contacts
    const contacts = await listContacts(1, 20);
    console.log('Contacts:', contacts);

    // Create contact
    await createContact({
      name: 'John Doe',
      phoneE164: '+255712345678',
      email: 'john@example.com',
      tags: ['VIP', 'Customer'],
    });

    // Get dashboard
    const dashboard = await getDashboardOverview();
    console.log('Dashboard:', dashboard);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser,
    login,
    refreshAccessToken,
    getProfile,
    sendSMS,
    getSMSBalance,
    listContacts,
    createContact,
    createCampaign,
    getDashboardOverview,
  };
}

