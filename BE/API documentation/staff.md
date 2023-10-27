# Staff API Documentation

This documentation describes the API endpoints for managing staff profiles using a Flask-based web application. The API allows you to retrieve staff profiles in a database.

## 1. Staff Model

The `Staff` model represents a staff profile with the following attributes:

- `staff_id` (Integer, Primary Key): Unique identifier for the staff profile.
- `fname` (String, 50 characters): First name of the staff member.
- `lname` (String, 50 characters): Last name of the staff member.
- `dept` (String, 50 characters): Department of the staff member.
- `phone` (String, 20 characters): Phone number of the staff member.
- `email` (String, 50 characters): Email address of the staff member.
- `biz_address` (String, 255 characters): Business address of the staff member.
- `sys_role` (Enum): The system role of the staff member, which can be one of the following:
  - "staff"
  - "hr"
  - "manager"
  - "inactive"

## 2. Endpoints

### 2.1. Get All Staff Profiles

- **Endpoint:** `GET /api/staff/getAll`
- **Description:** Retrieve a list of all staff profiles from the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "staffs": [
                {
                    "staff_id": 1,
                    "fname": "John",
                    "lname": "Doe",
                    "dept": "IT",
                    "phone": "123-456-7890",
                    "email": "john.doe@example.com",
                    "biz_address": "123 Main St",
                    "sys_role": "staff"
                },
                ...
            ]
        }
    }
    ```

  - No staff profiles found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Oops. No staff in the staff database."
    }
    ```

### 2. Get Staff Profile by Staff ID

- **Endpoint:** `GET /api/staff/getOne/<string:staff_id>`
- **Description:** Retrieve a staff profile by its unique `staff_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "staff_id": 1,
            "fname": "John",
            "lname": "Doe",
            "dept": "IT",
            "phone": "123-456-7890",
            "email": "john.doe@example.com",
            "biz_address": "123 Main St",
            "sys_role": "staff"
        }
    }
    ```

  - Staff not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Staff not found."
    }
    ```

### 3. Get Multiple Staff Profiles by `staff_ids`

- **Endpoint:** `POST /api/staff/getMulti`
- **Description:** Retrieve multiple staff profiles by providing a list of `staff_ids` in the request body.
- **Request Body**
  - `staff_ids` (List of Strings): List of staff IDs to retrieve.
    ```json
    {
        "staff_ids": ["1","2",...]
    }
    ```
- **Response:**
  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "staffs": [
                {
                    "staff_id": 1,
                    "fname": "John",
                    "lname": "Doe",
                    "dept": "IT",
                    "phone": "123-456-7890",
                    "email": "john_doe@all-in-one.com",
                    "biz_address": "123 Main St",
                    "sys_role": "staff"
                },...
            ]
        }
    }
    ```
  - Staff not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Staffs not found."
    }
    ```
