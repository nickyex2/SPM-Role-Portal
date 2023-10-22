import unittest
import requests
import os
from dotenv import load_dotenv

# Create StaffRO Read-Only API Unit Tests
load_dotenv()
class TestStaffROAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = os.getenv('BASE_URL') + '/api/staff/staffRO'

    def test_get_all_staff_reporting_officers(self):
        # Test Case 1: Get All Staff Reporting Officers
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue("staff_reporting_officers" in response.json()['data'])
        print("Test Case - Get All Staff Reporting Officers - PASSED")

    def test_get_staff_reporting_officer_by_staff_id(self):
        # Test Case 2: Get Staff Reporting Officer by staff_id
        staff_id = 1
        response = requests.get(f'{self.base_url}/getOne/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        print("Test Case - Get Staff Reporting Officer by staff_id - PASSED")

    def test_get_staff_reporting_officers_by_staff_id_not_found(self):
        # Test Case 3: Get Staff Reporting Officers by staff_id when not found
        staff_id = 12345  # Assuming this staff_id doesn't exist
        response = requests.get(f'{self.base_url}/getOne/{staff_id}')
        self.assertEqual(response.status_code, 404)
        print("Test Case - Get Staff Reporting Officers by staff_id when not found - PASSED")

if __name__ == "__main__":
    unittest.main()
