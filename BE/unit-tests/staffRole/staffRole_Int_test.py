import unittest
import requests
import os
from dotenv import load_dotenv

# Create StaffRole Read-Only API Unit Tests
load_dotenv()
class TestStaffRoleAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = os.getenv('BASE_URL') + '/api/staff/staffRole'

    def test_get_all_staff_roles(self):
        # Test Case 1: Get All Staff Roles
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue("staff_roles" in response.json()['data'])
        print("Test Case - Get All Staff Roles - PASSED")

    def test_get_staff_role_by_id_and_role(self):
        # Test Case 2: Get Staff Role by staff_id and staff_role
        staff_id = 1
        staff_role = 38
        response = requests.get(f'{self.base_url}/getOne/{staff_id}/{staff_role}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        self.assertEqual(response.json()['data']['staff_role'], staff_role)
        print("Test Case - Get Staff Role by staff_id and staff_role - PASSED")

    def test_get_staff_roles_by_staff_id(self):
        # Test Case 3: Get Staff Roles by staff_id
        staff_id = 1
        existing_staff_roles = [
            {
                "staff_id": 1,
                "staff_role": 38,
                "role_type": "primary",
                "sr_status": "active"
            },
            {
                "staff_id": 1,
                "staff_role": 67,
                "role_type": "secondary",
                "sr_status": "active"
            }
        ]
        response = requests.get(f'{self.base_url}/getByStaff/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['staff_roles']) == 2)
        self.assertCountEqual(response.json()['data']['staff_roles'], existing_staff_roles)
        print("Test Case - Get Staff Roles by staff_id - PASSED")


if __name__ == "__main__":
    unittest.main()
