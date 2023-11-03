# Integration Test Script Documentation

This document provides documentation for all the integration tests.

# Role API Integration Test

This document provides an overview of integration tests for the Role API.

## Test Overview

The integration test script includes the following test cases:
1. **Get All Roles**
   - Test the endpoint to retrieve all roles.
2. **Get Role by ID**
   - Test the endpoint to retrieve a role by its ID.
3. **Get Non-existent Role by ID**
   - Test the endpoint to retrieve a role by a non-existent ID.
4. **Get Roles by IDs**
   - Test the endpoint to retrieve multiple roles by a list of role IDs.

## Test Cases

### Get All Roles

- **Test Case**: Get all roles from the API.
- **Endpoint**: `GET /api/role/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of roles.

### Get Role by ID

- **Test Case**: Get a specific role by its ID.
- **Endpoint**: `GET /api/role/getOne/{role_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain the role with the specified ID.

### Get Non-existent Role by ID

- **Test Case**: Attempt to get a role with a non-existent ID.
- **Endpoint**: `GET /api/role/getRole/{role_id}`
- **Expected Result**: The response status code should be 404 (Not Found), indicating that the role with the specified ID does not exist.

### Get Roles by IDs

- **Test Case**: Get multiple roles by a list of role IDs.
- **Endpoint**: `POST /api/role/getMulti`
- **Request**:
  ```json
  {
    "role_ids": [1, 2]
  }

# Role Application API Integration Test

This document provides an overview of integration tests for the Role Application API.


## Test Overview

The integration test script includes the following test cases:
1. **Create Role Application**
   - Test creating a new role application.
2. **Get All Role Applications**
   - Test retrieving all role applications.
3. **Get Role Applications by Role Listing ID**
   - Test retrieving role applications by role listing ID.
4. **Get Role Applications by Staff ID**
   - Test retrieving role applications by staff ID.
5. **Get Role Application by Role Listing and Staff ID**
   - Test retrieving a role application by both role listing and staff ID.
6. **Update Role Application**
   - Test updating an existing role application.


## Test Cases

### Create Role Application

- **Description**: Test creating a new role application.
- **Endpoint**: `POST /api/role/roleapp/create`
- **Expected Result**: The response status code should be 201 (Created), indicating that the role application was successfully created.

### Get All Role Applications

- **Description**: Test retrieving all role applications.
- **Endpoint**: `GET /api/role/roleapp/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of role applications.

### Get Role Applications by Role Listing ID

- **Description**: Test retrieving role applications by role listing ID.
- **Endpoint**: `GET /api/role/roleapp/getOne/{role_listing_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain role applications associated with the specified role listing ID.

### Get Role Applications by Staff ID

- **Description**: Test retrieving role applications by staff ID.
- **Endpoint**: `GET /api/role/roleapp/getByStaff/{staff_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain role applications associated with the specified staff ID.

### Get Role Application by Role Listing and Staff ID

- **Description**: Test getting a role application by both role listing and staff ID.
- **Endpoint**: `GET /api/role/roleapp/getByRoleLStaff/{role_listing_id}/{staff_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a role application associated with the specified role listing and staff ID.

### Update Role Application

- **Description**: Test updating an existing role application.
- **Endpoint**: `PUT /api/role/roleapp/update/{role_app_id}`
- **Request**:
  ```json
  {
    "role_app_status": "withdrawn",
    "hr_checked": "supported"
  }

# Role Listing API Integration Test

This document provides an overview of integration tests for the Role Listing API.

## Test Cases

### Create Role Listing

- **Description**: Test creating a new role listing.
- **Endpoint**: `POST /api/role/rolelisting/create`
- **Expected Result**: The response status code should be 201 (Created), indicating that the role listing was successfully created.

### Get All Role Listings

- **Description**: Test retrieving all role listings.
- **Endpoint**: `GET /api/role/rolelisting/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of role listings.

### Get Role Listing by ID

- **Description**: Test retrieving a role listing by its ID.
- **Endpoint**: `GET /api/role/rolelisting/getOne/{role_listing_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain the role listing with the specified ID.

### Get Non-existent Role Listing by ID

- **Description**: Test attempting to retrieve a role listing with a non-existent ID.
- **Endpoint**: `GET /api/role/rolelisting/getOne/{non_existent_id}`
- **Expected Result**: The response status code should be 404 (Not Found), indicating that the role listing with the specified ID does not exist.

### Get Role Listings by IDs

- **Description**: Test retrieving multiple role listings by their IDs.
- **Endpoint**: `POST /api/role/rolelisting/getMulti`
- **Request**:
  ```json
  {
    "role_listing_ids": [1, 2]
  }
# Role Application API Integration Test

This document provides an overview of integration tests for the Role Application API.

## Test Overview

The integration test script includes the following test cases:

1. **Create Role Application**
   - Test creating a new role application.
2. **Get All Role Applications**
   - Test retrieving all role applications.
3. **Get Role Applications by Role Listing ID**
   - Test retrieving role applications by role listing ID.
4. **Get Role Applications by Staff ID**
   - Test retrieving role applications by staff ID.
5. **Get Role Application by Role Listing and Staff ID**
   - Test retrieving a role application by both role listing and staff ID.
6. **Update Role Application**
   - Test updating an existing role application.

## Test Cases

### Create Role Application

- **Description**: Test creating a new role application.
- **Endpoint**: `POST /api/role/roleapp/create`
- **Expected Result**: The response status code should be 201 (Created), indicating that the role application was successfully created.

### Get All Role Applications

- **Description**: Test retrieving all role applications.
- **Endpoint**: `GET /api/role/roleapp/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of role applications.

### Get Role Applications by Role Listing ID

- **Description**: Test retrieving role applications by role listing ID.
- **Endpoint**: `GET /api/role/roleapp/getOne/{role_listing_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain role applications associated with the specified role listing ID.

### Get Role Applications by Staff ID

- **Description**: Test retrieving role applications by staff ID.
- **Endpoint**: `GET /api/role/roleapp/getByStaff/{staff_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain role applications associated with the specified staff ID.

### Get Role Application by Role Listing and Staff ID

- **Description**: Test getting a role application by both role listing and staff ID.
- **Endpoint**: `GET /api/role/roleapp/getByRoleLStaff/{role_listing_id}/{staff_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a role application associated with the specified role listing and staff ID.

### Update Role Application

- **Description**: Test updating an existing role application.
- **Endpoint**: `PUT /api/role/roleapp/update/{role_app_id}`
- **Request**:
  ```json
  {
    "role_app_status": "withdrawn",
    "hr_checked": "supported"
  }
# RoleSkills API Integration Test

This document provides an overview of integration tests for the RoleSkills API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All RoleSkills**
   - Test retrieving all RoleSkills associations.
2. **Get RoleSkills by Role ID**
   - Test retrieving RoleSkills associations by role ID.
3. **Get Specific RoleSkills**
   - Test retrieving specific RoleSkills associations by role IDs.

## Test Cases

### Get All RoleSkills

- **Description**: Test retrieving all RoleSkills associations.
- **Endpoint**: `GET /api/role/roleSkills/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of RoleSkills associations.

### Get RoleSkills by Role ID

- **Description**: Test retrieving RoleSkills associations by role ID.
- **Endpoint**: `GET /api/role/roleSkills/getByRole/{role_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain RoleSkills associations associated with the specified role ID.

### Get Specific RoleSkills

- **Description**: Test retrieving specific RoleSkills associations by role IDs.
- **Endpoint**: `POST /api/role/roleSkills/getMultiRole`
- **Request**:
  ```json
  {
    "role_ids": [1, 2]
  }
# Skill API Integration Test

This document provides an overview of integration tests for the Skill API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All Skills**
   - Test retrieving all skills.
2. **Get Skill by ID**
   - Test retrieving a skill by skill ID.
3. **Get Skills by IDs**
   - Test retrieving skills by multiple skill IDs.

## Test Cases

### Get All Skills

- **Description**: Test retrieving all skills.
- **Endpoint**: `GET /api/skills/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of skills.

### Get Skill by ID

- **Description**: Test retrieving a skill by skill ID.
- **Endpoint**: `GET /api/skills/getOne/{skill_id}`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain the skill details associated with the specified skill ID.

### Get Skills by IDs

- **Description**: Test retrieving skills by multiple skill IDs.
- **Endpoint**: `POST /api/skills/getMulti`
- **Request**:
  ```json
  {
    "skill_ids": [1, 2]
  }
# Staff API Integration Test

This document provides an overview of integration tests for the Staff API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All Staff**
   - Test retrieving all staff members.
2. **Get Staff by ID**
   - Test retrieving a staff member by staff ID.
3. **Get Multiple Staff Data**
   - Test retrieving multiple staff members by staff IDs.
4. **Get Nonexistent Staff by ID**
   - Test attempting to retrieve a staff member with a nonexistent staff ID.

## Test Cases

### Get All Staff

- **Description**: Test retrieving all staff members.
- **Endpoint**: `GET /api/staff/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff members.

### Get Staff by ID

- **Description**: Test retrieving a staff member by staff ID.
- **Endpoint**: `GET /api/staff/getOne/{staff_id}`
- **Request**: Replace `{staff_id}` with the staff ID you want to use for testing.
- **Expected Result**: If the staff with the specified ID exists, the response status code should be 200 (OK), and the response should contain the staff member's details. If the staff does not exist, the response status code should be 404 (Not Found).

### Get Multiple Staff Data

- **Description**: Test retrieving multiple staff members by staff IDs.
- **Endpoint**: `POST /api/staff/getMulti`
- **Request**:
  ```json
  {
    "staff_ids": [1, 6]
  }
# Staff Reporting Officers API Integration Test

This document provides an overview of integration tests for the Staff Reporting Officers API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All Staff Reporting Officers**
   - Test retrieving all staff reporting officers.
2. **Get Staff Reporting Officer by Staff ID**
   - Test retrieving a staff reporting officer by staff ID.
3. **Get Staff Reporting Officers by Staff ID (Not Found)**
   - Test attempting to retrieve a staff reporting officer by a staff ID that does not exist.

## Test Cases

### Get All Staff Reporting Officers

- **Description**: Test retrieving all staff reporting officers.
- **Endpoint**: `GET /api/staff/staffRO/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff reporting officers.

### Get Staff Reporting Officer by Staff ID

- **Description**: Test retrieving a staff reporting officer by staff ID.
- **Endpoint**: `GET /api/staff/staffRO/getOne/{staff_id}`
- **Request**: Replace `{staff_id}` with the staff ID you want to use for testing.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain the details of the staff reporting officer with the specified staff ID.

### Get Staff Reporting Officers by Staff ID (Not Found)

- **Description**: Test attempting to retrieve a staff reporting officer by a staff ID that does not exist.
- **Endpoint**: `GET /api/staff/staffRO/getOne/12345` (Nonexistent staff ID)
- **Expected Result**: The response status code should be 404 (Not Found), indicating that the staff reporting officer with the specified ID does not exist.

# Staff Role API Integration Test

This document provides an overview of integration tests for the Staff Role API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All Staff Roles**
   - Test retrieving all staff roles.
2. **Get Staff Role by Staff ID and Staff Role**
   - Test retrieving a specific staff role by staff ID and staff role ID.
3. **Get Staff Roles by Staff ID**
   - Test retrieving all staff roles associated with a specific staff member by staff ID.

## Test Cases

### Get All Staff Roles

- **Description**: Test retrieving all staff roles.
- **Endpoint**: `GET /api/staff/staffRole/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff roles.

### Get Staff Role by Staff ID and Staff Role

- **Description**: Test retrieving a specific staff role by staff ID and staff role ID.
- **Endpoint**: `GET /api/staff/staffRole/getOne/{staff_id}/{staff_role}`
- **Request**: Replace `{staff_id}` and `{staff_role}` with the staff ID and staff role ID you want to use for testing.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain the details of the staff role with the specified staff ID and staff role ID.

### Get Staff Roles by Staff ID

- **Description**: Test retrieving all staff roles associated with a specific staff member by staff ID.
- **Endpoint**: `GET /api/staff/staffRole/getByStaff/{staff_id}`
- **Request**: Replace `{staff_id}` with the staff ID you want to use for testing.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff roles associated with the specified staff ID.

# Staff Skills API Integration Test

This document provides an overview of integration tests for the Staff Skills API.

## Test Overview

The integration test script includes the following test cases:

1. **Get All Staff Skills**
   - Test retrieving all staff skills.
2. **Get Staff Skills by Staff ID**
   - Test retrieving staff skills associated with a specific staff member by staff ID.
3. **Get Staff Skills by Staff ID (Not Found)**
   - Test retrieving staff skills by staff ID when not found.
4. **Get Staff Skills by Skill ID**
   - Test retrieving staff skills associated with a specific skill by skill ID.
5. **Get Staff Skills by Skill ID (Not Found)**
   - Test retrieving staff skills by skill ID when not found.
6. **Get Staff Skills by Multiple Staff IDs**
   - Test retrieving staff skills for multiple staff members by staff IDs.

## Test Cases

### Get All Staff Skills

- **Description**: Test retrieving all staff skills.
- **Endpoint**: `GET /api/staff/staffSkills/getAll`
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff skills.

### Get Staff Skills by Staff ID

- **Description**: Test retrieving staff skills associated with a specific staff member by staff ID.
- **Endpoint**: `GET /api/staff/staffSkills/getByStaff/{staff_id}`
- **Request**: Replace `{staff_id}` with the staff ID you want to use for testing.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff skills associated with the specified staff ID.

### Get Staff Skills by Staff ID (Not Found)

- **Description**: Test retrieving staff skills by staff ID when not found.
- **Endpoint**: `GET /api/staff/staffSkills/getByStaff/{staff_id}`
- **Request**: Use a `{staff_id}` that does not exist.
- **Expected Result**: The response status code should be 404 (Not Found), indicating that no staff skills were found for the specified staff ID.

### Get Staff Skills by Skill ID

- **Description**: Test retrieving staff skills associated with a specific skill by skill ID.
- **Endpoint**: `GET /api/staff/staffSkills/getBySkill/{skill_id}`
- **Request**: Replace `{skill_id}` with the skill ID you want to use for testing.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a list of staff skills associated with the specified skill ID.

### Get Staff Skills by Skill ID (Not Found)

- **Description**: Test retrieving staff skills by skill ID when not found.
- **Endpoint**: `GET /api/staff/staffSkills/getBySkill/{skill_id}`
- **Request**: Use a `{skill_id}` that does not exist.
- **Expected Result**: The response status code should be 404 (Not Found), indicating that no staff skills were found for the specified skill ID.

### Get Staff Skills by Multiple Staff IDs

- **Description**: Test retrieving staff skills for multiple staff members by staff IDs.
- **Endpoint**: `POST /api/staff/staffSkills/getMulti`
- **Request**: Include a list of `{staff_ids}` for which you want to retrieve staff skills.
- **Expected Result**: The response status code should be 200 (OK), and the response should contain a dictionary where each staff ID is associated with a list of staff skills.

