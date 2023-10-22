import unittest
import requests
import os
from dotenv import load_dotenv

# Create RoleSkills Read Only API Test Cases
load_dotenv()
class TestRoleSkillsAPI(unittest.TestCase):

    def setUp(self):
        self.base_url = os.environ.get('BASE_URL') + '/api/role/roleSkills'

    def test_get_all_role_skills(self):
        # Test Case 1: Get all RoleSkills associations
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['role_skills']) > 0)
        print("Test Case - Get All RoleSkills - PASSED")

    def test_get_role_skills_by_role_id(self):
        # Test Case 2: Get RoleSkills associations by role_id
        role_id = 1
        existing_data = [
            {
                "role_id": 1,
                "skill_id": 1
            },
            {
                "role_id": 1,
                "skill_id": 2
            },
            {
                "role_id": 1,
                "skill_id": 4
            },
            {
                "role_id": 1,
                "skill_id": 5
            },
            {
                "role_id": 1,
                "skill_id": 7
            },
        ]
        response = requests.get(f'{self.base_url}/getByRole/{role_id}')
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.json()['data']['role_skills'], existing_data)
        print("Test Case - Get RoleSkills By Role ID - PASSED")

    def test_get_specific_role_skills(self):
        # Test Case 3: Get specific RoleSkills associations by role_ids
        data = {
            "role_ids": [1, 2]
        }
        existing_data = {
            "1" : [1, 2, 4, 5, 7],
            "2" : [3, 6]
        }
        response = requests.post(f'{self.base_url}/getMultiRole', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response.json()['data'], existing_data)
        print("Test Case - Get RoleSkills By Multiple Role ID - PASSED")

if __name__ == "__main__":
    unittest.main()
