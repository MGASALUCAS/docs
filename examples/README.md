# Mifumo SMS API - Code Examples

This directory contains code examples demonstrating how to use the Mifumo SMS API in different programming languages.

## Files

- **api-reference.md** - Complete API reference documentation
- **javascript-example.js** - JavaScript/Node.js example
- **python-example.py** - Python example
- **curl-examples.sh** - Bash/cURL example script

## Prerequisites

### JavaScript/Node.js
- Node.js 14+ installed
- No additional dependencies required (uses native fetch API)

### Python
- Python 3.7+ installed
- Install required package:
  ```bash
  pip install requests
  ```

### cURL/Bash
- Bash shell
- cURL installed
- jq installed (for JSON parsing):
  ```bash
  # macOS
  brew install jq

  # Ubuntu/Debian
  sudo apt-get install jq
  ```

## Usage

### JavaScript Example

```bash
node javascript-example.js
```

Or import functions in your code:

```javascript
const { login, sendSMS, getSMSBalance } = require('./javascript-example');

// Login
await login('user@example.com', 'password');

// Send SMS
await sendSMS('+255614853618', 'Hello!', 'MIFUMO');

// Get balance
const balance = await getSMSBalance();
```

### Python Example

```bash
python python-example.py
```

Or use the client class:

```python
from python_example import MifumoSMSClient

client = MifumoSMSClient()
client.login('user@example.com', 'password')
client.send_sms('+255614853618', 'Hello!', 'MIFUMO')
balance = client.get_sms_balance()
```

### cURL Examples

Make the script executable and run:

```bash
chmod +x curl-examples.sh
./curl-examples.sh
```

Or run individual commands:

```bash
# Login
curl -X POST "https://mifumosms.mifumolabs.com/api/auth/login/" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Send SMS (replace ACCESS_TOKEN with your token)
curl -X POST "https://mifumosms.mifumolabs.com/api/messaging/sms/send/" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipient": "+255614853618", "message": "Hello!", "sender_id": "MIFUMO"}'
```

## Configuration

Before running the examples, update the following:

1. **Email and Password**: Replace `user@example.com` and `SecurePassword123!` with your actual credentials
2. **Phone Numbers**: Replace example phone numbers with valid E.164 format numbers
3. **Sender ID**: Replace `MIFUMO` with your approved sender ID

## API Base URL

All examples use the production API base URL:
```
https://mifumosms.mifumolabs.com/api
```

## Authentication

Most endpoints require authentication using a Bearer token. The examples demonstrate:

1. **Registration** - Create a new account
2. **Login** - Get access and refresh tokens
3. **Token Refresh** - Refresh expired access tokens
4. **Authenticated Requests** - Using Bearer tokens in headers

## Error Handling

The examples include basic error handling. Common errors:

- **401 Unauthorized** - Invalid or expired token (try refreshing)
- **402 Payment Required** - Insufficient credits/balance
- **400 Bad Request** - Invalid request data
- **404 Not Found** - Resource not found

## Rate Limiting

The API has rate limits:
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Support

For API support, contact:
- **Email**: support@mifumolabs.com
- **Documentation**: https://docs-sms.mifumolabs.com

