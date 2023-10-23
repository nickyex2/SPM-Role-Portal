# Role Listing API Documentation

This documentation describes the API endpoints for managing role listings using a Flask-based web application. The API allows you to create, retrieve, update, and view changes related to role listings in a database.

## 1. Role Listing Model

### 1.1 Role Listing
The `RoleListing` model represents a role listing with the following attributes:

- `role_listing_id` (Integer, Primary Key): Unique identifier for the role listing.
- `role_id` (Integer): Identifier for the associated role.
- `role_listing_desc` (String, 255 characters): Description of the role listing.
- `role_listing_source` (String, 255 characters): Source of the role listing.
- `role_listing_open` (Date): Date when the role listing is open.
- `role_listing_close` (Date): Date when the role listing is closed.
- `role_listing_creator` (String, 255 characters): Creator of the role listing.
- `role_listing_status` (String, 255 characters): Status of the role listing (e.g., active, inactive).
- `role_listing_updater` (Integer): Updater of the role listing.
- `role_listing_ts_create` (Timestamp): Timestamp for when the role listing was created. This field is automatically set when the role listing is created.
- `role_listing_ts_update` (Timestamp): Timestamp for when the role listing was last updated. This field is automatically set when the role listing is created/updated.

### 1.2 Role Listing Changes
The `RoleListingChange` model represents a change to a role listing with the following attributes:

- `change_id` (Integer, Primary Key): Unique identifier for the change. This key is automatically generated.
- `role_listing_id` (Integer, Primary Key): Identifier for the role listing associated with the change.
- `change_no` (Integer, Primary Key): Change number for the change. This number is automatically generated.
- `log_time` (Timestamp): Timestamp for when the change was made. This field is automatically set when the change is created.
- `role_listing_updater` (Integer): Updater of the role listing.
- `changed_field` (String, 255 characters): Name of the field that was changed.
- `old_value` (String, 255 characters): Old value of the field that was changed.
- `new_value` (String, 255 characters): New value of the field that was changed.

## 2. Endpoints

### 2.1. Create a New Role Listing

- **Endpoint:** `POST /api/role/roleListing/create`
- **Description:** Create a new role listing by providing role listing information in the request body.
- **Request Body:**
  ```json
  {
      "role_listing_id": 1,
      "role_id": 1,
      "role_listing_desc": "Sample Role Listing",
      "role_listing_source": "Internal",
      "role_listing_open": "2023-10-15",
      "role_listing_close": "2023-11-15",
      "role_listing_creator": "John Doe",
      "role_listing_status": "active",
      "role_listing_updater": 1
  }
  ```
- **Response:**

  - Success (Status Code: 201 Created)
    ```json
    {
        "code": 201,
        "message": "RoleListing created successfully.",
        "data": {
            "role_listing_id": 1,
            "role_id": 1,
            "role_listing_desc": "Sample Role Listing",
            "role_listing_source": "Internal",
            "role_listing_open": "2023-10-15",
            "role_listing_close": "2023-11-15",
            "role_listing_creator": "John Doe",
            "role_listing_status": "active",
            "role_listing_updater": 1
        }
    }
    ```

  - Create failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to create RoleListing. Error: {error_message}"
    }
    ```

### 2.2. Get All Role Listings

- **Endpoint:** `GET /api/role/roleListing/getAll`
- **Description:** Retrieve a list of all role listings in the database.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_listings": [
                {
                    "role_listing_id": 1,
                    "role_id": 1,
                    "role_listing_desc": "Sample Role Listing",
                    "role_listing_source": "Internal",
                    "role_listing_open": "2023-10-15",
                    "role_listing_close": "2023-11-15",
                    "role_listing_creator": "John Doe",
                    "role_listing_status": "active",
                    "role_listing_updater": 1
                },
                // Add more role listing objects if needed
            ]
        }
    }
    ```

  - No role listings found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No role listings in the database."
    }
    ```

### 2.3. Get a Specific Role Listing by `role_listing_id`

- **Endpoint:** `GET /api/role/roleListing/getOne/<int:role_listing_id>`
- **Description:** Retrieve information about a specific role listing by providing its unique `role_listing_id`.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_listing_id": 1,
            "role_id": 1,
            "role_listing_desc": "Sample Role Listing",
            "role_listing_source": "Internal",
            "role_listing_open": "2023-10-15",
            "role_listing_close": "2023-11-15",
            "role_listing_creator": "John Doe",
            "role_listing_status": "active",
            "role_listing_updater": 1
        }
    }
    ```

  - Role listing not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "RoleListing with ID {role_listing_id} not found."
    }
    ```

### 2.4. Update a Specific Role Listing by `role_listing_id`

- **Endpoint:** `PUT /api/role/roleListing/update/<int:role_listing_id>`
- **Description:** Update information for a specific role listing by providing its unique `role_listing_id` and the fields to be updated in the request body.
- **Request Body:**
  ```json
  {
      "role_listing_desc": "Updated Role Listing",
      "role_listing_status": "inactive",
      "role_listing_updater": 2
  }
  ```
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "message": "RoleListing with ID {role_listing_id} updated successfully.",
        "data": {
            "role_listing_id": 1,
            "role_id": 1,
            "role_listing_desc": "Updated Role Listing",
            "role_listing_source": "Internal",
            "role_listing_open": "2023-10-15",
            "role_listing_close": "2023-11-15",
            "role_listing_creator": "John Doe",
            "role_listing_status": "inactive",
            "role_listing_updater": 2
        }
    }
    ```

  - Role listing not found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "RoleListing with ID {role_listing_id} not found. Nothing updated."
    }
    ```

  - Update failed (Status Code: 400 Bad Request)
    ```json
    {
        "code": 400,
        "message": "Failed to update RoleListing with ID {role_listing_id}. Error: {error_message}"
    }
    ```

### 2.5. Get Role Listing Changes

- **Endpoint:** `GET /api/role/roleListing/getChanges/<int:role_listing_id>`
- **Description:** Retrieve changes associated with a specific role listing by providing its unique `role_listing_id`.
- **Request Parameters:**
  - `role_listing_id` (integer): The unique identifier of the role listing for which you want to retrieve changes.
- **Response:**

  - Success (Status Code: 200 OK)
    ```json
    {
        "code": 200,
        "data": {
            "role_listing_changes": [
                {
                    "change_id": 1,
                    "role_listing_id": 1,
                    "change_no": 1,
                    "log_time": "YYYY-MM-DD HH:MM:SS",
                    "role_listing_updater": 1,
                    "changed_field": "Field Name",
                    "old_value": "Old Value",
                    "new_value": "New Value"
                },
                // Add more change objects if needed
            ]
        }
    }
    ```

  - No changes found (Status Code: 404 Not Found)
    ```json
    {
        "code": 404,
        "message": "No changes for role listing with ID {role_listing_id} found."
    }
    ```

### 2.6. Delete a Specific Role Listing by `role_listing_id`

- **Endpoint:** `DELETE /api/role/roleListing/delete/<int:role_listing_id>`
- **Description:** Delete a specific role listing by providing its unique `role_listing_id`. This endpoint is only used for testing purposes.
- **Request Parameters:**
  - `role_listing_id` (integer): The unique identifier of the role listing you want to delete.
  - **Response**
    - Success (Status Code: 200 OK)
      ```json
      {
          "code": 200,
          "message": "RoleListing with ID {role_listing_id} deleted successfully."
      }
      ```
    - Role listing not found (Status Code: 404 Not Found)
      ```json
      {
          "code": 404,
          "message": "RoleListing with ID {role_listing_id} not found. Nothing deleted."
      }
      ```
