import unittest
import requests

# Define the base URL of the Role Listing microservice.
BASE_URL = 'http://localhost:5000'

class RoleListingIntegrationTests(unittest.TestCase):

    def test_create_role_listing(self):
        # Test Case 1: Create a new role listing
        data = {
            "role_id": 1,
            "role_listing_desc": "Test Role Listing",
            "role_listing_source": 1,
            "role_listing_open": "2023-09-01",
            "role_listing_close": "2023-09-30",
            "role_listing_creator": 1,
            "role_listing_status": "active",
            "role_listing_updater": 1
        }

        response = requests.post(f'{BASE_URL}/createRoleListing', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create Role Listing) - Passed")

    def test_get_all_role_listings(self):
        # Test Case 2: Get all role listings
        response = requests.get(f'{BASE_URL}/getAllRoleListings')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_listings']) > 0)
        print("Test Case 2 (Get All Role Listings) - Passed")

    def test_get_role_listing_by_id(self):
        # Test Case 3: Get role listing by ID
        role_listing_id = 1
        response = requests.get(f'{BASE_URL}/getRoleListing/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_id'], role_listing_id)
        print("Test Case 3 (Get Role Listing by ID) - Passed")

    def test_update_role_listing(self):
        # Test Case 4: Update role listing
        role_listing_id = 1
        data = {
            "role_listing_desc": "Updated Role Listing Description",
            "role_listing_open": "2023-09-15",
            "role_listing_status": "inactive",
            "role_listing_updater": 2
        }

        response = requests.put(f'{BASE_URL}/updateRoleListing/{role_listing_id}', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_desc'], data['role_listing_desc'])
        self.assertEqual(response.json()['data']['role_listing_open'], data['role_listing_open'])
        self.assertEqual(response.json()['data']['role_listing_status'], data['role_listing_status'])
        self.assertEqual(response.json()['data']['role_listing_updater'], data['role_listing_updater'])
        print("Test Case 4 (Update Role Listing) - Passed")

    def test_get_role_listing_changes(self):
        # Test Case 5: Get role listing changes
        role_listing_id = 1
        response = requests.get(f'{BASE_URL}/getRoleListingChanges/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_listing_changes']) > 0)
        print("Test Case 5 (Get Role Listing Changes) - Passed")

if __name__ == "__main__":
    unittest.main()
