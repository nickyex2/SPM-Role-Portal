import unittest
import requests
import json

class TestRoleAPI(unittest.TestCase):

    base_url = "http://192.168.18.193:5000"  # Update with the correct URL

    def test_get_all_roles(self):
        response = requests.get(f"{self.base_url}/getAllRoles")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("roles" in data["data"])

    def test_get_role_by_id(self):
        role_id = 1  # Replace with an existing role ID
        response = requests.get(f"{self.base_url}/getRole/{role_id}")
        self.assertEqual(response.status_code, 200)

    def test_get_nonexistent_role_by_id(self):
        role_id = 1000  # Replace with a non-existent role ID
        response = requests.get(f"{self.base_url}/getRole/{role_id}")
        self.assertEqual(response.status_code, 404)

    def test_get_roles(self):
        data = {"role_ids": [1, 2]}  # Replace with valid role IDs
        response = requests.post(f"{self.base_url}/getRoles", json=data)
        self.assertEqual(response.status_code, 200)

    def test_get_nonexistent_roles(self):
        data = {"role_ids": [1000, 1001]}  # Replace with non-existent role IDs
        response = requests.post(f"{self.base_url}/getRoles", json=data)
        self.assertEqual(response.status_code, 404)

    def test_create_role(self):
        data = {
            "role_name": "Test Role",
            "role_description": "Test Role Description",
            "role_status": "active"
        }
        response = requests.post(f"{self.base_url}/createRole", json=data)
        self.assertEqual(response.status_code, 201)

    def test_update_role(self):
        role_id = 1  # Replace with an existing role ID
        data = {
            "role_name": "Updated Role Name"
        }
        response = requests.put(f"{self.base_url}/updateRole/{role_id}", json=data)
        self.assertEqual(response.status_code, 200)

    def test_update_nonexistent_role(self):
        role_id = 1000  # Replace with a non-existent role ID
        data = {
            "role_name": "Updated Role Name"
        }
        response = requests.put(f"{self.base_url}/updateRole/{role_id}", json=data)
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
