## Role Skills API Documentation

This documentation describes the API endpoints for managing role skills associations using a Flask-based web application. The API allows you to create, retrieve, and delete role skills associations in a database.

### 1. Create a New Role Skills Association

- **Endpoint:** `POST /createRoleSkills`
- **Description:** Create a new role skills association by providing the `role_id` and `skill_id` in the request body.
- **Request Body:**
  ```json
  {
      "role_id": 1,
      "skill_id": 2
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
        "message": "RoleSkills association created successfully.",
        "data": {
            "role_id": 1,
            "skill_id": 2
        }
    }
    ```

  - Creation failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to create RoleSkills association. Error: {error_message}"
    }
    ```

### 2. Get All Role Skills Associations

- **Endpoint:** `GET /getAllRoleSkills`
- **Description:** Retrieve a list of all role skills associations in the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_skills": [
                {
                    "role_id": 1,
                    "skill_id": 2
                },
                ...
            ]
        }
    }
    ```

  - No role skills associations found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No RoleSkills associations in the database."
    }
    ```

### 3. Get Role Skills Associations for a Specific Role ID

- **Endpoint:** `GET /getRoleSkills/<int:role_id>`
- **Description:** Retrieve role skills associations for a specific `role_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_skills": [
                {
                    "role_id": 1,
                    "skill_id": 2
                },
                ...
            ]
        }
    }
    ```

  - No role skills associations found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No RoleSkills associations found for role_id {role_id}."
    }
    ```

### 4. Delete a Role Skills Association

- **Endpoint:** `DELETE /deleteRoleSkills/<int:role_id>/<int:skill_id>`
- **Description:** Delete a role skills association by providing the `role_id` and `skill_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "message": "RoleSkills association with role_id {role_id} and skill_id {skill_id} deleted successfully."
    }
    ```

  - Role skills association not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No RoleSkills association found with role_id {role_id} and skill_id {skill_id}. Nothing deleted."
    }
    ```

  - Deletion failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to delete RoleSkills association with role_id {role_id} and skill_id {skill_id}. Error: {error_message}"
    }
    ```