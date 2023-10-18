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

class AppliedEnum(enum.Enum):
    applied = 'applied'
    withdrawn = 'withdrawn'
class RoleApplication(db.Model):
    __tablename__ = 'ROLE_APPLICATIONS'
    role_app_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_listing_id = db.Column(db.Integer, nullable=False)
    staff_id = db.Column(db.Integer, nullable=False)
    role_app_status = db.Column(db.Enum(AppliedEnum), nullable=False)
    role_app_ts_create = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)

    def __init__(self, role_listing_id, staff_id, role_app_status):
        self.role_listing_id = role_listing_id
        self.staff_id = staff_id
        self.role_app_status = role_app_status
    
    def json(self):
        return {
            "role_app_id": self.role_app_id,
            "role_listing_id": self.role_listing_id,
            "staff_id": self.staff_id,
            "role_app_status": self.role_app_status.name,
            "role_app_ts_create": self.role_app_ts_create
        }
# Create a new RoleApplication
@app.route("/createRoleApplication", methods=["POST"])
def create_role_application():
    try:
        data = request.get_json()
        role_listing_id = data.get("role_listing_id")
        staff_id = data.get("staff_id")
        role_app_status = data.get("role_app_status")

        role_application = RoleApplication(
            role_listing_id=role_listing_id,
            staff_id=staff_id,
            role_app_status=role_app_status
        )

        db.session.add(role_application)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "RoleApplication created successfully.",
            "data": role_application.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create RoleApplication. Error: {str(e)}"
            }
        ), 400

# Get all RoleApplications
@app.route("/getAllRoleApplications")
def get_all_role_applications():
    role_applications = RoleApplication.query.all()
    if role_applications:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_applications": [role_app.json() for role_app in role_applications]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No role applications in the database."
        }
    ), 404

# Get RoleApplications by role_listing_id
@app.route("/getRoleApplicationsListing/<int:role_listing_id>")
def get_role_application(role_listing_id):
    role_application = RoleApplication.query.filter_by(role_listing_id=role_listing_id).all()
    if role_application:
        return jsonify(
            {
                "code": 200,
                "data": [role_app.json() for role_app in role_application]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with {role_listing_id} not found."
        }
    ), 404

@app.route("/getRoleApplicationsStaff/<int:staff_id>")
def get_applications_staff(staff_id):
    role_applications = RoleApplication.query.filter_by(staff_id=staff_id)
    if role_applications:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_applications": [role_app.json() for role_app in role_applications]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with staff ID {staff_id} not found."
        }
    ), 404

# get role application by role_listing_id and staff_id
@app.route("/getRoleApplication/<int:role_listing_id>/<int:staff_id>")
def get_applications_staff_role(role_listing_id, staff_id):
    role_application = RoleApplication.query.filter_by(role_listing_id=role_listing_id, staff_id=staff_id).first()
    if role_application:
        return jsonify(
            {
                "code": 200,
                "data": role_application.json() 
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with role_listing_id {role_listing_id} and staff ID {staff_id} not found."
        }
    ), 404
# Update a specific RoleApplication by role_app_id
@app.route("/updateRoleApplication/<int:role_app_id>", methods=["PUT"])
def update_role_application(role_app_id):
    try:
        data = request.get_json()
        role_app_status = data.get("role_app_status")

        role_application = RoleApplication.query.get(role_app_id)
        if role_application:
            role_application.role_app_status = role_app_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"RoleApplication with ID {role_app_id} updated successfully.",
                "data": role_application.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"RoleApplication with ID {role_app_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update RoleApplication with ID {role_app_id}. Error: {str(e)}"
            }
        ), 400

# Delete a specific RoleApplication by role_app_id
@app.route("/deleteRoleApplication/<int:role_app_id>", methods=["DELETE"])
def delete_role_application(role_app_id):
    try:
        role_application = RoleApplication.query.get(role_app_id)
        if role_application:
            db.session.delete(role_application)
            db.session.commit()

            return jsonify(
                {
                    "code": 200,
                    "message": f"RoleApplication with ID {role_app_id} deleted successfully."
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"RoleApplication with ID {role_app_id} not found. Nothing deleted."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to delete RoleApplication with ID {role_app_id}. Error: {str(e)}"
            }
        ), 400
    
if __name__ == '__main__':
# host=’0.0.0.0’ allows the service to be accessible from any other in the network 
# and not only from your own computer
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)

