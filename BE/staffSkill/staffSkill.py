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
    unverified = "unverified"
    in_progress = "in progress"

class StaffSkill(db.Model):
    __tablename__ = 'STAFF_SKILLS'
    staff_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)
    ss_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, staff_id, skill_id, ss_status):
        self.staff_id = staff_id
        self.skill_id = skill_id
        self.ss_status = ss_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "skill_id": self.skill_id,
            "ss_status": self.ss_status.name
        }
    
@app.route("/createStaffSkill", methods=["POST"])
def create_staff_skill():
    try:
        data = request.get_json()
        staff_id = data.get("staff_id")
        skill_id = data.get("skill_id")
        ss_status = data.get("ss_status")

        staff_skill = StaffSkill(
            staff_id=staff_id,
            skill_id=skill_id,
            ss_status=ss_status
        )

        db.session.add(staff_skill)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "StaffSkill created successfully.",
            "data": staff_skill.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create StaffSkill. Error: {str(e)}"
            }
        ), 400
    
# Get all StaffSkills
@app.route("/getAllStaffSkills")
def get_all_staff_skills():
    staff_skills = StaffSkill.query.all()
    if len(staff_skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_skills": [staff_skill.json() for staff_skill in staff_skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No staff skills in the database."
        }
    ), 404

# Get StaffSkills for a specific staff_id
@app.route("/getStaffSkills/<int:staff_id>")
def get_staff_skills(staff_id):
    staff_skills = StaffSkill.query.filter_by(staff_id=staff_id).all()
    if len(staff_skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_skills": [staff_skill.json() for staff_skill in staff_skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No staff skills found for staff_id {staff_id}."
        }
    ), 404

# Update a specific StaffSkill
@app.route("/updateStaffSkill/<int:staff_id>/<int:skill_id>", methods=["PUT"])
def update_staff_skill(staff_id, skill_id):
    try:
        data = request.get_json()
        ss_status = data.get("ss_status")

        staff_skill = StaffSkill.query.filter_by(staff_id=staff_id, skill_id=skill_id).first()
        if staff_skill:
            staff_skill.ss_status = ss_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"StaffSkill for staff_id {staff_id} and skill_id {skill_id} updated successfully.",
                "data": staff_skill.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"StaffSkill for staff_id {staff_id} and skill_id {skill_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update StaffSkill. Error: {str(e)}"
            }
        ), 400

# # Delete a specific StaffSkill
# @app.route("/deleteStaffSkill/<int:staff_id>/<int:skill_id>", methods=["DELETE"])
# def delete_staff_skill(staff_id, skill_id):
#     try:
#         staff_skill = StaffSkill.query.filter_by(staff_id=staff_id, skill_id=skill_id).first()
#         if staff_skill:
#             db.session.delete(staff_skill)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"StaffSkill for staff_id {staff_id} and skill_id {skill_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"StaffSkill for staff_id {staff_id} and skill_id {skill_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete StaffSkill. Error: {str(e)}"
#             }
#         ), 400
    
@app.route("/getStaffSkillsBySkill/<int:skill_id>")
def get_staff_skills_by_skill(skill_id):
    staff_skills = StaffSkill.query.filter_by(skill_id=skill_id).all()
    
    if len(staff_skills):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_skills": [staff_skill.json() for staff_skill in staff_skills]
                }
            }
        )
    
    return jsonify(
        {
            "code": 404,
            "message": f"No staff skills found for skill_id {skill_id}."
        }
    ), 404
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)
