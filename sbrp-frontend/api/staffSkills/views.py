from flask import jsonify, request
from . import staffSkills
from .models import StaffSkills
from api import db

@staffSkills.route("/createStaffSkills", methods=["POST"])
def create_staff_skill():
    try:
        data = request.get_json()
        staff_id = data.get("staff_id")
        skill_id = data.get("skill_id")
        ss_status = data.get("ss_status")

        staff_skill = StaffSkills(
            staff_id=staff_id,
            skill_id=skill_id,
            ss_status=ss_status
        )

        db.session.add(staff_skill)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "StaffSkills created successfully.",
            "data": staff_skill.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create StaffSkills. Error: {str(e)}"
            }
        ), 400
    
# Get all StaffSkillss
@staffSkills.route("/getAllStaffSkillss")
def get_all_staff_skills():
    staff_skills = StaffSkills.query.all()
    if staff_skills:
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

# Get StaffSkillss for a specific staff_id
@staffSkills.route("/getStaffSkillss/<int:staff_id>")
def get_staff_skills(staff_id):
    staff_skills = StaffSkills.query.filter_by(staff_id=staff_id).all()
    if staff_skills:
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

# Update a specific StaffSkills
@staffSkills.route("/updateStaffSkills/<int:staff_id>/<int:skill_id>", methods=["PUT"])
def update_staff_skill(staff_id, skill_id):
    try:
        data = request.get_json()
        ss_status = data.get("ss_status")

        staff_skill = StaffSkills.query.filter_by(staff_id=staff_id, skill_id=skill_id).first()
        if staff_skill:
            staff_skill.ss_status = ss_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"StaffSkills for staff_id {staff_id} and skill_id {skill_id} updated successfully.",
                "data": staff_skill.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"StaffSkills for staff_id {staff_id} and skill_id {skill_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update StaffSkills. Error: {str(e)}"
            }
        ), 400
    
@staffSkills.route("/getStaffSkillssBySkill/<int:skill_id>")
def get_staff_skills_by_skill(skill_id):
    staff_skills = StaffSkills.query.filter_by(skill_id=skill_id).all()
    
    if staff_skills:
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
    
@staffSkills.route("/getSpecificStaffSkillss", methods=["POST"])
def get_specific_staff_skills():
    try:
        data = request.get_json()
        staff_ids = data.get("staff_ids")
        staff_skills = StaffSkills.query.filter(StaffSkills.staff_id.in_(staff_ids)).all()
        returnDict = {ss: [] for ss in staff_ids}
        for ss in staff_skills:
            if ss.staff_id in returnDict:
                returnDict[ss.staff_id].append(ss.json().get("skill_id"))
            else:
                returnDict[ss.staff_id] = [ss.json().get("skill_id")]
        if staff_skills:
            return jsonify(
                {
                    "code": 200,
                    "data": returnDict
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"No StaffSkillss association found with staff_ids."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Error: {str(e)}"
            }
        ), 400
        
# # Delete a specific StaffSkills
# @staffSkills.route("/deleteStaffSkills/<int:staff_id>/<int:skill_id>", methods=["DELETE"])
# def delete_staff_skill(staff_id, skill_id):
#     try:
#         staff_skill = StaffSkills.query.filter_by(staff_id=staff_id, skill_id=skill_id).first()
#         if staff_skill:
#             db.session.delete(staff_skill)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"StaffSkills for staff_id {staff_id} and skill_id {skill_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"StaffSkills for staff_id {staff_id} and skill_id {skill_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete StaffSkills. Error: {str(e)}"
#             }
#         ), 400