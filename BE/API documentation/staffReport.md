## Staff Reporting Officer API Documentation

### 1. Create a New Staff Reporting Officer

- **Endpoint:** `POST /createStaffReportingOfficer`
- **Description:** Create a new staff reporting officer association by providing `staff_id` and `RO_id` in the request body.

**Request:**
```http
POST /createStaffReportingOfficer
Content-Type: application/json
```

**Request Body:**
```json
{
    "staff_id": 123,
    "RO_id": 456
}
```

**Response:**
- `201 Created` - Successfully created a staff reporting officer association.
```json
{
    "code": 201,
    "message": "StaffReportingOfficer created successfully.",
    "data": {
        "staff_id": 123,
        "RO_id": 456
    }
}
```

- `400 Bad Request` - If there is an error in the request, it will return an error message.
```json
{
    "code": 400,
    "message": "Failed to create StaffReportingOfficer. Error: <error_message>"
}
```

### 2. Get Staff Reporting Officer by Staff ID

- **Endpoint:** `GET /getStaffReportingOfficer/<int:staff_id>`
- **Description:** Retrieve the staff reporting officer associated with a specific `staff_id`.

**Request:**
```http
GET /getStaffReportingOfficer/<staff_id>
```

**Response:**
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
