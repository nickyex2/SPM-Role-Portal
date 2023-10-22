import unittest
import requests
import os
from dotenv import load_dotenv
from staff import *
from staffReportingOfficer import *
from staffRole import *
from staffSkills import *
from skills import *
from role import *
from roleApplication import *
from roleListing import *
from roleSkills import *

load_dotenv()
def main():
  # Create a test suite
  test_suite = unittest.TestSuite()

  # Add all test cases from all test classes
  test_suite.addTest(unittest.makeSuite(TestStaffAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffROAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffRoleAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffSkillsAPI))
  test_suite.addTest(unittest.makeSuite(TestSkillAPI))
  test_suite.addTest(unittest.makeSuite(TestRoleAPI))
  test_suite.addTest(unittest.makeSuite(TestRoleApplicationAPI))
  test_suite.addTest(unittest.makeSuite(TestRoleListingAPI))
  test_suite.addTest(unittest.makeSuite(TestRoleSkillsAPI))


  # Run the test suite
  runner = unittest.TextTestRunner()
  runner.run(test_suite)

if __name__ == '__main__':
  main()
