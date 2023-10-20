from flask import jsonify, request
from . import staffRole
from .models import StaffRole
from api import db

# Create a new StaffRole
@staffRole.route("/createStaffRole", methods=["POST"])
def create_staff_role():
    try:
        data = request.get_json()
        staff_id = data.get("staff_id")
        staff_role = data.get("staff_role")
        role_type = data.get("role_type")
        sr_status = data.get("sr_status")

        staff_role = StaffRole(
            staff_id=staff_id,
            staff_role=staff_role,
            role_type=role_type,
            sr_status=sr_status
        )

        db.session.add(staff_role)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "StaffRole created successfully.",
            "data": staff_role.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create StaffRole. Error: {str(e)}"
            }
        ), 400

# Get all StaffRoles
@staffRole.route("/getAllStaffRoles")
def get_all_staff_roles():
    staff_roles = StaffRole.query.all()
    if staff_roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_roles": [staff_role.json() for staff_role in staff_roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No staff roles in the database."
        }
    ), 404

# Get a specific StaffRole by staff_id and staff_role
@staffRole.route("/getStaffRole/<int:staff_id>/<int:staff_role>")
def get_staff_role(staff_id, staff_role):
    staff_role = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
    if staff_role:
        return jsonify(
            {
                "code": 200,
                "data": staff_role.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found."
        }
    ), 404

# Update a specific StaffRole by staff_id and staff_role
@staffRole.route("/updateStaffRole/<int:staff_id>/<int:staff_role>", methods=["PUT"])
def update_staff_role(staff_id, staff_role):
    try:
        data = request.get_json()
        role_type = data.get("role_type")
        sr_status = data.get("sr_status")

        staff_role_obj = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
        if staff_role_obj:
            staff_role_obj.role_type = role_type
            staff_role_obj.sr_status = sr_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} updated successfully.",
                "data": staff_role_obj.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update StaffRole with staff_id {staff_id} and staff_role {staff_role}. Error: {str(e)}"
            }
        ), 400
    
@staffRole.route("/getStaffRolesOfSpecificStaff/<int:staff_id>")
def get_all_staff_roles_by_staff(staff_id):
    staff_roles = StaffRole.query.filter_by(staff_id=staff_id).all()
    if staff_roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_roles": [staff_role.json() for staff_role in staff_roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No staff roles found for staff with ID {staff_id}."
        }
    ), 404

# # Delete a specific StaffRole by staff_id and staff_role
# @staffRole.route("/deleteStaffRole/<int:staff_id>/<int:staff_role>", methods=["DELETE"])
# def delete_staff_role(staff_id, staff_role):
#     try:
#         staff_role_obj = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
#         if staff_role_obj:
#             db.session.delete(staff_role_obj)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete StaffRole with staff_id {staff_id} and staff_role {staff_role}. Error: {str(e)}"
#             }
#         ), 400

