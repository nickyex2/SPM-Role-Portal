from flask import jsonify, request
from . import role
from .models import Role
from api import db

# Get all Roles
@role.route("/getAllRoles")
def get_all_roles():
    roles = Role.query.all()
    if roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "roles": [role.json() for role in roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No roles in the database."
        }
    ), 404

# Get a specific Role by role_id
@role.route("/getRole/<int:role_id>")
def get_role(role_id):
    role = Role.query.get(role_id)
    if role:
        return jsonify(
            {
                "code": 200,
                "data": role.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"Role with ID {role_id} not found."
        }
    ), 404

@role.route("/getRoles", methods=["POST"])
def get_roles():
    data = request.get_json()
    role_ids = data['role_ids']
    roles = Role.query.filter(Role.role_id.in_(role_ids)).all()
    if roles:
        return jsonify(
            {
                "code": 200,
                "data": [role.json() for role in roles]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"Roles with IDs {role_ids} not found."
        }
    ), 404

# Update a specific Role by role_id
@role.route("/updateRole/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    try:
        data = request.get_json()
        role = Role.query.get(role_id)
        if role:
            role.role_name = data.get("role_name", role.role_name)
            role.role_description = data.get("role_description", role.role_description)
            role.role_status = data.get("role_status", role.role_status)
            db.session.commit()
            return jsonify(
                {
                    "code": 200,
                    "message": f"Role with ID {role_id} updated successfully.",
                    "data": role.json()
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"Role with ID {role_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update Role with ID {role_id}. Error: {str(e)}"
            }
        ), 400

# Create a new Role
@role.route("/createRole", methods=["POST"])
def create_role():
    try:
        data = request.get_json()
        role = Role(
            role_name=data["role_name"],
            role_description=data["role_description"],
            role_status=data["role_status"]
        )
        db.session.add(role)
        db.session.commit()
        return jsonify(
            {
                "code": 201,
                "message": "Role created successfully.",
                "data": role.json()
            }
        ), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create Role. Error: {str(e)}"
            }
        ), 400

# # Delete a specific Role by role_id
# @role.route("/deleteRole/<int:role_id>", methods=["DELETE"])
# def delete_role(role_id):
#     try:
#         role = Role.query.get(role_id)
#         if role:
#             db.session.delete(role)
#             db.session.commit()
#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"Role with ID {role_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"Role with ID {role_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete Role with ID {role_id}. Error: {str(e)}"
#             }
#         ), 400