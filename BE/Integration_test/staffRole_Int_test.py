import unittest
import requests

# Define the base URL of the Staff Role microservice.
BASE_URL = 'http://localhost:5000'

class StaffRoleIntegrationTests(unittest.TestCase):

    def test_create_staff_role(self):
        # Test Case 1: Create a new Staff Role
        data = {
            "staff_id": 1,
            "staff_role": 2,
            "role_type": "primary",
            "sr_status": "active"
        }

        response = requests.post(f'{BASE_URL}/createStaffRole', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create Staff Role) - Passed")

    def test_get_staff_role_by_ids(self):
        # Test Case 2: Get Staff Role by staff_id and staff_role
        staff_id = 1
        staff_role = 2
        response = requests.get(f'{BASE_URL}/getStaffRole/{staff_id}/{staff_role}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        self.assertEqual(response.json()['data']['staff_role'], staff_role)
        print("Test Case 2 (Get Staff Role by staff_id and staff_role) - Passed")

    def test_get_staff_roles_by_staff_id(self):
        # Test Case 3: Get Staff Roles by staff_id
        staff_id = 1
        response = requests.get(f'{BASE_URL}/getStaffRolesOfSpecificStaff/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['staff_roles']) > 0)
        print("Test Case 3 (Get Staff Roles by staff_id) - Passed")

    def test_update_staff_role(self):
        # Test Case 4: Update a Staff Role by staff_id and staff_role
        staff_id = 1
        staff_role = 2
        data = {
            "role_type": "secondary",
            "sr_status": "inactive"
        }
        response = requests.put(f'{BASE_URL}/updateStaffRole/{staff_id}/{staff_role}', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['role_type'], "secondary")
        self.assertEqual(response.json()['data']['sr_status'], "inactive")
        print("Test Case 4 (Update a Staff Role) - Passed")

    def test_delete_staff_role(self):
        # Test Case 5: Delete a Staff Role by staff_id and staff_role
        staff_id = 1
        staff_role = 2
        response = requests.delete(f'{BASE_URL}/deleteStaffRole/{staff_id}/{staff_role}')
        self.assertEqual(response.status_code, 200)
        print("Test Case 5 (Delete a Staff Role) - Passed")

if __name__ == "__main__":
    unittest.main()
