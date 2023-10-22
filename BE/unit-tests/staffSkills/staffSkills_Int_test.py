import unittest
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
class TestStaffSkillsAPI(unittest.TestCase):
  
  def setUp(self):
    self.base_url = os.environ.get("BASE_URL")