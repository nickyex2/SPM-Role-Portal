import unittest
import requests
import json
import os
from dotenv import load_dotenv

# Create Role Application API Tests
load_dotenv()
class TestRoleApplicationAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = os.environ.get("BASE_URL") + "/api/role/roleapp"
    
    def test_create_role_application(self):
        # Test Case 1: Create a new role application
        data = {
            "role_listing_id": 19458657,
            "staff_id": 5,
            "role_app_status": "applied"
        }

        response = requests.post(f'{self.base_url}/create', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case - Create Role Application - PASSED")

    def test_get_all_role_applications(self):
        # Test Case 2: Get all role applications
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_applications']) > 0)
        print("Test Case - Get All Role Applications - PASSED")

    def test_get_role_application_by_role_listing(self):
        # Test Case 3: Get role applications by role listing ID
        role_listing_id = 19458657
        response = requests.get(f'{self.base_url}/getOne/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']) > 0)
        print("Test Case - Get Role Applications by Role Listing - PASSED")

    def test_get_role_application_by_staff(self):
        # Test Case 4: Get role applications by staff ID
        staff_id = 5
        response = requests.get(f'{self.base_url}/getByStaff/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_applications']) > 0)
        print("Test Case 4 (Get Role Applications by Staff) - Passed")

    def test_get_role_application_by_role_listing_and_staff(self):
        # Test Case 5: Get role application by role listing ID and staff ID
        role_listing_id = 19458657
        staff_id = 5
        response = requests.get(f'{self.base_url}/getByRoleLStaff/{role_listing_id}/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_id'], role_listing_id)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        print("Test Case 5 (Get Role Application by Role Listing and Staff) - Passed")

    def test_update_role_application(self):
        # Test Case 6: Update role application
        role_listing_id = 19458657
        staff_id = 5
        res = requests.get(f'{self.base_url}/getByRoleLStaff/{role_listing_id}/{staff_id}')
        role_app_id = res.json()['data']['role_app_id']
        data = {
            "role_app_status": "withdrawn"
        }

        response = requests.put(f'{self.base_url}/update/{role_app_id}', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_app_status'], data['role_app_status'])
        print("Test Case 6 (Update Role Application) - Passed")

    def test_delete_role_application(self):
        # Test Case 7: Delete role application
        role_listing_id = 19458657
        staff_id = 5
        res = requests.get(f'{self.base_url}/getByRoleLStaff/{role_listing_id}/{staff_id}')
        role_app_id = res.json()['data']['role_app_id']

        response = requests.delete(f'{self.base_url}/delete/{role_app_id}')
        self.assertEqual(response.status_code, 200)
        print("Test Case 7 (Delete Role Application) - Passed")
    
if __name__ == "__main__":
    unittest.main()
