import unittest
import requests

# Define the base URL of the Skill microservice.
BASE_URL = 'http://localhost:5000'

class SkillIntegrationTests(unittest.TestCase):

    def test_create_skill(self):
        # Test Case 1: Create a new skill
        data = {
            "skill_id": 1,
            "skill_name": "Python Programming",
            "skill_status": "active"
        }

        response = requests.post(f'{BASE_URL}/addSkill/1', json=data)
        self.assertEqual(response.status_code, 201)
        print("Test Case 1 (Create Skill) - Passed")

    def test_get_all_skills(self):
        # Test Case 2: Get all skills
        response = requests.get(f'{BASE_URL}/getAllSkills')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']['skills']) > 0)
        print("Test Case 2 (Get All Skills) - Passed")

    def test_get_skill_by_id(self):
        # Test Case 3: Get a skill by skill_id
        skill_id = 1
        response = requests.get(f'{BASE_URL}/getSkill/{skill_id}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['data']['skill_id'], skill_id)
        print("Test Case 3 (Get Skill by ID) - Passed")

    def test_get_skills_by_ids(self):
        # Test Case 4: Get skills by skill_ids
        data = {
            "skill_ids": [1]
        }

        response = requests.post(f'{BASE_URL}/getSkills', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()['data']) > 0)
        print("Test Case 4 (Get Skills by IDs) - Passed")

    def test_update_skill(self):
        # Test Case 5: Update the skill status by skill_id
        skill_id = 1
        data = {
            "skill_status": "inactive"
        }

        response = requests.put(f'{BASE_URL}/updateSkill/{skill_id}', json=data)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.json()['data']['skill_id'], skill_id)
        self.assertEqual(response.json()['data']['skill_status'], "inactive")
        print("Test Case 5 (Update Skill) - Passed")

if __name__ == "__main__":
    unittest.main()
