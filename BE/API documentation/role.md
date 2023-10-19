# Role API Documentation

This documentation describes the API endpoints for managing roles using a Flask-based web application. The API allows you to create, retrieve, update, and delete role information in a database.

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

- **Endpoint:** `GET /getAllRoles`
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

- **Endpoint:** `GET /getRole/<int:role_id>`
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

- **Endpoint:** `POST /getRoles`
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

### 2.4. Update a Specific Role by `role_id`

- **Endpoint:** `PUT /updateRole/<int:role_id>`
- **Description:** Update information for a specific role by providing its unique `role_id` and the fields to be updated in the request body.
- **Request Body:**
  ```json
  {
      "role_name": "Updated Role Name",
      "role_description": "Updated role description",
      "role_status": "inactive"
  }
  ```
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "message": "Role with ID {role_id} updated successfully.",
        "data": {
            "role_id": 1,
            "role_name": "Updated Role Name",
            "role_description": "Updated role description",
            "role_status": "inactive"
        }
    }
    ```

  - Role not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Role with ID {role_id} not found. Nothing updated."
    }
    ```

  - Update failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to update Role with ID {role_id}. Error: {error_message}"
    }
    ```

### 2.5. Create a New Role

- **Endpoint:** `POST /createRole`
- **Description:** Create a new role by providing role information in the request body.
- **Request Body:**
  ```json
  {
      "role_name": "New Role",
      "role_description": "Description of the new role",
      "role_status": "active"
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
        "message": "Role created successfully.",
        "data": {
            "role_id": 4,
            "role_name": "New Role",
            "role_description": "Description of the new role",
            "role_status": "active"
        }
    }
    ```

  - Create failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to create Role. Error: {error_message}"
    }
    ```
