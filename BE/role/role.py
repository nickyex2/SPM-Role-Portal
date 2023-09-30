from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
import os
from flask_cors import CORS
from dotenv import load_dotenv
import enum
import json


load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"
    
class Role(db.Model):
    __tablename__ = 'ROLE_DETAILS'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(50), nullable=False)
    role_description = db.Column(db.String(10000), nullable=False)
    role_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, role_name, role_description, role_status):
        self.role_name = role_name
        self.role_description = role_description
        self.role_status = role_status

    def json(self):
        return {
            "role_id": self.role_id,
            "role_name": self.role_name,
            "role_description": self.role_description,
            "role_status": self.role_status.name
        }

# Get all Roles
@app.route("/getAllRoles")
def get_all_roles():
    roles = Role.query.all()
    if len(roles):
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
@app.route("/getRole/<int:role_id>")
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

# Update a specific Role by role_id
@app.route("/updateRole/<int:role_id>", methods=["PUT"])
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

# # Delete a specific Role by role_id
# @app.route("/deleteRole/<int:role_id>", methods=["DELETE"])
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
    

# Create a new Role
@app.route("/createRole", methods=["POST"])
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
    
if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)