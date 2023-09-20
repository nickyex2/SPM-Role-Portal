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
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost:3306/staff'
# elif my_os == "win32" or my_os == "win64":
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/staff'

db = SQLAlchemy(app)

CORS(app, allow_headers=['Content-Type', 'Access-Control-Allow-Origin',
                         'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods'])

# staff table setup
class Staff(db.Model):
    __tablename__ = 'staff'  
    staff_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    staff_name = db.Column(db.String(300), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    current_position = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    skill_id = db.Column(db.Integer, db.ForeignKey('skillset.skill_id'), nullable=False)

    def __init__(self, staff_id, staff_name, dob, gender, current_position, email, contact, skill_id):
        self.staff_id = staff_id
        self.staff_name = staff_name
        self.dob = dob
        self.gender = gender
        self.current_position = current_position
        self.email = email
        self.contact = contact
        self.skill_id = skill_id

    def json(self):
        return {"staff_id": self.staff_id, "staff_name": self.staff_name, "dob": self.dob, "gender": self.gender, 
        "current_position": self.current_position, "email": self.email, "contact": self.contact, "skill_id": self.skill_id}

# get all staffs from db
@app.route("/staff")
def get_all():
    staffProfile = Staff.query.all()
    if len(staffProfile):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staffs": [staff.json() for staff in staffProfile]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No staff in the staff database."
        }
    ),404

# get staff by id
@app.route("/staff/<string:staff_id>")
def find_by_id(staff_id):
    staff = Staff.query.filter_by(staff_id=staff_id).first()
    if staff:
        return jsonify(
            {
                "code": 200,
                "data": staff.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Staff not found."
        }
    ), 404

# create new staff
@app.route("/staff/<string:staff_id>", methods=['POST'])
def create_staff(staff_id):
    if Staff.query.filter_by(staff_id=staff_id).first():
        return jsonify(
            {
                "code": 410,
                "data": {
                    "staff_id": staff_id
                },
                "message": "Staff already exists."
            }
        ), 410

    data = request.get_json(force=True)
    print("data is " + format(data))
    staff = Staff(staff_id, **data)

    try:
        db.session.add(staff)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 501,
                "data": {
                    "staff_id": staff_id
                },
                "message": "An error occurred creating the staff."
            }
        ), 501

    return jsonify(
        {
            "code": 201,
            "data": staff.json()
        }
    ), 201

if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=5000, debug=True)


# export dbURL=mysql+mysqlconnector://root:root@localhost:3306/staff