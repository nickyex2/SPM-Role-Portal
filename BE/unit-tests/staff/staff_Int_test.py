import unittest
import requests
import json
import os
from dotenv import load_dotenv

# Create Staff Read-Only API Unit Tests
load_dotenv()
class TestStaffAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = os.environ.get("BASE_URL") + "/api/staff"
        self.staff_id = "1"  # Change this to the staff ID you want to use for testing

    def test_get_all_staff(self):
        response = requests.get(f"{self.base_url}/getAll")
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue("staffs" in data["data"])
        print("Test Case - Get All Staff - PASSED")

    def test_get_staff_by_id(self):
        response = requests.get(f"{self.base_url}/getOne/{self.staff_id}")
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data["data"]["staff_id"], int(self.staff_id))
            print("Test Case - Get Staff by ID - PASSED")
        else:
            self.assertEqual(response.status_code, 404)
            print("Test Case - Get Staff by ID - FAILED")


    def test_get_multiple_staff_data(self):
        existing_staff_data = [
            {
                "staff_id": 1,
                "fname": "AH GAO",
                "lname": "TAN",
                "dept": "FINANCE",
                "phone": "65 1234 5678",
                "email": "tan_ah_gao@all-in-one.com.sg",
                "biz_address": "1, Marina Boulevard, Singapore 018989",
                "sys_role": "staff"
            }, {
                "staff_id": 6,
                "fname": "JANE",
                "lname": "GOH",
                "dept": "IT",
                "phone": "65 1734 5678",
                "email": "jane_goh@all-in-one.com.sg",
                "biz_address": "1, Marina Boulevard, Singapore 018989",
                "sys_role": "manager"
            }
        ]
        staff_ids = [1, 6]
        response = requests.post(f"{self.base_url}/getMulti", json={"staff_ids":staff_ids})
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(data['data']['staff'], existing_staff_data)
        print("Test Case - Get Multiple Staff Data - PASSED")

    def test_get_nonexistent_staff_by_id(self):
        response = requests.get(f"{self.base_url}/getStaff/1000")  # Nonexistent staff ID
        self.assertEqual(response.status_code, 404)
        print("Test Case - Get Nonexistent Staff by ID - PASSED")

if __name__ == '__main__':
    unittest.main()
