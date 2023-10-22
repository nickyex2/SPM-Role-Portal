import unittest
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
class TestStaffSkillsAPI(unittest.TestCase):
  
  def setUp(self):
    self.base_url = os.environ.get("BASE_URL") + "/api/staff/staffSkills"

  def test_get_all_staff_skills(self):
    response = requests.get(f"{self.base_url}/getAll")
    data = response.json()
    self.assertEqual(response.status_code, 200)
    self.assertTrue("staff_skills" in data["data"])
    print("Test Case - Get All Staff Skills - PASSED")
  
  def test_get_staff_skills_by_staff_id(self):
    staff_id = 1
    existing_staff_skills = [
      {
        "staff_id": 1,
        "skill_id": 1,
        "ss_status": "active"
      },
      {
        "staff_id": 1,
        "skill_id": 2,
        "ss_status": "active"
      },
      {
        "staff_id": 1,
        "skill_id": 4,
        "ss_status": "active"
      },
      {
        "staff_id": 1,
        "skill_id": 6,
        "ss_status": "active"
      },
    ]
    response = requests.get(f"{self.base_url}/getByStaff/{staff_id}")
    self.assertEqual(response.status_code, 200)
    self.assertCountEqual(response.json()['data']['staff_skills'], existing_staff_skills)
    print("Test Case - Get Staff Skills by staff_id - PASSED")

  def test_get_staff_skills_by_staff_id_not_found(self):
    staff_id = 12345
    response = requests.get(f"{self.base_url}/getByStaff/{staff_id}")
    self.assertEqual(response.status_code, 404)
    print("Test Case - Get Staff Skills by staff_id when not found - PASSED")

  def test_get_staff_skills_by_skill_id(self):
    skill_id = 1
    existing_staff_skills = [
      {
        "staff_id": 1,
        "skill_id": 1,
        "ss_status": "active"
      },
      {
        "staff_id": 5,
        "skill_id": 1,
        "ss_status": "active"
      },
      {
        "staff_id": 6,
        "skill_id": 1,
        "ss_status": "active"
      },
    ]
    response = requests.get(f"{self.base_url}/getBySkill/{skill_id}")
    self.assertEqual(response.status_code, 200)
    self.assertCountEqual(response.json()['data']['staff_skills'], existing_staff_skills)
    print("Test Case - Get Staff Skills by skill_id - PASSED")
  
  def test_get_staff_skills_by_skill_id_not_found(self):
    skill_id = 12345
    response = requests.get(f"{self.base_url}/getBySkill/{skill_id}")
    self.assertEqual(response.status_code, 404)
    print("Test Case - Get Staff Skills by skill_id when not found - PASSED")

  def test_get_staff_skills_by_multiple_staff_id(self):
    staff_ids = [1, 2]
    existing_staff_skills = {
      "1": [1, 2, 4, 6],
      "2": [3, 5, 32]
    } 
    response = requests.post(f"{self.base_url}/getMulti", json={"staff_ids":staff_ids})
    self.assertEqual(response.status_code, 200)
    self.assertDictEqual(response.json()['data'], existing_staff_skills)
    print("Test Case - Get Staff Skills by multiple staff_ids - PASSED")
  
if __name__ == "__main__":
  unittest.main()