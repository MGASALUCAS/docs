# Mifumo SMS API Documentation

Version: 2.0
Base URL: https://mifumosms.mifumolabs.com

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Core SMS API](#core-sms-api)
4. [White-Label / Partner API](#white-label--partner-api)
5. [Payment Integration](#payment-integration)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)

## Quick Start

### Get Your API Key

1. Register at https://mifumosms.mifumolabs.com
2. Login to your account
3. Navigate to API Settings → Generate API Key

### Base URL Structure

Base URL: https://mifumosms.mifumolabs.com

API Paths:
- External SMS API: /api/integration/v1/
- Authentication: /api/auth/
- Messaging: /api/messaging/
- Billing: /api/billing/
- White-Label API: /api/integration/v1/partner/

### Example Request

```bash
curl -X POST https://mifumosms.mifumolabs.com/api/integration/v1/sms/send/ \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{
"message": "Hello from Mifumo SMS",
"recipients": ["+255614853618"],
"sender_id": "Quantum"
}'
```

## Authentication

### API Key (Recommended)

```
Authorization: Bearer YOUR_API_KEY
```

or

```
X-API-Key: YOUR_API_KEY
```

### JWT Token (Web Applications)

1. Login: POST /api/auth/login/
2. Use access_token in Authorization header

## Core SMS API

### Send SMS

**POST /api/integration/v1/sms/send/**

Send SMS to one or more recipients.

**Request:**
```json
{
"message": "Your message here",
"recipients": ["+255614853618", "+255614853619"],
"sender_id": "YourBrand",
"tenant_account_id": "uuid-optional-for-white-label"
}
```

**Response:**
```json
{
"success": true,
"message_id": "uuid-here",
"status": "sent"
}
```

**White-Label Mode:** Include tenant_account_id (use mifumo_account_id from tenant creation) to send on behalf of tenant. Credits deducted from tenant's account.

### Check Message Status

**GET /api/integration/v1/sms/status/{message_id}/**

**Response:**
```json
{
"message_id": "uuid-here",
"status": "delivered",
"delivered_at": "2024-01-15T10:30:00Z"
}
```

### Get SMS Balance

**GET /api/integration/v1/sms/balance/**

**Response:**
```json
{
"balance": 1000,
"currency": "credits"
}
```

### Get Delivery Reports

**GET /api/integration/v1/sms/delivery-reports/**

Query Parameters:
- limit (optional): Number of records (default: 50)
- offset (optional): Pagination offset

## White-Label / Partner API

### Overview

Manage tenant accounts programmatically using your Customer API key. Tenants use your API key for all operations and do not have their own Mifumo SMS accounts.

**Architecture:**
- Customer: Has Mifumo SMS account and API key
- Tenant: Uses Customer's API key, no own account
- Payment: ZenoPay Mobile Money Integration (direct to Mifumo SMS)

### Create Tenant Account

**POST /api/integration/v1/partner/tenants/create/**

**Request:**
```json
{
"tenant_name": "Customer Company Name",
"owner_email": "customer@example.com",
"owner_name": "John Doe",
"contact_phone": "+255123456789",
"initial_credits": 0
}
```

**Response:**
```json
{
"success": true,
"data": {
"mifumo_account_id": "a5245ef6-def7-4731-8c20-e89ef53aa65e",
"mifumo_account_id_public": "YCKWLWXX45W_TIAT1Y6BPW",
"mifumo_api_key": null,
"tenant_name": "Restaurant Chain A",
"tenant_id": "ec0a5041-65df-429e-8de5-3e2ac51ef332",
"sms_balance": 0,
"owner_email": "restaurant@example.com",
"created_at": "2025-12-20T11:35:48.898725+00:00"
}
}
```

**Important:** Save mifumo_account_id - use it as tenant_account_id in all tenant operations.

### Get Tenant Account

**GET /api/integration/v1/partner/tenants/{tenant_id}/**

Get tenant account details including balance.

Path Parameter:
- tenant_id: mifumo_account_id from tenant creation response

### Request Sender ID for Tenant

**POST /api/integration/v1/partner/tenants/{tenant_id}/sender-ids/request/**

**Request:**
```json
{
"sender_id": "MYBRAND",
"use_case": "Marketing messages for our brand"
}
```

**Response:**
```json
{
"success": true,
"data": {
"request_id": "uuid-here",
"sender_id": "MYBRAND",
"status": "pending",
"tenant_id": "a5245ef6-def7-4731-8c20-e89ef53aa65e",
"created_at": "2025-12-20T12:00:00Z"
}
}
```

### Get Tenant Sender ID Requests

**GET /api/integration/v1/partner/tenants/{tenant_id}/sender-ids/requests/**

Query Parameters:
- status (optional): Filter by status (pending, approved, rejected)

## Payment Integration

### Payment Method: ZenoPay Mobile Money

All tenant payments use ZenoPay Mobile Money Integration. Payments go directly to Mifumo SMS. Tenants receive payment instructions on their phone and pay via mobile money. Credits are automatically added when payment completes.

**Supported Providers:** vodacom, tigo, airtel, halotel

### List SMS Packages

**GET /api/integration/v1/partner/packages/**

**Response:**
```json
{
"success": true,
"data": [
{
"id": "uuid-here",
"name": "Starter Package",
"credits": 1000,
"price": 18000,
"currency": "TZS",
"unit_price": 18.00
}
]
}
```

### Initiate Payment for Tenant

**POST /api/integration/v1/partner/tenants/{tenant_id}/payments/initiate/**

**Request:**
```json
{
"package_id": "uuid-from-packages-list",
"buyer_email": "restaurant@example.com",
"buyer_name": "John Doe",
"buyer_phone": "0614853618",
"mobile_money_provider": "vodacom"
}
```

**Response:**
```json
{
"success": true,
"data": {
"transaction_id": "uuid-here",
"order_id": "MIFUMO-20251220-ABC12345",
"amount": 18000,
"currency": "TZS",
"status": "pending"
}
}
```

**Workflow:**
1. Call endpoint → Tenant receives payment instructions
2. Tenant pays via mobile money → Payment goes to Mifumo SMS
3. Poll status endpoint → Credits automatically added when completed

### Check Payment Status

**GET /api/integration/v1/partner/tenants/{tenant_id}/payments/{transaction_id}/status/**

**Response:**
```json
{
"success": true,
"data": {
"transaction_id": "uuid-here",
"status": "completed",
"amount": 18000,
"currency": "TZS",
"credits_added": 1000,
"completed_at": "2025-12-20T12:30:00Z"
}
}
```

**Status Values:** pending, completed, failed, cancelled

### Initiate Custom Payment

**POST /api/integration/v1/partner/tenants/{tenant_id}/payments/custom/initiate/**

Initiate payment for custom SMS credits (minimum 100).

**Request:**
```json
{
"credits": 5000,
"buyer_email": "restaurant@example.com",
"buyer_name": "John Doe",
"buyer_phone": "0614853618",
"mobile_money_provider": "vodacom"
}
```

**Pricing Tiers:**
- Lite: 1-49,999 SMS at 18.00 TZS/SMS
- Standard: 50,000-149,999 SMS at 14.00 TZS/SMS
- Pro: 250,000+ SMS at 12.00 TZS/SMS

### Check Custom Payment Status

**GET /api/integration/v1/partner/tenants/{tenant_id}/payments/custom/{purchase_id}/status/**

### Get Tenant Payment History

**GET /api/integration/v1/partner/tenants/{tenant_id}/payments/history/**

Query Parameters:
- status (optional): Filter by status
- limit (optional): Number of records (default: 50, max: 100)
- offset (optional): Pagination offset

### Calculate SMS Pricing

**POST /api/integration/v1/partner/pricing/calculate/**

**Request:**
```json
{
"credits": 5000
}
```

**Response:**
```json
{
"credits": 5000,
"price": 90000,
"currency": "TZS",
"unit_price": 18.00,
"tier": "Lite"
}
```

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

```json
{
"error": "Error message description",
"code": "ERROR_CODE",
"details": {}
}
```

## Code Examples

### JavaScript (Fetch)

```javascript
const response = await
fetch('https://mifumosms.mifumolabs.com/api/integration/v1/sms/send/', {
method: 'POST',
headers: {
'Authorization': 'Bearer YOUR_API_KEY',
'Content-Type': 'application/json'
},
body: JSON.stringify({
message: 'Hello from Mifumo SMS',
recipients: ['+255614853618'],
sender_id: 'Quantum'
})
});
const data = await response.json();
console.log(data);
```

### Python (Requests)

```python
import requests
url = 'https://mifumosms.mifumolabs.com/api/integration/v1/sms/send/'
headers = {
'Authorization': 'Bearer YOUR_API_KEY',
'Content-Type': 'application/json'
}
data = {
'message': 'Hello from Mifumo SMS',
'recipients': ['+255614853618'],
'sender_id': 'Quantum'
}
response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### PHP (cURL)

```php
$url = 'https://mifumosms.mifumolabs.com/api/integration/v1/sms/send/';
$data = [
'message' => 'Hello from Mifumo SMS',
'recipients' => ['+255614853618'],
'sender_id' => 'Quantum'
];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
'Authorization: Bearer YOUR_API_KEY',
'Content-Type: application/json'
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

## Support

- **Email**: support@mifumolabs.com
- **Base URL**: https://mifumosms.mifumolabs.com

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+255614853618",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "timezone": "Africa/Dar_es_Salaam",
  "business_name": "My Business",
  "company_name": "My Company",
  "subdomain": "mybusiness",
  "country": "Tanzania"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully. Please check your phone for the verification code to activate your account.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+255614853618",
    "timezone": "Africa/Dar_es_Salaam",
    "is_verified": false,
    "is_active": false,
    "phone_verified": false,
    "email_notifications": true,
    "sms_notifications": false,
    "created_at": "2025-11-27T10:30:00Z",
    "updated_at": "2025-11-27T10:30:00Z"
  },
  "email_verification_sent": false,
  "sms_verification_sent": true,
  "account_active": false,
  "requires_activation": true,
  "activation_required": true,
  "tokens": null
}
```

**Error Response (400):**
```json
{
  "email": ["User with this email already exists. Please log in instead."],
  "password": ["This password is too common."],
  "password_confirm": ["Passwords don't match."]
}
```

---

### Login

**Endpoint:** `POST /api/auth/login/`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "short_name": "John",
    "phone_number": "+255614853618",
    "timezone": "Africa/Dar_es_Salaam",
    "is_verified": true,
    "is_active": true,
    "phone_verified": true,
    "email_notifications": true,
    "sms_notifications": false,
    "created_at": "2025-11-27T10:30:00Z",
    "updated_at": "2025-11-27T10:30:00Z",
    "last_login_at": "2025-11-27T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "non_field_errors": ["Invalid credentials."]
}
```

**Error Response (400) - Account Not Verified:**
```json
{
  "non_field_errors": [
    "Your account has not been activated. We have sent a 6-digit verification code to your email. Please check your email and use the code to verify your account, or visit /api/auth/resend-activation/ to resend."
  ]
}
```

---

### Refresh Token

**Endpoint:** `POST /api/auth/token/refresh/`

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Success Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### Logout

**Endpoint:** `POST /api/auth/logout/`

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### Activate Account

**Endpoint:** `GET /api/auth/activate-account/{token}/`

**Success Response (200):**
```json
{
  "message": "Account activated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": true,
    "is_active": true
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

### Verify Email (POST)

**Endpoint:** `POST /api/auth/verify-email/`

**Request Body:**
```json
{
  "token": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Account activated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": true,
    "is_active": true
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

---

### Resend Activation

**Endpoint:** `POST /api/auth/resend-activation/`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Activation code has been sent to your email/phone",
  "email_sent": true,
  "sms_sent": false
}
```

---

## User Management

### Get User Profile

**Endpoint:** `GET /api/auth/profile/`

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "short_name": "John",
  "phone_number": "+255614853618",
  "timezone": "Africa/Dar_es_Salaam",
  "avatar": null,
  "bio": "",
  "is_verified": true,
  "email_notifications": true,
  "sms_notifications": false,
  "created_at": "2025-11-27T10:30:00Z",
  "updated_at": "2025-11-27T10:30:00Z",
  "last_login_at": "2025-11-27T10:30:00Z"
}
```

---

### Update Profile Settings

**Endpoint:** `PUT /api/auth/settings/profile/`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+255614853618"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+255614853618"
  }
}
```

---

### Update Preferences

**Endpoint:** `PUT /api/auth/settings/preferences/`

**Request Body:**
```json
{
  "timezone": "Africa/Dar_es_Salaam"
}
```

**Success Response (200):**
```json
{
  "message": "Preferences updated successfully",
  "timezone": "Africa/Dar_es_Salaam"
}
```

---

### Update Notification Settings

**Endpoint:** `PUT /api/auth/settings/notifications/`

**Request Body:**
```json
{
  "email_notifications": true,
  "sms_notifications": false
}
```

**Success Response (200):**
```json
{
  "message": "Notification settings updated successfully",
  "email_notifications": true,
  "sms_notifications": false
}
```

---

### Change Password

**Endpoint:** `POST /api/auth/password/change/`

**Request Body:**
```json
{
  "old_password": "OldPassword123!",
  "new_password": "NewPassword123!",
  "new_password_confirm": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

### Forgot Password

**Endpoint:** `POST /api/auth/forgot-password/`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email has been sent"
}
```

---

### Reset Password

**Endpoint:** `POST /api/auth/password/reset/`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email has been sent to your email address"
}
```

---

### Reset Password Confirm

**Endpoint:** `POST /api/auth/password/reset/confirm/`

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "NewPassword123!",
  "new_password_confirm": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

## SMS Verification

### Send Verification Code

**Endpoint:** `POST /api/auth/sms/send-code/`

**Request Body:**
```json
{
  "phone_number": "+255614853618",
  "message_type": "verification"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "phone_number": "+255614853618",
  "message_id": "msg_1234567890"
}
```

---

### Verify Phone Code

**Endpoint:** `POST /api/auth/sms/verify-code/`

**Request Body:**
```json
{
  "phone_number": "+255614853618",
  "verification_code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "phone_number": "+255614853618",
  "phone_verified": true
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid verification code",
  "message": "The verification code provided is incorrect or expired",
  "attempts_remaining": 2
}
```

---

### Forgot Password via SMS

**Endpoint:** `POST /api/auth/sms/forgot-password/`

**Request Body:**
```json
{
  "phone_number": "+255614853618"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to your phone",
  "phone_number": "+255614853618"
}
```

---

### Reset Password via SMS

**Endpoint:** `POST /api/auth/sms/reset-password/`

**Request Body:**
```json
{
  "phone_number": "+255614853618",
  "verification_code": "123456",
  "new_password": "NewPassword123!",
  "new_password_confirm": "NewPassword123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### Confirm Account via SMS

**Endpoint:** `POST /api/auth/sms/confirm-account/`

**Request Body:**
```json
{
  "verification_code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account confirmed successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "is_verified": true,
    "is_active": true,
    "phone_verified": true
  }
}
```

---

## SMS Operations

### Send SMS

**Endpoint:** `POST /api/messaging/sms/send/`

**Request Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "recipient": "+255614853618",
  "message": "Hello, this is a test message",
  "sender_id": "MIFUMO"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "message_id": "550e8400-e29b-41d4-a716-446655440000",
    "recipient": "+255614853618",
    "message": "Hello, this is a test message",
    "sender_id": "MIFUMO",
    "status": "queued",
    "cost": 0.05,
    "currency": "USD",
    "sent_at": "2025-11-27T10:30:00Z"
  }
}
```

**Error Response (402) - Insufficient Credits:**
```json
{
  "success": false,
  "error": "Insufficient credits",
  "message": "You need 1 credit to send this message. Current balance: 0 credits",
  "required_credits": 1,
  "current_balance": 0
}
```

---

### Get SMS Balance

**Endpoint:** `GET /api/messaging/sms/balance/`

**Success Response (200):**
```json
{
  "success": true,
  "balance": {
    "credits": 1000,
    "currency": "USD",
    "last_updated": "2025-11-27T10:30:00Z"
  }
}
```

---

### Get SMS Stats

**Endpoint:** `GET /api/messaging/sms/stats/`

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_sent": 1500,
    "total_delivered": 1450,
    "total_failed": 50,
    "delivery_rate": 96.67,
    "total_cost": 75.00,
    "currency": "USD",
    "period": {
      "start": "2025-11-01T00:00:00Z",
      "end": "2025-11-27T23:59:59Z"
    }
  }
}
```

---

### Get SMS Delivery Status

**Endpoint:** `GET /api/messaging/sms/{message_id}/status/`

**Success Response (200):**
```json
{
  "success": true,
  "message": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "recipient": "+255614853618",
    "message": "Hello, this is a test message",
    "sender_id": "MIFUMO",
    "status": "delivered",
    "sent_at": "2025-11-27T10:30:00Z",
    "delivered_at": "2025-11-27T10:30:15Z",
    "cost": 0.05,
    "currency": "USD"
  }
}
```

---

### Validate Phone Number

**Endpoint:** `POST /api/messaging/sms/validate-phone/`

**Request Body:**
```json
{
  "phone_number": "+255614853618"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "valid": true,
  "formatted": "+255614853618",
  "country": "Tanzania",
  "country_code": "TZ"
}
```

---

### Quick SMS Send

**Endpoint:** `POST /api/messaging/sms/quick/`

**Request Body:**
```json
{
  "recipients": ["+255614853618", "+255712345678"],
  "message": "Hello, this is a quick message",
  "sender_id": "MIFUMO"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "SMS sent to 2 recipients",
  "sent": 2,
  "failed": 0,
  "message_ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

---

## Contact Management

### List Contacts

**Endpoint:** `GET /api/messaging/contacts/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `search` (string): Search term
- `tags` (string): Filter by tags (comma-separated)

**Success Response (200):**
```json
{
  "count": 150,
  "next": "https://mifumosms.mifumolabs.com/api/messaging/contacts/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "phone_e164": "+255614853618",
      "email": "john@example.com",
      "attributes": {},
      "tags": ["VIP", "Customer"],
      "is_active": true,
      "opt_in_at": "2025-11-01T10:00:00Z",
      "opt_out_at": null,
      "created_at": "2025-11-01T10:00:00Z",
      "updated_at": "2025-11-27T10:30:00Z"
    }
  ]
}
```

---

### Create Contact

**Endpoint:** `POST /api/messaging/contacts/`

**Request Body:**
```json
{
  "name": "John Doe",
  "phone_e164": "+255614853618",
  "email": "john@example.com",
  "attributes": {
    "company": "Example Corp",
    "position": "Manager"
  },
  "tags": ["VIP", "Customer"]
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "phone_e164": "+255614853618",
  "email": "john@example.com",
  "attributes": {
    "company": "Example Corp",
    "position": "Manager"
  },
  "tags": ["VIP", "Customer"],
  "is_active": true,
  "opt_in_at": "2025-11-27T10:30:00Z",
  "opt_out_at": null,
  "created_at": "2025-11-27T10:30:00Z",
  "updated_at": "2025-11-27T10:30:00Z"
}
```

---

### Get Contact Detail

**Endpoint:** `GET /api/messaging/contacts/{contact_id}/`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "phone_e164": "+255614853618",
  "email": "john@example.com",
  "attributes": {
    "company": "Example Corp",
    "position": "Manager"
  },
  "tags": ["VIP", "Customer"],
  "is_active": true,
  "opt_in_at": "2025-11-01T10:00:00Z",
  "opt_out_at": null,
  "created_at": "2025-11-01T10:00:00Z",
  "updated_at": "2025-11-27T10:30:00Z"
}
```

---

### Update Contact

**Endpoint:** `PUT /api/messaging/contacts/{contact_id}/`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "tags": ["VIP", "Customer", "Premium"]
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe Updated",
  "phone_e164": "+255614853618",
  "email": "john.updated@example.com",
  "tags": ["VIP", "Customer", "Premium"],
  "updated_at": "2025-11-27T10:35:00Z"
}
```

---

### Delete Contact

**Endpoint:** `DELETE /api/messaging/contacts/{contact_id}/`

**Success Response (204):**
```
No Content
```

---

### Bulk Import Contacts

**Endpoint:** `POST /api/messaging/contacts/bulk-import/`

**Request Body (Form Data):**
```
file: [CSV/Excel file]
tags: "VIP,Customer"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contacts imported successfully",
  "imported": 100,
  "failed": 5,
  "errors": [
    {
      "row": 3,
      "error": "Invalid phone number format"
    }
  ]
}
```

---

### Bulk Delete Contacts

**Endpoint:** `POST /api/messaging/contacts/bulk-delete/`

**Request Body:**
```json
{
  "contact_ids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "550e8400-e29b-41d4-a716-446655440001"
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "2 contacts deleted successfully",
  "deleted": 2
}
```

---

### Contact Opt-In

**Endpoint:** `POST /api/messaging/contacts/{contact_id}/opt-in/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact opted in successfully",
  "opt_in_at": "2025-11-27T10:30:00Z"
}
```

---

### Contact Opt-Out

**Endpoint:** `POST /api/messaging/contacts/{contact_id}/opt-out/`

**Request Body:**
```json
{
  "reason": "No longer interested"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact opted out successfully",
  "opt_out_at": "2025-11-27T10:30:00Z"
}
```

---

## Campaign Management

### List Campaigns

**Endpoint:** `GET /api/messaging/campaigns/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `status` (string): Filter by status
- `search` (string): Search term

**Success Response (200):**
```json
{
  "count": 25,
  "next": "https://mifumosms.mifumolabs.com/api/messaging/campaigns/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Holiday Promotion",
      "message": "Special holiday offer! Get 20% off",
      "status": "scheduled",
      "scheduled_at": "2025-12-01T10:00:00Z",
      "total_recipients": 1000,
      "sent": 0,
      "delivered": 0,
      "failed": 0,
      "created_at": "2025-11-27T10:30:00Z",
      "updated_at": "2025-11-27T10:30:00Z"
    }
  ]
}
```

---

### Create Campaign

**Endpoint:** `POST /api/messaging/campaigns/`

**Request Body:**
```json
{
  "name": "Holiday Promotion",
  "message": "Special holiday offer! Get 20% off",
  "recipients": [
    "+255614853618",
    "+255712345678"
  ],
  "sender_id": "MIFUMO",
  "scheduled_at": "2025-12-01T10:00:00Z",
  "segment_ids": [],
  "contact_ids": []
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Holiday Promotion",
  "message": "Special holiday offer! Get 20% off",
  "status": "scheduled",
  "scheduled_at": "2025-12-01T10:00:00Z",
  "total_recipients": 2,
  "sent": 0,
  "delivered": 0,
  "failed": 0,
  "created_at": "2025-11-27T10:30:00Z",
  "updated_at": "2025-11-27T10:30:00Z"
}
```

---

### Get Campaign Detail

**Endpoint:** `GET /api/messaging/campaigns/{campaign_id}/`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Holiday Promotion",
  "message": "Special holiday offer! Get 20% off",
  "status": "running",
  "scheduled_at": "2025-12-01T10:00:00Z",
  "started_at": "2025-12-01T10:00:00Z",
  "total_recipients": 1000,
  "sent": 850,
  "delivered": 800,
  "failed": 50,
  "delivery_rate": 94.12,
  "cost": 50.00,
  "currency": "USD",
  "created_at": "2025-11-27T10:30:00Z",
  "updated_at": "2025-12-01T10:15:00Z"
}
```

---

### Start Campaign

**Endpoint:** `POST /api/messaging/campaigns/{campaign_id}/start/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Campaign started successfully",
  "campaign": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "running",
    "started_at": "2025-11-27T10:30:00Z"
  }
}
```

---

### Pause Campaign

**Endpoint:** `POST /api/messaging/campaigns/{campaign_id}/pause/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Campaign paused successfully",
  "campaign": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "paused"
  }
}
```

---

### Cancel Campaign

**Endpoint:** `POST /api/messaging/campaigns/{campaign_id}/cancel/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Campaign cancelled successfully",
  "campaign": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "cancelled"
  }
}
```

---

### Get Campaign Analytics

**Endpoint:** `GET /api/messaging/campaigns/{campaign_id}/analytics/`

**Success Response (200):**
```json
{
  "campaign_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Holiday Promotion",
  "status": "completed",
  "total_recipients": 1000,
  "sent": 1000,
  "delivered": 950,
  "failed": 50,
  "delivery_rate": 95.0,
  "cost": 50.00,
  "currency": "USD",
  "started_at": "2025-12-01T10:00:00Z",
  "completed_at": "2025-12-01T10:30:00Z",
  "duration_seconds": 1800,
  "messages_per_second": 0.56
}
```

---

### Duplicate Campaign

**Endpoint:** `POST /api/messaging/campaigns/{campaign_id}/duplicate/`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Campaign duplicated successfully",
  "new_campaign": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Holiday Promotion (Copy)",
    "status": "draft"
  }
}
```

---

## Template Management

### List Templates

**Endpoint:** `GET /api/messaging/templates/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `category` (string): Filter by category
- `search` (string): Search term

**Success Response (200):**
```json
{
  "count": 50,
  "next": "https://mifumosms.mifumolabs.com/api/messaging/templates/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Welcome Message",
      "category": "TRANSACTIONAL",
      "language": "en",
      "message": "Welcome {{name}}! Thank you for joining us.",
      "variables": ["name"],
      "is_active": true,
      "usage_count": 150,
      "created_at": "2025-11-01T10:00:00Z",
      "updated_at": "2025-11-27T10:30:00Z"
    }
  ]
}
```

---

### Create Template

**Endpoint:** `POST /api/messaging/templates/`

**Request Body:**
```json
{
  "name": "Welcome Message",
  "category": "TRANSACTIONAL",
  "language": "en",
  "message": "Welcome {{name}}! Thank you for joining us.",
  "variables": ["name"]
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Welcome Message",
  "category": "TRANSACTIONAL",
  "language": "en",
  "message": "Welcome {{name}}! Thank you for joining us.",
  "variables": ["name"],
  "is_active": true,
  "usage_count": 0,
  "created_at": "2025-11-27T10:30:00Z",
  "updated_at": "2025-11-27T10:30:00Z"
}
```

---

### Get Template Detail

**Endpoint:** `GET /api/messaging/templates/{template_id}/`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Welcome Message",
  "category": "TRANSACTIONAL",
  "language": "en",
  "message": "Welcome {{name}}! Thank you for joining us.",
  "variables": ["name"],
  "is_active": true,
  "usage_count": 150,
  "created_at": "2025-11-01T10:00:00Z",
  "updated_at": "2025-11-27T10:30:00Z"
}
```

---

### Update Template

**Endpoint:** `PUT /api/messaging/templates/{template_id}/`

**Request Body:**
```json
{
  "name": "Welcome Message Updated",
  "message": "Welcome {{name}}! We're excited to have you."
}
```

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Welcome Message Updated",
  "message": "Welcome {{name}}! We're excited to have you.",
  "updated_at": "2025-11-27T10:35:00Z"
}
```

---

### Delete Template

**Endpoint:** `DELETE /api/messaging/templates/{template_id}/`

**Success Response (204):**
```
No Content
```

---

### Toggle Template Favorite

**Endpoint:** `POST /api/messaging/templates/{template_id}/toggle-favorite/`

**Success Response (200):**
```json
{
  "success": true,
  "is_favorite": true,
  "message": "Template favorited"
}
```

---

### Get Template Variables

**Endpoint:** `GET /api/messaging/templates/{template_id}/variables/`

**Success Response (200):**
```json
{
  "template_id": "550e8400-e29b-41d4-a716-446655440000",
  "variables": [
    {
      "name": "name",
      "type": "string",
      "required": true,
      "description": "Customer name"
    }
  ]
}
```

---

## Billing & Payments

### List SMS Packages

**Endpoint:** `GET /api/billing/sms/packages/`

**Success Response (200):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Starter Package",
      "sms_count": 1000,
      "price": 50.00,
      "currency": "USD",
      "bonus_sms": 0,
      "validity_days": 30,
      "is_active": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Business Package",
      "sms_count": 5000,
      "price": 200.00,
      "currency": "USD",
      "bonus_sms": 500,
      "validity_days": 60,
      "is_active": true
    }
  ]
}
```

---

### Get SMS Balance

**Endpoint:** `GET /api/billing/sms/balance/`

**Success Response (200):**
```json
{
  "balance": {
    "credits": 1000,
    "currency": "USD",
    "last_updated": "2025-11-27T10:30:00Z"
  },
  "usage": {
    "used_this_month": 500,
    "remaining": 500
  }
}
```

---

### Purchase SMS Package

**Endpoint:** `POST /api/billing/sms/purchase/`

**Request Body:**
```json
{
  "package_id": "550e8400-e29b-41d4-a716-446655440000",
  "payment_method": "mobile_money",
  "provider": "mpesa"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "purchase": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "package_name": "Starter Package",
    "sms_count": 1000,
    "price": 50.00,
    "currency": "USD",
    "status": "pending",
    "payment_url": "https://payment.gateway.com/pay/xyz123",
    "created_at": "2025-11-27T10:30:00Z"
  }
}
```

---

### Get Purchase History

**Endpoint:** `GET /api/billing/sms/purchases/history/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `status` (string): Filter by status

**Success Response (200):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "package_name": "Starter Package",
      "sms_count": 1000,
      "price": 50.00,
      "currency": "USD",
      "status": "completed",
      "purchased_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### Initiate Payment

**Endpoint:** `POST /api/billing/payments/initiate/`

**Request Body:**
```json
{
  "amount": 50.00,
  "currency": "USD",
  "payment_method": "mobile_money",
  "provider": "mpesa",
  "phone_number": "+255614853618"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "order_id": "ORD-1234567890",
    "amount": 50.00,
    "currency": "USD",
    "status": "pending",
    "payment_url": "https://payment.gateway.com/pay/xyz123",
    "expires_at": "2025-11-27T11:00:00Z"
  }
}
```

---

### Check Payment Status

**Endpoint:** `GET /api/billing/payments/transactions/{transaction_id}/status/`

**Success Response (200):**
```json
{
  "success": true,
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "order_id": "ORD-1234567890",
    "amount": 50.00,
    "currency": "USD",
    "status": "completed",
    "completed_at": "2025-11-27T10:35:00Z"
  }
}
```

---

### Get Mobile Money Providers

**Endpoint:** `GET /api/billing/payments/providers/`

**Success Response (200):**
```json
{
  "success": true,
  "providers": [
    {
      "id": "mpesa",
      "name": "M-Pesa",
      "logo_url": "https://example.com/mpesa-logo.png",
      "is_active": true,
      "supported_countries": ["TZ", "KE"]
    },
    {
      "id": "tigopesa",
      "name": "Tigo Pesa",
      "logo_url": "https://example.com/tigo-logo.png",
      "is_active": true,
      "supported_countries": ["TZ"]
    }
  ]
}
```

---

### Get Billing History

**Endpoint:** `GET /api/billing/history/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `type` (string): Filter by type (purchase, payment, usage)

**Success Response (200):**
```json
{
  "count": 50,
  "next": "https://mifumosms.mifumolabs.com/api/billing/history/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "purchase",
      "description": "Starter Package - 1000 SMS",
      "amount": 50.00,
      "currency": "USD",
      "status": "completed",
      "created_at": "2025-11-01T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "usage",
      "description": "SMS Usage - 500 messages",
      "amount": -25.00,
      "currency": "USD",
      "status": "completed",
      "created_at": "2025-11-15T10:00:00Z"
    }
  ]
}
```

---

## Tenant Management

### List Tenants

**Endpoint:** `GET /api/tenants/`

**Success Response (200):**
```json
{
  "count": 1,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "My Organization",
      "subdomain": "myorg",
      "business_name": "My Business",
      "business_type": "General",
      "email": "admin@example.com",
      "phone_number": "+255614853618",
      "is_active": true,
      "created_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### Switch Tenant

**Endpoint:** `POST /api/tenants/switch/`

**Request Body:**
```json
{
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tenant switched successfully",
  "tenant": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Organization"
  }
}
```

---

### Get Team Members

**Endpoint:** `GET /api/tenants/{tenant_id}/team/`

**Success Response (200):**
```json
{
  "count": 5,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user": {
        "id": 1,
        "email": "member@example.com",
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "role": "member",
      "status": "active",
      "joined_at": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### Invite Team Member

**Endpoint:** `POST /api/tenants/{tenant_id}/team/invite/`

**Request Body:**
```json
{
  "email": "newmember@example.com",
  "role": "member"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newmember@example.com",
    "role": "member",
    "status": "pending",
    "sent_at": "2025-11-27T10:30:00Z"
  }
}
```

---

## Notifications

### List Notifications

**Endpoint:** `GET /api/notifications/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `unread_only` (boolean): Filter unread only

**Success Response (200):**
```json
{
  "count": 25,
  "next": "https://mifumosms.mifumolabs.com/api/notifications/?page=2",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "SMS Sent Successfully",
      "message": "Your SMS to +255614853618 was delivered",
      "type": "success",
      "is_read": false,
      "created_at": "2025-11-27T10:30:00Z"
    }
  ]
}
```

---

### Mark Notification as Read

**Endpoint:** `POST /api/notifications/{notification_id}/mark-read/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "notification": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "is_read": true
  }
}
```

---

### Mark All as Read

**Endpoint:** `POST /api/notifications/mark-all-read/`

**Success Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "marked": 10
}
```

---

### Get Unread Count

**Endpoint:** `GET /api/notifications/unread-count/`

**Success Response (200):**
```json
{
  "unread_count": 5
}
```

---

## Sender ID Management

### List Sender IDs

**Endpoint:** `GET /api/messaging/sender-ids/`

**Success Response (200):**
```json
{
  "count": 3,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sender_id": "MIFUMO",
      "status": "approved",
      "is_default": true,
      "created_at": "2025-11-01T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "sender_id": "MYBIZ",
      "status": "pending",
      "is_default": false,
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

---

### Request Sender ID

**Endpoint:** `POST /api/messaging/sender-ids/request/`

**Request Body:**
```json
{
  "sender_id": "MYBIZ",
  "reason": "Business messaging"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Sender ID request submitted",
  "sender_id": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "sender_id": "MYBIZ",
    "status": "pending",
    "created_at": "2025-11-27T10:30:00Z"
  }
}
```

---

### Get Sender ID Status

**Endpoint:** `GET /api/messaging/sender-ids/{sender_id}/status/`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sender_id": "MYBIZ",
  "status": "approved",
  "approved_at": "2025-11-28T10:00:00Z",
  "is_default": false
}
```

---

## Dashboard & Analytics

### Dashboard Overview

**Endpoint:** `GET /api/messaging/dashboard/overview/`

**Success Response (200):**
```json
{
  "stats": {
    "total_contacts": 1500,
    "total_campaigns": 25,
    "total_messages_sent": 10000,
    "total_messages_delivered": 9500,
    "delivery_rate": 95.0,
    "total_spent": 500.00,
    "current_balance": 1000.00
  },
  "recent_activity": [
    {
      "type": "campaign_completed",
      "message": "Holiday Promotion campaign completed",
      "timestamp": "2025-11-27T10:30:00Z"
    }
  ]
}
```

---

### Dashboard Metrics

**Endpoint:** `GET /api/messaging/dashboard/metrics/`

**Query Parameters:**
- `period` (string): Time period (7d, 30d, 90d, 1y)

**Success Response (200):**
```json
{
  "period": "30d",
  "metrics": {
    "messages_sent": 5000,
    "messages_delivered": 4750,
    "delivery_rate": 95.0,
    "cost": 250.00,
    "contacts_added": 150,
    "campaigns_created": 5
  },
  "daily_breakdown": [
    {
      "date": "2025-11-01",
      "sent": 200,
      "delivered": 190,
      "cost": 10.00
    }
  ]
}
```

---

### Analytics Overview

**Endpoint:** `GET /api/messaging/analytics/overview/`

**Query Parameters:**
- `start_date` (date): Start date
- `end_date` (date): End date

**Success Response (200):**
```json
{
  "period": {
    "start": "2025-11-01T00:00:00Z",
    "end": "2025-11-27T23:59:59Z"
  },
  "overview": {
    "total_messages": 10000,
    "delivered": 9500,
    "failed": 500,
    "delivery_rate": 95.0,
    "total_cost": 500.00,
    "average_cost_per_message": 0.05
  },
  "by_status": {
    "sent": 10000,
    "delivered": 9500,
    "failed": 500
  },
  "by_day": [
    {
      "date": "2025-11-01",
      "sent": 500,
      "delivered": 475,
      "failed": 25
    }
  ]
}
```

---

### Recent Activity

**Endpoint:** `GET /api/messaging/activity/recent/`

**Query Parameters:**
- `limit` (integer): Number of activities (default: 20)

**Success Response (200):**
```json
{
  "count": 20,
  "activities": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "campaign_created",
      "description": "Created campaign 'Holiday Promotion'",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe"
      },
      "timestamp": "2025-11-27T10:30:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "type": "sms_sent",
      "description": "Sent SMS to +255614853618",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe"
      },
      "timestamp": "2025-11-27T10:25:00Z"
    }
  ]
}
```

---

## Error Handling

### Standard Error Response Format

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field_name": ["Error message for this field"]
  }
}
```

### HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Request successful, no content to return
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **402 Payment Required**: Insufficient credits/balance
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Responses

**401 Unauthorized:**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**403 Forbidden:**
```json
{
  "detail": "You do not have permission to perform this action."
}
```

**404 Not Found:**
```json
{
  "error": "Not found",
  "message": "The requested resource was not found."
}
```

**400 Validation Error:**
```json
{
  "field_name": [
    "This field is required.",
    "This field may not be blank."
  ],
  "another_field": [
    "Invalid value."
  ]
}
```

**402 Payment Required:**
```json
{
  "error": "Insufficient credits",
  "message": "You need 10 credits to perform this action. Current balance: 5 credits",
  "required_credits": 10,
  "current_balance": 5
}
```

---

## Authentication Headers

All authenticated endpoints require the following header:

```
Authorization: Bearer {access_token}
```

The access token is obtained from the login endpoint and should be included in all subsequent requests.

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1638000000
```

---

## Pagination

List endpoints support pagination with the following query parameters:
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)

Pagination response format:

```json
{
  "count": 150,
  "next": "https://api.example.com/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Date Formats

All dates are returned in ISO 8601 format:

```
2025-11-27T10:30:00Z
```

When sending dates in requests, use the same format or:
- Date only: `2025-11-27`
- Date and time: `2025-11-27T10:30:00Z`

---

## Phone Number Format

Phone numbers should be in E.164 format:

- Correct: `+255614853618`
- Incorrect: `0614853618`, `255614853618`

The API will attempt to normalize phone numbers, but it's recommended to send them in E.164 format.

---

## Support

For API support, contact:

- **Email**: support@mifumolabs.com
- **Documentation**: https://docs-sms.mifumolabs.com

---

**Last Updated**: November 2025
**API Version**: 1.0


