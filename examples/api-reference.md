# Mifumo SMS - Complete API Reference

This document provides a comprehensive reference for all Mifumo SMS API endpoints.

**Base URL:** `https://mifumosms.mifumolabs.com/api/`  
**API Version:** 1.0  
**Authentication:** JWT Bearer Token

## Quick Links

- [Authentication](#authentication)
- [User Management](#user-management)
- [SMS Operations](#sms-operations)
- [Contact Management](#contact-management)
- [Campaign Management](#campaign-management)
- [Template Management](#template-management)
- [Billing & Payments](#billing--payments)
- [Tenant Management](#tenant-management)
- [Notifications](#notifications)
- [Sender ID Management](#sender-id-management)
- [Dashboard & Analytics](#dashboard--analytics)

## Authentication

### Register User
**POST** `/api/auth/register/`

Register a new user account.

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

**Response (201):**
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

### Login
**POST** `/api/auth/login/`

Authenticate and receive access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
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

### Refresh Token
**POST** `/api/auth/token/refresh/`

Refresh an expired access token.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Logout
**POST** `/api/auth/logout/`

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

## SMS Operations

### Send SMS
**POST** `/api/messaging/sms/send/`

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "recipient": "+255614853618",
  "message": "Hello, this is a test message",
  "sender_id": "MIFUMO"
}
```

**Response (201):**
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

### Get SMS Balance
**GET** `/api/messaging/sms/balance/`

**Response (200):**
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

### Get SMS Stats
**GET** `/api/messaging/sms/stats/`

**Response (200):**
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

## Contact Management

### List Contacts
**GET** `/api/messaging/contacts/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `search` (string): Search term
- `tags` (string): Filter by tags (comma-separated)

**Response (200):**
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

### Create Contact
**POST** `/api/messaging/contacts/`

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

## Campaign Management

### List Campaigns
**GET** `/api/messaging/campaigns/`

**Query Parameters:**
- `page` (integer): Page number
- `page_size` (integer): Items per page
- `status` (string): Filter by status
- `search` (string): Search term

### Create Campaign
**POST** `/api/messaging/campaigns/`

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

## Billing & Payments

### List SMS Packages
**GET** `/api/billing/sms/packages/`

**Response (200):**
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
    }
  ]
}
```

### Purchase SMS Package
**POST** `/api/billing/sms/purchase/`

**Request Body:**
```json
{
  "package_id": "550e8400-e29b-41d4-a716-446655440000",
  "payment_method": "mobile_money",
  "provider": "mpesa"
}
```

## Error Handling

### Standard Error Response Format

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
- **402 Payment Required**: Insufficient credits/balance
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

API requests are rate-limited:
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Pagination

List endpoints support pagination:
- `page` (integer): Page number (default: 1)
- `page_size` (integer): Items per page (default: 20, max: 100)

## Phone Number Format

Phone numbers should be in E.164 format:
- ✅ Correct: `+255614853618`
- ❌ Incorrect: `0614853618`, `255614853618`

## Support

- **Email**: api@mifumo.com
- **Documentation**: https://docs.mifumo.com
- **Status Page**: https://status.mifumo.com

---

**Last Updated**: November 2025  
**API Version**: 1.0

