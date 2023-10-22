import unittest
import requests
import os
from dotenv import load_dotenv
from staff.staff_Int_test import *
from staffReportingOfficer.staffReportingOfficer_Int_test import *
from staffRole.staffRole_Int_test import *
from staffSkills.staffSkills_Int_test import *


load_dotenv()
def main():
  # Create a test suite
  test_suite = unittest.TestSuite()

  # Add all test cases from all test classes
  test_suite.addTest(unittest.makeSuite(TestStaffAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffROAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffRoleAPI))
  test_suite.addTest(unittest.makeSuite(TestStaffSkillsAPI))


  # Run the test suite
  runner = unittest.TextTestRunner()
  runner.run(test_suite)

if __name__ == '__main__':
  main()
