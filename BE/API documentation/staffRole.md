## Staff Role API Documentation

### 1. Create a New Staff Role

- **Endpoint:** `POST /createStaffRole`
- **Description:** Create a new staff role by providing `staff_id`, `staff_role`, `role_type`, and `sr_status` in the request body.

**Request:**
```http
POST /createStaffRole
Content-Type: application/json
```

**Request Body:**
```json
{
    "staff_id": 123,
    "staff_role": 456,
    "role_type": "primary",
    "sr_status": "active"
}
```

**Response:**
- `201 Created` - Successfully created a staff role.
```json
{
    "code": 201,
    "message": "StaffRole created successfully.",
    "data": {
        "staff_id": 123,
        "staff_role": 456,
        "role_type": "primary",
        "sr_status": "active"
    }
}
```

- `400 Bad Request` - If there is an error in the request, it will return an error message.
```json
{
    "code": 400,
    "message": "Failed to create StaffRole. Error: <error_message>"
}
```

### 2. Get All Staff Roles

- **Endpoint:** `GET /getAllStaffRoles`
- **Description:** Retrieve all staff roles from the database.

**Request:**
```http
GET /getAllStaffRoles
```

**Response:**
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

### 3. Get a Specific Staff Role

- **Endpoint:** `GET /getStaffRole/<int:staff_id>/<int:staff_role>`
- **Description:** Retrieve a specific staff role by providing `staff_id` and `staff_role`.

**Request:**
```http
GET /getStaffRole/123/456
```

**Response:**
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

### 4. Update a Specific Staff Role

- **Endpoint:** `PUT /updateStaffRole/<int:staff_id>/<int:staff_role>`
- **Description:** Update a specific staff role by providing `role_type` and `sr_status` in the request body.

**Request:**
```http
PUT /updateStaffRole/123/456
Content-Type: application/json
```

**Request Body:**
```json
{
    "role_type": "secondary",
    "sr_status": "inactive"
}
```

**Response:**
- `200 OK` - If the staff role is found and updated successfully, it returns the updated staff role data.
```json
{
    "code": 200,
    "message": "StaffRole with staff_id 123 and staff_role 456 updated successfully.",
    "data": {
        "staff_id": 123,
        "staff_role": 456,
        "role_type": "secondary",
        "sr_status": "inactive"
    }
}
```

- `404 Not Found` - If the staff role is not found, it returns an error message.
```json
{
    "code": 404,
    "message": "StaffRole with staff_id 123 and staff_role 456 not found. Nothing updated."
}
```

- `400 Bad Request` - If there is an error in the request, it returns an error message.
```json
{
    "code": 400,
    "message": "Failed to update StaffRole with staff_id 123 and staff_role 456. Error: <error_message>"
}
```

Here's the API documentation for the remaining `StaffRole` endpoints:

---

**5. Delete a Specific Staff Role**

- **Endpoint:** `DELETE /deleteStaffRole/<int:staff_id>/<int:staff_role>`
- **Description:** Delete a specific staff role by providing `staff_id` and `staff_role`.

**Request:**
```http
DELETE /deleteStaffRole/123/456
```

**Response:**
- `200 OK` - If the staff role is found and deleted successfully, it returns a success message.
```json
{
    "code": 200,
    "message": "StaffRole with staff_id 123 and staff_role 456 deleted successfully."
}
```

- `404 Not Found` - If the staff role is not found, it returns an error message.
```json
{
    "code": 404,
    "message": "StaffRole with staff_id 123 and staff_role 456 not found. Nothing deleted."
}
```

- `400 Bad Request` - If there is an error during the deletion process, it returns an error message.
```json
{
    "code": 400,
    "message": "Failed to delete StaffRole with staff_id 123 and staff_role 456. Error: <error_message>"
}
```

**7. Get All Staff Roles of a Specific Staff Member**

- **Endpoint:** `GET /getStaffRolesOfSpecificStaff/<int:staff_id>`
- **Description:** Retrieve all staff roles associated with a specific staff member by providing their `staff_id`.

**Request:**
```http
GET /getStaffRolesOfSpecificStaff/123
```

**Response:**
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