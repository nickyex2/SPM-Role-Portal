import unittest
import requests
import os
from dotenv import load_dotenv
from staff.staff_Int_test import *


load_dotenv()
def main():
  # Create a test suite
  test_suite = unittest.TestSuite()

  # Add all test cases from all test classes
  test_suite.addTest(unittest.makeSuite(TestStaffAPI))


  # Run the test suite
  runner = unittest.TextTestRunner()
  runner.run(test_suite)

if __name__ == '__main__':
  main()
