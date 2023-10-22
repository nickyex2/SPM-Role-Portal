import unittest
import requests

# Define the base URL of the Role Application microservice.
BASE_URL = 'http://localhost:5000'

class RoleApplicationIntegrationTests(unittest.TestCase):

    def test_create_role_application(self):
        # Test Case 1: Create a new role application
        data = {
            "role_listing_id": 1,
            "staff_id": 1,
            "role_app_status": "applied"
        }

        response = requests.post(f'{BASE_URL}/createRoleApplication', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create Role Application) - Passed")

    def test_get_all_role_applications(self):
        # Test Case 2: Get all role applications
        response = requests.get(f'{BASE_URL}/getAllRoleApplications')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_applications']) > 0)
        print("Test Case 2 (Get All Role Applications) - Passed")

    def test_get_role_application_by_role_listing(self):
        # Test Case 3: Get role applications by role listing ID
        role_listing_id = 1
        response = requests.get(f'{BASE_URL}/getRoleApplicationsListing/{role_listing_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']) > 0)
        print("Test Case 3 (Get Role Applications by Role Listing) - Passed")

    def test_get_role_application_by_staff(self):
        # Test Case 4: Get role applications by staff ID
        staff_id = 1
        response = requests.get(f'{BASE_URL}/getRoleApplicationsStaff/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_applications']) > 0)
        print("Test Case 4 (Get Role Applications by Staff) - Passed")

    def test_get_role_application_by_role_listing_and_staff(self):
        # Test Case 5: Get role application by role listing ID and staff ID
        role_listing_id = 1
        staff_id = 1
        response = requests.get(f'{BASE_URL}/getRoleApplication/{role_listing_id}/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_listing_id'], role_listing_id)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        print("Test Case 5 (Get Role Application by Role Listing and Staff) - Passed")

    def test_update_role_application(self):
        # Test Case 6: Update role application
        role_app_id = 1
        data = {
            "role_app_status": "withdrawn"
        }

        response = requests.put(f'{BASE_URL}/updateRoleApplication/{role_app_id}', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_app_status'], data['role_app_status'])
        print("Test Case 6 (Update Role Application) - Passed")

    def test_delete_role_application(self):
        # Test Case 7: Delete role application
        role_app_id = 1

        response = requests.delete(f'{BASE_URL}/deleteRoleApplication/{role_app_id}')
        self.assertEqual(response.status_code, 200)
        print("Test Case 7 (Delete Role Application) - Passed")

if __name__ == "__main__":
    unittest.main()
