from flask import jsonify, request
from . import skills
from api import db
import enum

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"

# skill table setup
class Skill(db.Model):
    __tablename__ = 'SKILL_DETAILS'  
    skill_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    skill_name = db.Column(db.String(300), nullable=False)
    skill_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, skill_id, skill_name, skill_status):
        self.skill_id = skill_id
        self.skill_name = skill_name
        self.skill_status = skill_status

    def json(self):
        return {"skill_id": self.skill_id, "skill_name": self.skill_name, "skill_status": self.skill_status.name}
    
# get all skills from db
@skills.route("/getAll")
def get_all():
    Skills = Skill.query.all()
    if Skills:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "skills": [skill.json() for skill in Skills]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No skills in the SKILL_DETAILS database."
        }
    ),404

# get skill by id
@skills.route("/getOne/<int:skill_id>")
def find_by_id(skill_id):
    skill = Skill.query.filter_by(skill_id=skill_id).first()
    if skill:
        return jsonify(
            {
                "code": 200,
                "data": skill.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Skill not found."
        }
    ), 404

#get skills by skill_ids
@skills.route("/getMulti", methods=['POST'])
def find_by_ids():
    data = request.get_json(force=True)
    skill_ids = data['skill_ids']
    skills = Skill.query.filter(Skill.skill_id.in_(skill_ids)).all()
    if skills:
        return jsonify(
            {
                "code": 200,
                "data": [skill.json() for skill in skills]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Skills not found."
        }
    ), 404

# # create new skill
# @skills.route("/create/<int:skill_id>", methods=['POST'])
# def create_skill(skill_id):
#     if Skill.query.filter_by(skill_id=skill_id).first():
#         return jsonify(
#             {
#                 "code": 410,
#                 "data": {
#                     "skill_id": skill_id
#                 },
#                 "message": "skill already exists."
#             }
#         ), 410

#     data = request.get_json(force=True)
#     print("data is " + format(data))
#     skill = Skill(skill_id, **data)

#     try:
#         db.session.add(skill)
#         db.session.commit()
#     except:
#         return jsonify(
#             {
#                 "code": 501,
#                 "data": {
#                     "skill_id": skill_id
#                 },
#                 "message": "An error occurred creating the skill."
#             }
#         ), 501

#     return jsonify(
#         {
#             "code": 201,
#             "data": skill.json()
#         }
#     ), 201

# # update skillset by skill_id
# @skills.route("/update/<int:skill_id>", methods=['PUT'])
# def update_skill(skill_id):
#     skill = Skill.query.filter_by(skill_id=skill_id).first()
#     if skill:
#         skillStatus = request.get_json(force=True)
#         print("data is " + format(skillStatus))
#         skill.skill_status = skillStatus["skill_status"]
#     try:
#         db.session.commit()
#     except:
#         return jsonify(
#             {
#                 "code": 502,
#                 "data": {
#                     "skill_id": skill_id
#                 },
#                 "message": "An error occurred updating the skill."
#             }
#         ), 502
    
#     return jsonify(
#         {
#             "code": 202,
#             "data": skill.json()
#         }
#     ), 202

# # delete skillset by skill_id
# @skills.route("/delete/<int:skill_id>", methods=['POST'])
# def delete_skill(skill_id):
#     # Check if the skill with the given skill_id exists
#     skill = Skill.query.get(skill_id)

#     if skill is None:
#         return jsonify(
#             {
#                 "code": 404,
#                 "data": {
#                     "skill_id": skill_id
#                 },
#                 "message": "Skill not found"
#             }
#         ), 404

#     # Delete the skill
#     db.session.delete(skill)
#     db.session.commit()

#     return jsonify(
#         {   "code": 200,
#             "message": "Skill deleted successfully"
#         }
#     ), 200