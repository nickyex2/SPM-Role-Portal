## Staff Skill API Documentation

**1. Create a New Staff Skill**

- **Endpoint:** `POST /createStaffSkill`
- **Description:** Create a new staff skill.

**Request:**
```http
POST /createStaffSkill
Content-Type: application/json

{
    "staff_id": 123,
    "skill_id": 456,
    "ss_status": "active"
}
```

**Response:**
- `201 Created` - If the staff skill is created successfully, it returns the created staff skill.
```json
{
    "code": 201,
    "message": "StaffSkill created successfully.",
    "data": {
        "staff_id": 123,
        "skill_id": 456,
        "ss_status": "active"
    }
}
```

- `400 Bad Request` - If there is an error during the creation process, it returns an error message.
```json
{
    "code": 400,
    "message": "Failed to create StaffSkill. Error: <error_message>"
}
```

**2. Get All Staff Skills**

- **Endpoint:** `GET /getAllStaffSkills`
- **Description:** Retrieve all staff skills from the database.

**Request:**
```http
GET /getAllStaffSkills
```

**Response:**
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

**3. Get Staff Skills for a Specific Staff Member**

- **Endpoint:** `GET /getStaffSkills/<int:staff_id>`
- **Description:** Retrieve all staff skills for a specific staff member by providing their `staff_id`.

**Request:**
```http
GET /getStaffSkills/123
```

**Response:**
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

**4. Update a Specific Staff Skill**

- **Endpoint:** `PUT /updateStaffSkill/<int:staff_id>/<int:skill_id>`
- **Description:** Update a specific staff skill by providing `staff_id` and `skill_id`.

**Request:**
```http
PUT /updateStaffSkill/123/456
Content-Type: application/json

{
    "ss_status": "inactive"
}
```

**Response:**
- `200 OK` - If the staff skill is found and updated successfully, it returns the updated staff skill.
```json
{
    "code": 200,
    "message": "StaffSkill for staff_id 123 and skill_id 456 updated successfully.",
    "data": {
        "staff_id": 123,
        "skill_id": 456,
        "ss_status": "inactive"
    }
}
```

- `404 Not Found` - If the staff skill is not found, it returns an error message.
```json
{
    "code": 404,
    "message": "StaffSkill for staff_id 123 and skill_id 456 not found. Nothing updated."
}
```

- `400 Bad Request` - If there is an error during the update process, it returns an error message.
```json
{
    "code": 400,
    "message": "Failed to update StaffSkill. Error: <error_message>"
}
```

**5. Get Staff Skills by Skill ID**

- **Endpoint:** `GET /getStaffSkillsBySkill/<int:skill_id>`
- **Description:** Retrieve all staff skills associated with a specific skill by providing the `skill_id`.

**Request:**
```http
GET /getStaffSkillsBySkill/456
```

**Response:**
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