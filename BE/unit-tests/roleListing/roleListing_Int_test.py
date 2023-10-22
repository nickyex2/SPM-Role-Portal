import unittest
import requests
import os
from dotenv import load_dotenv

# Create Role Listing API Test Cases
load_dotenv()
class TestRoleListingAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = os.environ.get('BASE_URL') + '/api/role/roleListing'

    @classmethod
    def tearDownClass(cls):
        role_listing_id = 123456789
        response = requests.delete(f'{os.environ.get("BASE_URL")}/delete/{role_listing_id}')
        print("Deleting test role listing with ID 123456789", response.status_code)


    def test_create_role_listing(self):
        # Test Case 1: Create a new role listing
        data = {
            "role_listing_id": 123456789,
            "role_id": 1,
            "role_listing_desc": "Test Role Listing",
            "role_listing_source": 3,
            "role_listing_open": "2023-09-01",
            "role_listing_close": "2023-09-30",
            "role_listing_creator": 3,
            "role_listing_status": "active",
            "role_listing_updater": 3
        }

        response = requests.post(f'{self.base_url}/create', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case - Create Role Listing - PASSED")

    def test_get_all_role_listings(self):
        # Test Case 2: Get all role listings
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_listings']) > 0)
        print("Test Case - Get All Role Listings - PASSED")

    def test_get_role_listing_by_id(self):
        # Test Case 3: Get role listing by ID
        role_listing_id = 123456789
        response = requests.get(f'{self.base_url}/getOne/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_id'], role_listing_id)
        print("Test Case - Get Role Listing By ID - PASSED")

    def test_update_role_listing(self):
        # Test Case 4: Update role listing and get changes
        role_listing_id = 123456789
        data = {
            "role_listing_desc": "Test Role Listing",
            "role_listing_open": "2023-09-01",
            "role_listing_close": "2023-09-30",
            "role_listing_status": "inactive",
            "role_listing_updater": 2
        }

        response = requests.put(f'{self.base_url}/update/{role_listing_id}', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_desc'], data['role_listing_desc'])
        self.assertEqual(response.json()['data']['role_listing_open'], data['role_listing_open'])
        self.assertEqual(response.json()['data']['role_listing_status'], data['role_listing_status'])
        self.assertEqual(response.json()['data']['role_listing_updater'], data['role_listing_updater'])
        response = requests.get(f'{self.base_url}/getChanges/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_listing_changes']) > 0)
        print("Test Case - Update Role Listing And Get Changes - PASSED")

if __name__ == "__main__":
    unittest.main()
