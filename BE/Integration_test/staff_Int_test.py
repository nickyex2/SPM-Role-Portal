import unittest
import requests
import json

class TestStaffAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = "http://192.168.18.193:5000"
        self.staff_id = "1"  # Change this to the staff ID you want to use for testing

    def test_get_all_staff(self):
        response = requests.get(f"{self.base_url}/getAllStaff")
        data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertTrue("staffs" in data["data"])
        print("test_get_all_staff PASSED")

    def test_get_staff_by_id(self):
        response = requests.get(f"{self.base_url}/getStaff/{self.staff_id}")
        if response.status_code == 200:
            data = response.json()
            self.assertEqual(data["data"]["staff_id"], int(self.staff_id))
            print("test_get_staff_by_id PASSED")
        else:
            self.assertEqual(response.status_code, 404)
            print("test_get_staff_by_id FAILED")


    def test_create_existing_staff(self):
        existing_staff_data = {
            "fname": "Jane",
            "lname": "Smith",
            "dept": "HR",
            "phone": "987-654-3210",
            "email": "jane.smith@example.com",
            "biz_address": "456 Elm St",
            "sys_role": "hr"
        }

        response = requests.post(f"{self.base_url}/createStaff/{self.staff_id}", json=existing_staff_data)
        data = response.json()

        self.assertEqual(response.status_code, 410)
        self.assertEqual(data["message"], "Staff already exists.")
        print("test_create_existing_staff PASSED")

    def test_get_nonexistent_staff_by_id(self):
        response = requests.get(f"{self.base_url}/getStaff/1000")  # Nonexistent staff ID
        self.assertEqual(response.status_code, 404)
        print("test_get_nonexistent_staff_by_id PASSED")

if __name__ == '__main__':
    unittest.main()
