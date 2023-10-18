## Skill API Documentation

This documentation describes the API endpoints for managing skills using a Flask-based web application. The API allows you to create, retrieve, and update skill information in a database.

### 1. Create a New Skill

- **Endpoint:** `POST /addSkill/<int:skill_id>`
- **Description:** Create a new skill by providing a unique `skill_id` and the skill details in the request body. If a skill with the provided `skill_id` already exists, it will return an error.
- **Request Body:**
  ```json
  {
      "skill_name": "Python Programming",
      "skill_status": "active"
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
        "data": {
            "skill_id": 1,
            "skill_name": "Python Programming",
            "skill_status": "active"
        }
    }
    ```

  - Skill already exists (Status Code: 410 Gone)
    ```json
    {
        "code": 410,
        "data": {
            "skill_id": 1
        },
        "message": "Skill already exists."
    }
    ```

  - Creation failed (Status Code: 501 Not Implemented)
    ```json
    {
        "code": 501,
        "data": {
            "skill_id": 1
        },
        "message": "An error occurred creating the skill."
    }
    ```

### 2. Get All Skills

- **Endpoint:** `GET /getAllSkills`
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

### 3. Get Skill by ID

- **Endpoint:** `GET /getSkill/<int:skill_id>`
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

### 4. Get Skills by Skill IDs

- **Endpoint:** `POST /getSkills`
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

### 5. Update Skill Status by Skill ID

- **Endpoint:** `PUT /updateSkill/<int:skill_id>`
- **Description:** Update the status of a skill by providing the `skill_id` and the new `skill_status` in the request body.
- **Request Body:**
  ```json
  {
      "skill_status": "inactive"
  }
  ```
- **Response:**

  - Success (Status Code: 202 Accepted)
    ```json
    {
        "code": 202,
        "data": {
            "skill_id": 1,
            "skill_name": "Python Programming",
            "skill_status": "inactive"
        }
    }
    ```

  - Update failed (Status Code: 502 Bad Gateway)
    ```json
    {
        "code": 502,
        "data": {
            "skill_id": 1
        },
        "message": "An error occurred updating the skill."
    }
    ```