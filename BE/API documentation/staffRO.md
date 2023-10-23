# Staff Reporting Officer API Documentation

This documentation describes the API endpoints for managing staff reporting officer associations using a Flask-based web application. The API allows you to retrieve staff reporting officer associations in a database.

## 1. Staff Reporting Officer Association Model

The `StaffReportingOfficer` model represents a staff reporting officer association with the following attributes:

- `staff_id` (Integer, Primary Key): Identifier for the staff member associated with the reporting officer.
- `RO_id` (Integer): Identifier for the reporting officer associated with the staff member.

## 2. Endpoints
### 2.1. Get Staff Reporting Officer by Staff ID

- **Endpoint:** `GET /api/staff/staffRO/getOne/<int:staff_id>`
- **Description:** Retrieve the staff reporting officer associated with a specific `staff_id`.

- **Response:**
    - `200 OK` - If a staff reporting officer is found for the provided `staff_id`, it returns the association's data.
    ```json
    {
        "code": 200,
        "data": {
            "staff_id": 123,
            "RO_id": 456
        }
    }
    ```

    - `404 Not Found` - If no staff reporting officer is found for the provided `staff_id`, it returns an error message.
    ```json
    {
        "code": 404,
        "message": "No staff reporting officers found for staff_id <staff_id>."
    }
    ```

### 2.2. Get All Staff Reporting Officer Associations
- **Endpoint:** `GET /api/staff/staffRO/getAll`
- **Description:** Retrieve a list of all staff reporting officer associations in the database.
- **Response**
    - `200 OK` - If staff reporting officer associations are found, it returns a list of all associations.
    ```json
    {
        "code": 200,
        "data": {
            "staff_reporting_officers": [
                {
                    "staff_id": 123,
                    "RO_id": 456
                },
                ...
            ]
        }
    }
    ```
    - `404 Not Found` - If no staff reporting officer associations are found, it returns an error message.
    ```json
    {
        "code": 404,
        "message": "No staff reporting officers in the database."
    }
    ```