import unittest
import requests
import json
import os
from dotenv import load_dotenv

# Create Role Read-Only API Unit Tests 
load_dotenv()
class TestRoleAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = os.getenv("BASE_URL") + "/api/role"

    def test_get_all_roles(self):
        response = requests.get(f"{self.base_url}/getAll")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("roles" in data["data"])
        self.assertTrue(len(data["data"]["roles"]) > 0)
        print("Test Case - Get All Roles - PASSED")

    def test_get_role_by_id(self):
        role_id = 1  # Replace with an existing role ID
        response = requests.get(f"{self.base_url}/getOne/{role_id}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["data"]["role_id"], role_id)
        print("Test Case - Get Role By ID - PASSED")

    def test_get_nonexistent_role_by_id(self):
        role_id = 1000  # Replace with a non-existent role ID
        response = requests.get(f"{self.base_url}/getRole/{role_id}")
        self.assertEqual(response.status_code, 404)
        print("Test Case - Get Non-existent Role By ID - PASSED")

    def test_get_roles(self):
        data = {"role_ids": [1, 2]}  # Replace with valid role IDs
        existing_data = [
            {"role_id": 1, "role_name": "Data Scientist", "role_description": "Data Scientist", "role_status": "active"},
            {"role_id": 2, "role_name": "Data Engineer", "role_description": "Data Engineer", "role_status": "active"}
        ]
        response = requests.post(f"{self.base_url}/getMulti", json=data)
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.json()["data"], existing_data)
        print("Test Case - Get Multiple Roles by ID - PASSED")

if __name__ == '__main__':
    unittest.main()
