import unittest
import requests

# Define the base URL of the Staff Reporting Officer microservice.
BASE_URL = 'http://localhost:5000'

class StaffReportingOfficerIntegrationTests(unittest.TestCase):

    def test_create_staff_reporting_officer(self):
        # Test Case 1: Create a new Staff Reporting Officer
        data = {
            "staff_id": 1,
            "RO_id": 2
        }

        response = requests.post(f'{BASE_URL}/createStaffReportingOfficer', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create Staff Reporting Officer) - Passed")

    def test_get_staff_reporting_officer_by_staff_id(self):
        # Test Case 2: Get Staff Reporting Officer by staff_id
        staff_id = 1
        response = requests.get(f'{BASE_URL}/getStaffReportingOfficer/{staff_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['staff_id'], staff_id)
        print("Test Case 2 (Get Staff Reporting Officer by staff_id) - Passed")

    def test_get_staff_reporting_officers_by_staff_id_not_found(self):
        # Test Case 3: Get Staff Reporting Officers by staff_id when not found
        staff_id = 12345  # Assuming this staff_id doesn't exist
        response = requests.get(f'{BASE_URL}/getStaffReportingOfficer/{staff_id}')
        self.assertEqual(response.status_code, 404)
        print("Test Case 3 (Get Staff Reporting Officers by staff_id when not found) - Passed")

if __name__ == "__main__":
    unittest.main()
