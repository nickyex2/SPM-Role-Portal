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

class StaffRole(db.Model):
    __tablename__ = 'STAFF_ROLES'
    staff_id = db.Column(db.Integer, primary_key=True)
    staff_role = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.Enum('primary', 'secondary'), nullable=False)
    sr_status = db.Column(db.Enum('active', 'inactive'), nullable=False)

    def __init__(self, staff_id, staff_role, role_type, sr_status):
        self.staff_id = staff_id
        self.staff_role = staff_role
        self.role_type = role_type
        self.sr_status = sr_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "staff_role": self.staff_role,
            "role_type": self.role_type,
            "sr_status": self.sr_status
        }
    
# Create a new StaffRole
@app.route("/createStaffRole", methods=["POST"])
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
@app.route("/getAllStaffRoles")
def get_all_staff_roles():
    staff_roles = StaffRole.query.all()
    if len(staff_roles):
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
@app.route("/getStaffRole/<int:staff_id>/<int:staff_role>")
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
@app.route("/updateStaffRole/<int:staff_id>/<int:staff_role>", methods=["PUT"])
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

# Delete a specific StaffRole by staff_id and staff_role
@app.route("/deleteStaffRole/<int:staff_id>/<int:staff_role>", methods=["DELETE"])
def delete_staff_role(staff_id, staff_role):
    try:
        staff_role_obj = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
        if staff_role_obj:
            db.session.delete(staff_role_obj)
            db.session.commit()

            return jsonify(
                {
                    "code": 200,
                    "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} deleted successfully."
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found. Nothing deleted."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to delete StaffRole with staff_id {staff_id} and staff_role {staff_role}. Error: {str(e)}"
            }
        ), 400
    
@app.route("/getStaffRolesOfSpecificStaff/<int:staff_id>")
def get_all_staff_roles_by_staff(staff_id):
    staff_roles = StaffRole.query.filter_by(staff_id=staff_id).all()
    if len(staff_roles):
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
if __name__ == '__main__':
# host=’0.0.0.0’ allows the service to be accessible from any other in the network 
# and not only from your own computer
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)
