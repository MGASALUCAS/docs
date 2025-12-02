"""
Mifumo SMS API - Python Example

This example demonstrates how to use the Mifumo SMS API with Python
"""

import requests
import json
from typing import Optional, Dict, List, Any

BASE_URL = 'https://mifumosms.mifumolabs.com/api'

class MifumoSMSClient:
    """Client for interacting with Mifumo SMS API"""

    def __init__(self):
        self.base_url = BASE_URL
        self.access_token = None
        self.refresh_token = None
        self.session = requests.Session()

    def _get_headers(self, include_auth: bool = True) -> Dict[str, str]:
        """Get request headers"""
        headers = {
            'Content-Type': 'application/json',
        }
        if include_auth and self.access_token:
            headers['Authorization'] = f'Bearer {self.access_token}'
        return headers

    def register_user(self, email: str, first_name: str, last_name: str,
                     phone_number: str, password: str, password_confirm: str,
                     timezone: str = 'Africa/Dar_es_Salaam',
                     business_name: Optional[str] = None,
                     company_name: Optional[str] = None,
                     subdomain: Optional[str] = None,
                     country: str = 'Tanzania') -> Dict[str, Any]:
        """Register a new user"""
        data = {
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'phone_number': phone_number,
            'password': password,
            'password_confirm': password_confirm,
            'timezone': timezone,
            'country': country,
        }

        if business_name:
            data['business_name'] = business_name
        if company_name:
            data['company_name'] = company_name
        if subdomain:
            data['subdomain'] = subdomain

        response = self.session.post(
            f'{self.base_url}/auth/register/',
            headers=self._get_headers(include_auth=False),
            json=data
        )
        response.raise_for_status()
        return response.json()

    def login(self, email: str, password: str) -> Dict[str, Any]:
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
    # Initialize client
    client = MifumoSMSClient()

    try:
        # Login
        login_result = client.login('user@example.com', 'SecurePassword123!')
        print('Login successful')

        # Get profile
        profile = client.get_profile()
        print(f'Profile: {json.dumps(profile, indent=2)}')

        # Get balance
        balance = client.get_sms_balance()
        print(f'Balance: {json.dumps(balance, indent=2)}')

        # Send SMS
        sms_result = client.send_sms(
            recipient='+255614853618',
            message='Hello from Mifumo SMS API!',
            sender_id='MIFUMO'
        )
        print(f'SMS sent: {json.dumps(sms_result, indent=2)}')

        # List contacts
        contacts = client.list_contacts(page=1, page_size=20)
        print(f'Contacts: {json.dumps(contacts, indent=2)}')

        # Create contact
        contact = client.create_contact(
            name='John Doe',
            phone_e164='+255712345678',
            email='john@example.com',
            tags=['VIP', 'Customer']
        )
        print(f'Contact created: {json.dumps(contact, indent=2)}')

        # Get dashboard
        dashboard = client.get_dashboard_overview()
        print(f'Dashboard: {json.dumps(dashboard, indent=2)}')

    except requests.exceptions.HTTPError as e:
        print(f'HTTP Error: {e}')
        if e.response is not None:
            print(f'Response: {e.response.text}')
    except Exception as e:
        print(f'Error: {e}')

