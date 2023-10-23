# Role Skills API Documentation

This documentation describes the API endpoints for managing role skills associations using a Flask-based web application. The API allows you to retrieve role skills associations in a database.

## 1. Role Skills Association Model

The `RoleSkills` model represents a role skills association with the following attributes:

- `role_id` (Integer, Primary Key): Identifier for the role associated with the skill.
- `skill_id` (Integer, Primary Key): Identifier for the skill associated with the role.

## 2. Endpoints

### 2.1. Get All Role Skills Associations

- **Endpoint:** `GET /api/role/roleSkills/getAll`
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

### 2.2. Get Role Skills Associations for a Specific Role ID

- **Endpoint:** `GET /api/role/roleSkills/getByRole/<int:role_id>`
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

### 2.3. Get Multiple Role Skills Associations by `role_ids`

- **Endpoint:** `POST /api/role/roleSkills/getMultiRole`
- **Description:** Retrieve multiple role skills associations by providing a list of `role_ids`.
- **Request Body**
  - `role_ids` (List of Integers): List of role IDs to retrieve role skills associations for.
    ```json
    {
        "role_ids": [1,2,3,4...]
    }
    ```
- **Response:**
  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            ["role_id"]: [1,2,3,4...]
        }
    }
    ```
  - No role skills associations found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No RoleSkills association found for role_ids."
    }
    ```