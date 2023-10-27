# Staff Skill API Documentation

This documentation describes the API endpoints for managing staff skills using a Flask-based web application. The API allows you to retrieve staff skills in a database.

## 1. Staff Skill Model

The `StaffSkill` model represents a staff skill with the following attributes:

- `staff_id` (Integer, Primary Key): Identifier for the staff member associated with the skill.
- `skill_id` (Integer, Primary Key): Identifier for the skill associated with the staff member.
- `ss_status` (Enum): The status of the staff skill, which can be one of the following:
  - "active"
  - "inactive"

## 2. Endpoints

### 2.1. Get All Staff Skills

- **Endpoint:** `GET /api/staff/staffSkills/getAll`
- **Description:** Retrieve all staff skills from the database.
- **Response:**
  - `200 OK` - If there are staff skills in the database, it returns a list of staff skills.
  ```json
  {
      "code": 200,
      "data": {
          "staff_skills": [
              {
                  "staff_id": 123,
                  "skill_id": 456,
                  "ss_status": "active"
              },
              {
                  "staff_id": 789,
                  "skill_id": 101,
                  "ss_status": "inactive"
              }
          ]
      }
  }
  ```

  - `404 Not Found` - If there are no staff skills in the database, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No staff skills in the database."
  }
  ```

### 2.2. Get Staff Skills for a Specific Staff Member

- **Endpoint:** `GET /api/staff/staffSkills/getByStaff/<int:staff_id>`
- **Description:** Retrieve all staff skills for a specific staff member by providing their `staff_id`.
- **Response:**
  - `200 OK` - If there are staff skills associated with the provided staff member, it returns the list of staff skills.
  ```json
  {
      "code": 200,
      "data": {
          "staff_skills": [
              {
                  "staff_id": 123,
                  "skill_id": 456,
                  "ss_status": "active"
              },
              {
                  "staff_id": 123,
                  "skill_id": 789,
                  "ss_status": "inactive"
              }
          ]
      }
  }
  ```

  - `404 Not Found` - If there are no staff skills associated with the provided staff member, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No staff skills found for staff_id 123."
  }
  ```

### 2.3. Get Staff Skills by Skill ID

- **Endpoint:** `GET /api/staff/staffSkills/getBySkill/<int:skill_id>`
- **Description:** Retrieve all staff associated with a specific skill by providing the `skill_id`.
- **Response:**
  - `200 OK` - If there are staff skills associated with the provided skill, it returns the list of staff skills.
  ```json
  {
      "code": 200,
      "data": {
          "staff_skills": [
              {
                  "staff_id": 123,
                  "skill_id": 456,
                  "ss_status": "active"
              },
              {
                  "staff_id": 789,
                  "skill_id": 456,
                  "ss_status": "inactive"
              }
          ]
      }
  }
  ```

  - `404 Not Found` - If there are no staff skills associated with the provided skill, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No staff skills found for skill_id 456."
  }
  ```

### 2.4. Get Multiple Staff Skills by `staff_ids`

- **Endpoint:** `POST /api/staff/staffSkills/getMulti`
- **Description:** Retrieve multiple staff skills by providing a list of `staff_ids` in the request body.
- **Request Body:**
  ```json
  {
      "staff_ids": [123, 456, 789]
  }
  ```
- **Response:**
  - `200 OK` - If there are staff skills associated with the provided staff members, it returns the list of staff skills.
  ```json
  {
      "code": 200,
      "data": {
        ["staff_id"] : [1,2,3,4...]
      }
  }
  ```
  - `404 Not Found` - If there are no staff skills associated with the provided staff members, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No StaffSkills association found with staff_ids"
  }
  ```