"""
Mifumo SMS API v2.0 - Python Example

This example demonstrates how to use the Mifumo SMS API v2.0 with Python
"""

import requests
import json
from typing import Optional, Dict, List, Any

BASE_URL = 'https://mifumosms.mifumolabs.com'
API_KEY = 'YOUR_API_KEY'  # Replace with your actual API key

class MifumoSMSClient:
    """Client for interacting with Mifumo SMS API v2.0"""

    def __init__(self, api_key: str = API_KEY):
        self.base_url = BASE_URL
        self.api_key = api_key
        self.session = requests.Session()

    def _get_headers(self) -> Dict[str, str]:
        """Get request headers"""
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

    def send_sms(self, message: str, recipients: List[str], sender_id: str,
                 tenant_account_id: Optional[str] = None) -> Dict[str, Any]:
        """Send SMS using the Core SMS API"""
        data = {
            'message': message,
            'recipients': recipients,
            'sender_id': sender_id,
        }

        if tenant_account_id:
            data['tenant_account_id'] = tenant_account_id

        response = self.session.post(
            f'{self.base_url}/api/integration/v1/sms/send/',
            headers=self._get_headers(),
            json=data
        )

        response.raise_for_status()
        return response.json()

    def check_message_status(self, message_id: str) -> Dict[str, Any]:
        """Check SMS message status"""
        response = self.session.get(
            f'{self.base_url}/api/integration/v1/sms/status/{message_id}/',
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

    def get_sms_balance(self) -> Dict[str, Any]:
        """Get SMS balance"""
        response = self.session.get(
            f'{self.base_url}/api/integration/v1/sms/balance/',
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_tenant(self, tenant_name: str, owner_email: str, owner_name: str,
                     contact_phone: str, initial_credits: int = 0) -> Dict[str, Any]:
        """Create a tenant account (White-Label API)"""
        data = {
            'tenant_name': tenant_name,
            'owner_email': owner_email,
            'owner_name': owner_name,
            'contact_phone': contact_phone,
            'initial_credits': initial_credits,
        }

        response = self.session.post(
            f'{self.base_url}/api/integration/v1/partner/tenants/create/',
            headers=self._get_headers(),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def initiate_tenant_payment(self, tenant_id: str, package_id: str,
                               buyer_email: str, buyer_name: str,
                               buyer_phone: str, mobile_money_provider: str) -> Dict[str, Any]:
        """Initiate payment for tenant (ZenoPay Mobile Money)"""
        data = {
            'package_id': package_id,
            'buyer_email': buyer_email,
            'buyer_name': buyer_name,
            'buyer_phone': buyer_phone,
            'mobile_money_provider': mobile_money_provider,
        }

        response = self.session.post(
            f'{self.base_url}/api/integration/v1/partner/tenants/{tenant_id}/payments/initiate/',
            headers=self._get_headers(),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def check_payment_status(self, tenant_id: str, transaction_id: str) -> Dict[str, Any]:
        """Check payment status"""
        response = self.session.get(
            f'{self.base_url}/api/integration/v1/partner/tenants/{tenant_id}/payments/{transaction_id}/status/',
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()
        """Login and get access tokens"""
        data = {
            'email': email,
            'password': password,
        }

        response = self.session.post(
            f'{self.base_url}/auth/login/',
            headers=self._get_headers(include_auth=False),
            json=data
        )
        response.raise_for_status()

        result = response.json()
        self.access_token = result['tokens']['access']
        self.refresh_token = result['tokens']['refresh']
        return result

    def refresh_token(self) -> Dict[str, Any]:
        """Refresh access token"""
        data = {
            'refresh': self.refresh_token,
        }

        response = self.session.post(
            f'{self.base_url}/auth/token/refresh/',
            headers=self._get_headers(include_auth=False),
            json=data
        )
        response.raise_for_status()

        result = response.json()
        self.access_token = result['access']
        return result

    def get_profile(self) -> Dict[str, Any]:
        """Get authenticated user profile"""
        response = self.session.get(
            f'{self.base_url}/auth/profile/',
            headers=self._get_headers()
        )

        if response.status_code == 401:
            # Try to refresh token
            self.refresh_token()
            response = self.session.get(
                f'{self.base_url}/auth/profile/',
                headers=self._get_headers()
            )

        response.raise_for_status()
        return response.json()

    def send_sms(self, recipient: str, message: str, sender_id: str) -> Dict[str, Any]:
        """Send SMS"""
        data = {
            'recipient': recipient,
            'message': message,
            'sender_id': sender_id,
        }

        response = self.session.post(
            f'{self.base_url}/messaging/sms/send/',
            headers=self._get_headers(),
            json=data
        )

        if response.status_code == 402:
            error_data = response.json()
            raise Exception(f"Insufficient credits: {error_data.get('message')}")

        response.raise_for_status()
        return response.json()

    def get_sms_balance(self) -> Dict[str, Any]:
        """Get SMS balance"""
        response = self.session.get(
            f'{self.base_url}/messaging/sms/balance/',
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

    def list_contacts(self, page: int = 1, page_size: int = 20,
                     search: Optional[str] = None,
                     tags: Optional[str] = None) -> Dict[str, Any]:
        """List contacts with pagination"""
        params = {
            'page': page,
            'page_size': page_size,
        }

        if search:
            params['search'] = search
        if tags:
            params['tags'] = tags

        response = self.session.get(
            f'{self.base_url}/messaging/contacts/',
            headers=self._get_headers(),
            params=params
        )
        response.raise_for_status()
        return response.json()

    def create_contact(self, name: str, phone_e164: str,
                      email: Optional[str] = None,
                      attributes: Optional[Dict[str, Any]] = None,
                      tags: Optional[List[str]] = None) -> Dict[str, Any]:
        """Create a new contact"""
        data = {
            'name': name,
            'phone_e164': phone_e164,
        }

        if email:
            data['email'] = email
        if attributes:
            data['attributes'] = attributes
        if tags:
            data['tags'] = tags

        response = self.session.post(
            f'{self.base_url}/messaging/contacts/',
            headers=self._get_headers(),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def create_campaign(self, name: str, message: str,
                        recipients: Optional[List[str]] = None,
                        sender_id: Optional[str] = None,
                        scheduled_at: Optional[str] = None,
                        segment_ids: Optional[List[str]] = None,
                        contact_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        """Create a campaign"""
        data = {
            'name': name,
            'message': message,
        }

        if recipients:
            data['recipients'] = recipients
        if sender_id:
            data['sender_id'] = sender_id
        if scheduled_at:
            data['scheduled_at'] = scheduled_at
        if segment_ids:
            data['segment_ids'] = segment_ids
        if contact_ids:
            data['contact_ids'] = contact_ids

        response = self.session.post(
            f'{self.base_url}/messaging/campaigns/',
            headers=self._get_headers(),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def get_dashboard_overview(self) -> Dict[str, Any]:
        """Get dashboard overview"""
        response = self.session.get(
            f'{self.base_url}/messaging/dashboard/overview/',
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()


# Example usage
if __name__ == '__main__':
    # Initialize client with your API key
    client = MifumoSMSClient(api_key='YOUR_API_KEY')

    try:
        # Get SMS balance
        balance = client.get_sms_balance()
        print(f'Current Balance: {json.dumps(balance, indent=2)}')

        # Send SMS
        sms_result = client.send_sms(
            message='Hello from Mifumo SMS API v2.0!',
            recipients=['+255614853618'],
            sender_id='QUANTUM'
        )
        print(f'SMS sent: {json.dumps(sms_result, indent=2)}')

        # Check message status (if SMS was sent successfully)
        if sms_result.get('success') and sms_result.get('message_id'):
            import time
            time.sleep(5)  # Wait 5 seconds
            status = client.check_message_status(sms_result['message_id'])
            print(f'Message status: {json.dumps(status, indent=2)}')

        # Create a tenant account (White-Label)
        tenant = client.create_tenant(
            tenant_name='Restaurant Chain A',
            owner_email='owner@restaurant.com',
            owner_name='John Doe',
            contact_phone='+255123456789',
            initial_credits=0
        )
        print(f'Tenant created: {json.dumps(tenant, indent=2)}')

        # Initiate payment for tenant (if tenant was created successfully)
        if tenant.get('success') and tenant.get('data', {}).get('mifumo_account_id'):
            tenant_id = tenant['data']['mifumo_account_id']
            payment = client.initiate_tenant_payment(
                tenant_id=tenant_id,
                package_id='uuid-of-starter-package',  # Get from list packages endpoint
                buyer_email='buyer@restaurant.com',
                buyer_name='Jane Smith',
                buyer_phone='0614853618',
                mobile_money_provider='vodacom'
            )
            print(f'Payment initiated: {json.dumps(payment, indent=2)}')

            # Check payment status (if payment was initiated successfully)
            if payment.get('success') and payment.get('data', {}).get('transaction_id'):
                transaction_id = payment['data']['transaction_id']
                import time
                time.sleep(10)  # Wait 10 seconds for payment processing
                payment_status = client.check_payment_status(tenant_id, transaction_id)
                print(f'Payment status: {json.dumps(payment_status, indent=2)}')

    except requests.exceptions.HTTPError as e:
        print(f'HTTP Error: {e}')
        if e.response is not None:
            print(f'Response: {e.response.text}')
    except Exception as e:
        print(f'Error: {e}')

