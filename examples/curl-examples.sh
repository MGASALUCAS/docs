#!/bin/bash

# Mifumo SMS API - cURL Examples
#
# This script demonstrates how to use the Mifumo SMS API with cURL
# Make sure to replace the placeholders with your actual values

BASE_URL="https://mifumosms.mifumolabs.com/api"
EMAIL="user@example.com"
PASSWORD="SecurePassword123!"
ACCESS_TOKEN=""  # Will be set after login

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mifumo SMS API cURL Examples ===${NC}\n"

# 1. Register User
echo -e "${GREEN}1. Register User${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register/" \
  -H "Content-Type: application/json" \
  -d '{
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
  }')

echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# 2. Login
echo -e "${GREEN}2. Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.access')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.refresh')

echo "$LOGIN_RESPONSE" | jq '.'
echo -e "\nAccess Token: ${ACCESS_TOKEN:0:50}...\n"

# 3. Get User Profile
echo -e "${GREEN}3. Get User Profile${NC}"
PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/profile/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# 4. Get SMS Balance
echo -e "${GREEN}4. Get SMS Balance${NC}"
BALANCE_RESPONSE=$(curl -s -X GET "${BASE_URL}/messaging/sms/balance/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$BALANCE_RESPONSE" | jq '.'
echo ""

# 5. Send SMS
echo -e "${GREEN}5. Send SMS${NC}"
SEND_SMS_RESPONSE=$(curl -s -X POST "${BASE_URL}/messaging/sms/send/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "+255614853618",
    "message": "Hello from Mifumo SMS API!",
    "sender_id": "MIFUMO"
  }')

echo "$SEND_SMS_RESPONSE" | jq '.'
echo ""

# 6. List Contacts
echo -e "${GREEN}6. List Contacts${NC}"
CONTACTS_RESPONSE=$(curl -s -X GET "${BASE_URL}/messaging/contacts/?page=1&page_size=20" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$CONTACTS_RESPONSE" | jq '.'
echo ""

# 7. Create Contact
echo -e "${GREEN}7. Create Contact${NC}"
CREATE_CONTACT_RESPONSE=$(curl -s -X POST "${BASE_URL}/messaging/contacts/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone_e164": "+255712345678",
    "email": "john@example.com",
    "attributes": {
      "company": "Example Corp",
      "position": "Manager"
    },
    "tags": ["VIP", "Customer"]
  }')

echo "$CREATE_CONTACT_RESPONSE" | jq '.'
echo ""

# 8. Create Campaign
echo -e "${GREEN}8. Create Campaign${NC}"
CREATE_CAMPAIGN_RESPONSE=$(curl -s -X POST "${BASE_URL}/messaging/campaigns/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Holiday Promotion",
    "message": "Special holiday offer! Get 20% off",
    "recipients": ["+255614853618", "+255712345678"],
    "sender_id": "MIFUMO",
    "scheduled_at": "2025-12-01T10:00:00Z"
  }')

echo "$CREATE_CAMPAIGN_RESPONSE" | jq '.'
echo ""

# 9. Get Dashboard Overview
echo -e "${GREEN}9. Get Dashboard Overview${NC}"
DASHBOARD_RESPONSE=$(curl -s -X GET "${BASE_URL}/messaging/dashboard/overview/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$DASHBOARD_RESPONSE" | jq '.'
echo ""

# 10. Refresh Token
echo -e "${GREEN}10. Refresh Token${NC}"
REFRESH_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/token/refresh/" \
  -H "Content-Type: application/json" \
  -d "{
    \"refresh\": \"${REFRESH_TOKEN}\"
  }")

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.access')
echo "$REFRESH_RESPONSE" | jq '.'
echo -e "\nNew Access Token: ${NEW_ACCESS_TOKEN:0:50}...\n"

# 11. List SMS Packages
echo -e "${GREEN}11. List SMS Packages${NC}"
PACKAGES_RESPONSE=$(curl -s -X GET "${BASE_URL}/billing/sms/packages/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$PACKAGES_RESPONSE" | jq '.'
echo ""

# 12. Get SMS Stats
echo -e "${GREEN}12. Get SMS Stats${NC}"
STATS_RESPONSE=$(curl -s -X GET "${BASE_URL}/messaging/sms/stats/" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

echo "$STATS_RESPONSE" | jq '.'
echo ""

echo -e "${GREEN}=== Examples Complete ===${NC}"

