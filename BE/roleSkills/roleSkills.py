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

class RoleSkills(db.Model):
    __tablename__ = 'ROLE_SKILLS'
    role_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)

    def __init__(self, role_id, skill_id):
        self.role_id = role_id
        self.skill_id = skill_id

    def json(self):
        return {
            "role_id": self.role_id,
            "skill_id": self.skill_id
        }
    
# Routes

# Create a new RoleSkills association
@app.route("/createRoleSkills", methods=["POST"])
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
@app.route("/getAllRoleSkills")
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
@app.route("/getRoleSkills/<int:role_id>")
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

@app.route("/getSpecificRoleSkills", methods=["POST"])
def get_specific_role_skills():
    try:
        data = request.get_json()
        role_ids = data.get("role_id")
        role_skills = RoleSkills.query.filter(RoleSkills.role_id.in_(role_ids)).all()
        returnDict = {}
        for rs in role_skills:
            if rs.role_id in returnDict:
                returnDict[rs.role_id].append(rs.json().get("skill_id"))
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
@app.route("/deleteRoleSkills/<int:role_id>/<int:skill_id>", methods=["DELETE"])
def delete_role_skills(role_id, skill_id):
    try:
        role_skills = RoleSkills.query.filter_by(role_id=role_id, skill_id=skill_id).first()
        if role_skills:
            db.session.delete(role_skills)
            db.session.commit()

            return jsonify(
                {
                    "code": 200,
                    "message": f"RoleSkills association with role_id {role_id} and skill_id {skill_id} deleted successfully."
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"No RoleSkills association found with role_id {role_id} and skill_id {skill_id}. Nothing deleted."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to delete RoleSkills association with role_id {role_id} and skill_id {skill_id}. Error: {str(e)}"
            }
        ), 400


@app.route("/getSpecificRoleSkills", methods=["POST"])
def get_specific_role_skills():
    try:
        data = request.get_json()
        role_ids = data.get("role_id")
        role_skills = RoleSkills.query.filter(RoleSkills.role_id.in_(role_ids)).all()
        returnDict = {}
        for rs in role_skills:
            if rs.role_id in returnDict:
                returnDict[rs.role_id].append(rs.json().get("skill_id"))
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
    
if __name__ == '__main__':
# host=’0.0.0.0’ allows the service to be accessible from any other in the network 
# and not only from your own computer
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)