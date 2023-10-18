## Staff API Documentation

This documentation describes the API endpoints for managing staff profiles using a Flask-based web application. The API allows you to create, retrieve, and update staff profiles in a database.

### 1. Get All Staff Profiles

- **Endpoint:** `GET /getAllStaff`
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

- **Endpoint:** `GET /getStaff/<string:staff_id>`
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

### 3. Create a New Staff Profile

- **Endpoint:** `POST /createStaff/<string:staff_id>`
- **Description:** Create a new staff profile by providing a unique `staff_id` and the staff profile details in the request body. If a staff profile with the provided `staff_id` already exists, it will return an error.
- **Request Body:**
  ```json
  {
      "fname": "John",
      "lname": "Doe",
      "dept": "IT",
      "phone": "123-456-7890",
      "email": "john.doe@example.com",
      "biz_address": "123 Main St",
      "sys_role": "staff"
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
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

  - Staff profile already exists (Status Code: 410 Gone)
    ```json
    {
        "code": 410,
        "data": {
            "staff_id": 1
        },
        "message": "Staff already exists."
    }
    ```

  - Creation failed (Status Code: 501 Not Implemented)
    ```json
    {
        "code": 501,
        "data": {
            "staff_id": 1
        },
        "message": "An error occurred creating the staff."
    }
    ```