# Skill API Documentation

This documentation describes the API endpoints for managing skills using a Flask-based web application. The API allows you to retrieve skill information in a database.

## 1. Skill Model

The `Skill` model represents a skill with the following attributes:

- `skill_id` (Integer, Primary Key): Unique identifier for the skill.
- `skill_name` (String, 300 characters): Name of the skill.
- `skill_status` (Enum): The status of the skill, which can be one of the following:
  - "active"
  - "inactive"

## 2. Endpoints

### 2.1. Get All Skills

- **Endpoint:** `GET /api/skills/getAll`
- **Description:** Retrieve a list of all skills in the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "skills": [
                {
                    "skill_id": 1,
                    "skill_name": "Python Programming",
                    "skill_status": "active"
                },
                ...
            ]
        }
    }
    ```

  - No skills found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Oops. No skills in the SKILL_DETAILS database."
    }
    ```

### 2.2. Get Skill by ID

- **Endpoint:** `GET /api/skills/getOne/<int:skill_id>`
- **Description:** Retrieve a skill by its unique `skill_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "skill_id": 1,
            "skill_name": "Python Programming",
            "skill_status": "active"
        }
    }
    ```

  - Skill not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Skill not found."
    }
    ```

### 2.3. Get Skills by Skill IDs

- **Endpoint:** `POST /api/skills/getMulti`
- **Description:** Retrieve multiple skills by providing a list of `skill_ids` in the request body.
- **Request Body:**
  ```json
  {
      "skill_ids": [1, 2, 3]
  }
  ```
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": [
            {
                "skill_id": 1,
                "skill_name": "Python Programming",
                "skill_status": "active"
            },
            ...
        ]
    }
    ```

  - Skills not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "Skills not found."
    }
    ```