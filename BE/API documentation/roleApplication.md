# Role Application API Documentation

This documentation describes the API endpoints for managing role applications using a Flask-based web application. The API allows you to create, retrieve, update, and delete role applications in a database.

## 1. Role Application Model

The `RoleApplication` model represents a role application with the following attributes:

- `role_app_id` (Integer, Primary Key, Auto-increment): Unique identifier for the role application.
- `role_listing_id` (Integer): Identifier for the role listing associated with the application.
- `staff_id` (Integer): Identifier for the staff member making the application.
- `role_app_status` (Enum): The status of the role application, which can be one of the following:
  - "Applied"
  - "Rejected"
  - "Accepted"

## 2. Endpoints

### 2.1. Create a New Role Application

- **Endpoint:** `POST /createRoleApplication`
- **Description:** Create a new role application by providing role application information in the request body.
- **Request Body:**
  ```json
  {
      "role_listing_id": 1,
      "staff_id": 1,
      "role_app_status": "Applied"
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
        "message": "RoleApplication created successfully.",
        "data": {
            "role_app_id": 1,
            "role_listing_id": 1,
            "staff_id": 1,
            "role_app_status": "Applied"
        }
    }
    ```

  - Create failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to create RoleApplication. Error: {error_message}"
    }
    ```

### 2.2. Get All Role Applications

- **Endpoint:** `GET /getAllRoleApplications`
- **Description:** Retrieve a list of all role applications in the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_applications": [
                {
                    "role_app_id": 1,
                    "role_listing_id": 1,
                    "staff_id": 1,
                    "role_app_status": "Applied"
                },
                // Add more role application objects if needed
            ]
        }
    }
    ```

  - No role applications found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No role applications in the database."
    }
    ```

### 2.3. Get Role Applications by Role Listing ID

- **Endpoint:** `GET /getRoleApplicationsListing/<int:role_listing_id>`
- **Description:** Retrieve role applications associated with a specific role listing by providing its unique `role_listing_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_applications": [
                {
                    "role_app_id": 1,
                    "role_listing_id": 1,
                    "staff_id": 1,
                    "role_app_status": "Applied"
                },
                // Add more role application objects if needed
            ]
        }
    }
    ```

  - Role applications not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No role applications for role listing with ID {role_listing_id} found."
    }
    ```

### 2.4. Get Role Applications by Staff ID

- **Endpoint:** `GET /getRoleApplicationsStaff/<int:staff_id>`
- **Description:** Retrieve role applications associated with a specific staff member by providing their unique `staff_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_applications": [
                {
                    "role_app_id": 1,
                    "role_listing_id": 1,
                    "staff_id": 1,
                    "role_app_status": "Applied"
                },
                // Add more role application objects if needed
            ]
        }
    }
    ```

  - Role applications not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No role applications for staff with ID {staff_id} found."
    }
    ```

### 2.5. Get Role Application by Role Listing ID and Staff ID

- **Endpoint:** `GET /getRoleApplication/<int:role_listing_id>/<int:staff_id>`
- **Description:** Retrieve a role application by providing the unique `role_listing_id` and `staff_id` associated with the application.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_app_id": 1,
            "role_listing_id": 1,
            "staff_id": 1,
            "role_app_status": "Applied"
        }
    }
    ```

  - Role application not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "RoleApplication with role_listing_id {role_listing_id} and staff ID {staff_id} not found."
    }
    ```

### 2.6. Update a Specific Role Application by role_app_id

- **Endpoint:** `PUT /updateRoleApplication/<int:role_app_id>`
- **Description:** Update the status of a specific role application by providing its unique `role_app_id`.
- **Request Body:**
  ```json
  {
      "role_app_status": "Rejected"
  }
  ```
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "message": "RoleApplication with ID {role_app_id} updated successfully.",
        "data": {
            "role_app_id": 1,
            "role_listing_id": 1,
            "staff_id": 1,
            "role_app_status": "Rejected"
        }
    }
    ```

  - Role application not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "RoleApplication with ID {role_app_id} not found. Nothing updated."
    }
    ```

  - Update failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to update RoleApplication with ID {role_app_id}. Error: {error_message}"
    }
    ```

### 2.7. Delete a Specific Role Application by role_app_id

- **Endpoint:** `DELETE /deleteRoleApplication/<int:role_app_id>`
- **Description:** Delete a specific role application by providing its unique `role_app_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "message": "RoleApplication with ID {role_app_id} deleted successfully."
    }
    ```

  - Role application not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "RoleApplication with ID {role_app_id} not found. Nothing deleted."
    }
    ```

  - Deletion failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to delete RoleApplication with ID {role_app_id}. Error: {error_message}"
    }
    ```