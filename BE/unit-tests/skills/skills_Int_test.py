import unittest
import requests
import os
from dotenv import load_dotenv

# Create Skills Read-Only API Unit Tests
load_dotenv()

class TestSkillAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = os.environ.get("BASE_URL") + "/api/skills"

    def test_get_all_skills(self):
        # Test Case 2: Get all skills
        response = requests.get(f'{self.base_url}/getAll')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['skills']) > 0)
        print("Test Case - Get All Skills - PASSED")

    def test_get_skill_by_id(self):
        # Test Case 3: Get a skill by skill_id
        skill_id = 1
        response = requests.get(f'{self.base_url}/getOne/{skill_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['skill_id'], skill_id)
        print("Test Case - Get Skill by ID - PASSED")

    def test_get_skills_by_ids(self):
        # Test Case 4: Get skills by skill_ids
        data = {
            "skill_ids": [1, 2]
        }
        existing_data = [
            {
                "skill_id": 1,
                "skill_name": "Python Programming",
                "skill_status": "active"
            },
            {
                "skill_id": 2,
                "skill_name": "Java Programming",
                "skill_status": "active"
            }
        ]

        response = requests.post(f'{self.base_url}/getMulti', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(response.json()['data'], existing_data)
        print("Test Case - Get Skills by Multiple IDs - PASSED")

if __name__ == "__main__":
    unittest.main()
