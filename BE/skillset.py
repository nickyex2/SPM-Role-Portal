from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
from os import environ
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# check os and change sql setting respectively
# my_os=sys.platform
# if my_os == "darwin":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/skillset'
# elif my_os == "win32" or my_os == "win64":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/skillset'

db = SQLAlchemy(app)

CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])

# skill table setup
class Skillset(db.Model):
    __tablename__ = 'skillset'  
    skill_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    skill_name = db.Column(db.String(300), nullable=False)
    skill_description = db.Column(db.String(500), nullable=False)

    def __init__(self, skill_id, skill_name, skill_description):
        self.skill_id = skill_id
        self.skill_name = skill_name
        self.skill_description = skill_description

    def json(self):
        return {"skill_id": self.skill_id, "skill_name": self.skill_name, "skill_description": self.skill_description}

# get all skills from db
@app.route("/skill")
def get_all():
    Skills = Skillset.query.all()
    if len(Skills):
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
            "message": "Oops. No skills in the skillset database."
        }
    ),404

# get skill by id
@app.route("/skill/<int:skill_id>")
def find_by_id(skill_id):
    skill = Skillset.query.filter_by(skill_id=skill_id).first()
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

# create new skill
@app.route("/skill/<int:skill_id>", methods=['POST'])
def create_skill(skill_id):
    if Skillset.query.filter_by(skill_id=skill_id).first():
        return jsonify(
            {
                "code": 410,
                "data": {
                    "skill_id": skill_id
                },
                "message": "skill already exists."
            }
        ), 410

    data = request.get_json(force=True)
    print("data is " + format(data))
    skill = skill(skill_id, **data)

    try:
        db.session.add(skill)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 501,
                "data": {
                    "skill_id": skill_id
                },
                "message": "An error occurred creating the skill."
            }
        ), 501

    return jsonify(
        {
            "code": 201,
            "data": skill.json()
        }
    ), 201

# update skillset by skill_id
@app.route("/skillset/<int:skill_id>", methods=['PUT'])
def update_skill(skill_id):
    skill = Skillset.query.filter_by(skill_id=skill_id).first()
    print(skill)
    if skill:
        print(skill)
        skillStatus = request.get_json(force=True)
        print("data is " + format(skillStatus))
        skill.skill_description = skillStatus["skill_description"]
    try:
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 502,
                "data": {
                    "skill_id": skill_id
                },
                "message": "An error occurred updating the skill."
            }
        ), 502
    
    skill = json.dumps(skill, default=str)
    return jsonify(
        {
            "code": 202,
            "data": skill
        }
    ), 202

# delete skillset by skill_id
@app.route("/skill/<int:skill_id>", methods=['POST'])
def delete_skill(skill_id):
    # Check if the skill with the given skill_id exists
    skill = Skillset.query.get(skill_id)

    if skill is None:
        return jsonify(
            {
                "code": 404,
                "data": {
                    "skill_id": skill_id
                },
                "message": "Skill not found"
            }
        ), 404

    # Delete the skill
    db.session.delete(skill)
    db.session.commit()

    return jsonify(
        {   "code": 200,
            "message": "Skill deleted successfully"
        }
    ), 200


if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=5000, debug=True)


# export dbURL=mysql+mysqlconnector://root:root@localhost:3306/skill