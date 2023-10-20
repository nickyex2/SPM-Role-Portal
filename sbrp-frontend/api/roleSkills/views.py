from flask import jsonify, request
from . import roleSkills
from .models import RoleSkills
from api import db


# Create a new RoleSkills association
@roleSkills.route("/create", methods=["POST"])
def create_role_skills():
    try:
        data = request.get_json()
        role_id = data.get("role_id")
        skill_id = data.get("skill_id")

        role_skills = RoleSkills(
            role_id=role_id,
            skill_id=skill_id
        )

        db.session.add(role_skills)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "RoleSkills association created successfully.",
            "data": role_skills.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create RoleSkills association. Error: {str(e)}"
            }
        ), 400

# Get all RoleSkills associations
@roleSkills.route("/getAll")
def get_all_role_skills():
    role_skills = RoleSkills.query.all()
    if role_skills:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_skills": [rs.json() for rs in role_skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No RoleSkills associations in the database."
        }
    ), 404

# Get RoleSkills associations for a specific role_id
@roleSkills.route("/getByRole/<int:role_id>")
def get_role_skills_by_role_id(role_id):
    role_skills = RoleSkills.query.filter_by(role_id=role_id).all()
    if role_skills:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_skills": [rs.json() for rs in role_skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No RoleSkills associations found for role_id {role_id}."
        }
    ), 404

@roleSkills.route("/getMultiRole", methods=["POST"])
def get_specific_role_skills():
    try:
        data = request.get_json()
        role_ids = data.get("role_ids")
        role_skills = RoleSkills.query.filter(RoleSkills.role_id.in_(role_ids)).all()
        returnDict = {rs: [] for rs in role_ids}
        for rs in role_skills:
            if rs.role_id in returnDict:
                returnDict[rs.role_id].roleSkillsend(rs.json().get("skill_id"))
            else:
                returnDict[rs.role_id] = [rs.json().get("skill_id")]
        if role_skills:
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
                    "message": f"No RoleSkills association found with role_ids."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Error: {str(e)}"
            }
        ), 400
    
# Delete a RoleSkills association by role_id and skill_id
# @roleSkills.route("/deleteRoleSkills/<int:role_id>/<int:skill_id>", methods=["DELETE"])
# def delete_role_skills(role_id, skill_id):
#     try:
#         role_skills = RoleSkills.query.filter_by(role_id=role_id, skill_id=skill_id).first()
#         if role_skills:
#             db.session.delete(role_skills)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"RoleSkills association with role_id {role_id} and skill_id {skill_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"No RoleSkills association found with role_id {role_id} and skill_id {skill_id}. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete RoleSkills association with role_id {role_id} and skill_id {skill_id}. Error: {str(e)}"
#             }
#         ), 400