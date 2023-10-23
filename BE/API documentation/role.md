# Role API Documentation

This documentation describes the API endpoints for managing roles using a Flask-based web application. The API allows you to retrieve role information in a database.

## 1. Role Model

The `Role` model represents a role with the following attributes:

- `role_id` (Integer, Primary Key): Unique identifier for the role.
- `role_name` (String, 50 characters): Name of the role.
- `role_description` (String, 10,000 characters): Description of the role.
- `role_status` (Enum): The status of the role, which can be one of the following:
  - "active"
  - "inactive"

## 2. Endpoints

### 2.1. Get All Roles

- **Endpoint:** `GET /api/role/getAll`
- **Description:** Retrieve a list of all roles in the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "roles": [
                {
                    "role_id": 1,
                    "role_name": "Example Role",
                    "role_description": "This is an example role.",
                    "role_status": "active"
                },
                ...
            ]
        }
    }
    ```

  - No roles found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No roles in the database."
    }
    ```

### 2.2. Get a Specific Role by `role_id`

- **Endpoint:** `GET /api/role/getOne/<int:role_id>`
- **Description:** Retrieve information about a specific role by providing its unique `role_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_id": 1,
            "role_name": "Example Role",
            "role_description": "This is an example role.",
            "role_status": "active"
        }
    }
    ```

  - Role not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Role with ID {role_id} not found."
    }
    ```

### 2.3. Get Roles by `role_ids`

- **Endpoint:** `POST /api/role/getMulti`
- **Description:** Retrieve information about roles by providing a list of `role_ids` in the request body.
- **Request Body:**
  ```json
  {
      "role_ids": [1, 2, 3]
  }
  ```
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": [
            {
                "role_id": 1,
                "role_name": "Example Role 1",
                "role_description": "This is an example role 1.",
                "role_status": "active"
            },
            {
                "role_id": 2,
                "role_name": "Example Role 2",
                "role_description": "This is an example role 2.",
                "role_status": "inactive"
            },
            ...
        ]
    }
    ```

  - Roles not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Roles with IDs [1, 2, 3] not found."
    }
    ```
