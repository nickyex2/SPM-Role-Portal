import unittest
import requests
import os
from dotenv import load_dotenv
from staff.staff_Int_test import *
from staffReportingOfficer.staffReportingOfficer_Int_test import *
from staffRole.staffRole_Int_test import *
from staffSkills.staffSkills_Int_test import *
from skills.skills_Int_test import *
from role.role_Int_test import *
from roleApplication.roleApplication_Int_test import *
from roleListing.roleListing_Int_test import *
from roleSkills.roleSkills_Int_test import *

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
