# Staff Role API Documentation

This documentation describes the API endpoints for managing staff roles using a Flask-based web application. The API allows you to retrieve staff roles in a database.

## 1. Staff Role Model

The `StaffRole` model represents a staff role with the following attributes:

- `staff_id` (Integer, Primary Key): Identifier for the staff member associated with the role.
- `staff_role` (Integer, Primary Key): Identifier for the role associated with the staff member.
- `role_type` (Enum): The type of the role, which can be one of the following:
  - "primary"
  - "secondary"
- `sr_status` (Enum): The status of the staff role, which can be one of the following:
  - "active"
  - "inactive"

## 2. Endpoints

### 2.1. Get All Staff Roles

- **Endpoint:** `GET /api/staff/staffRole/getAll`
- **Description:** Retrieve all staff roles from the database.
- **Response:**
  - `200 OK` - If there are staff roles in the database, it returns the list of staff roles.
  ```json
  {
      "code": 200,
      "data": {
          "staff_roles": [
              {
                  "staff_id": 123,
                  "staff_role": 456,
                  "role_type": "primary",
                  "sr_status": "active"
              },
              {
                  "staff_id": 789,
                  "staff_role": 101,
                  "role_type": "secondary",
                  "sr_status": "inactive"
              }
          ]
      }
  }
  ```

  - `404 Not Found` - If there are no staff roles in the database, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No staff roles in the database."
  }
  ```

### 2.2. Get a Specific Staff Role

- **Endpoint:** `GET /api/staff/staffRole/getOne/<int:staff_id>/<int:staff_role>`
- **Description:** Retrieve a specific staff role by providing `staff_id` and `staff_role`.
- **Response:**
  - `200 OK` - If the staff role is found, it returns the staff role data.
  ```json
  {
      "code": 200,
      "data": {
          "staff_id": 123,
          "staff_role": 456,
          "role_type": "primary",
          "sr_status": "active"
      }
  }
  ```

  - `404 Not Found` - If the staff role is not found, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "StaffRole with staff_id 123 and staff_role 456 not found."
  }
  ```

### 2.3 Get All Staff Roles of a Specific Staff Member

- **Endpoint:** `GET /api/staff/staffRole/<int:staff_id>`
- **Description:** Retrieve all staff roles associated with a specific staff member by providing their `staff_id`.
- **Response:**
  - `200 OK` - If there are staff roles associated with the provided staff member, it returns the list of staff roles.
  ```json
  {
      "code": 200,
      "data": {
          "staff_roles": [
              {
                  "staff_id": 123,
                  "staff_role": 456,
                  "role_type": "primary",
                  "sr_status": "active"
              },
              {
                  "staff_id": 123,
                  "staff_role": 789,
                  "role_type": "secondary",
                  "sr_status": "inactive"
              }
          ]
      }
  }
  ```

  - `404 Not Found` - If there are no staff roles associated with the provided staff member, it returns an error message.
  ```json
  {
      "code": 404,
      "message": "No staff roles found for staff with ID 123."
  }
  ```