import unittest
import requests

# Define the base URL of the RoleSkills microservice.
BASE_URL = 'http://localhost:5000'

class RoleSkillsIntegrationTests(unittest.TestCase):

    def test_create_role_skills(self):
        # Test Case 1: Create a new RoleSkills association
        data = {
            "role_id": 1,
            "skill_id": 1
        }

        response = requests.post(f'{BASE_URL}/createRoleSkills', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create RoleSkills Association) - Passed")

    def test_get_all_role_skills(self):
        # Test Case 2: Get all RoleSkills associations
        response = requests.get(f'{BASE_URL}/getAllRoleSkills')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_skills']) > 0)
        print("Test Case 2 (Get All RoleSkills Associations) - Passed")

    def test_get_role_skills_by_role_id(self):
        # Test Case 3: Get RoleSkills associations by role_id
        role_id = 1
        response = requests.get(f'{BASE_URL}/getRoleSkills/{role_id}')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_skills']) > 0)
        print("Test Case 3 (Get RoleSkills by Role ID) - Passed")

    def test_get_specific_role_skills(self):
        # Test Case 4: Get specific RoleSkills associations by role_ids
        data = {
            "role_ids": [1, 2]
        }

        response = requests.post(f'{BASE_URL}/getSpecificRoleSkills', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']) > 0)
        print("Test Case 4 (Get Specific RoleSkills) - Passed")

    def test_delete_role_skills(self):
        # Test Case 5: Delete a RoleSkills association
        role_id = 1
        skill_id = 1

        response = requests.delete(f'{BASE_URL}/deleteRoleSkills/{role_id}/{skill_id}')
        self.assertEqual(response.status_code, 200)
        print("Test Case 5 (Delete RoleSkills Association) - Passed")

if __name__ == "__main__":
    unittest.main()
