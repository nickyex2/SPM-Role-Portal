from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
import os
from flask_cors import CORS
import enum


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('dbURL')
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

class sysRoleEnum(enum.Enum):
    staff = 'staff'
    hr = 'hr'
    manager = 'manager'
    inactive = 'inactive'

# staff table setup
class Staff(db.Model):
    __tablename__ = 'STAFF_DETAILS'  
    staff_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    biz_address = db.Column(db.String(255), nullable=False)
    sys_role = db.Column(db.Integer, nullable=False)

    def __init__(self, staff_id, fname, lname, dept, phone, email, biz_address, sys_role):
        self.staff_id = staff_id
        self.fname = fname
        self.lname = lname
        self.dept = dept
        self.phone = phone
        self.email = email
        self.biz_address = biz_address
        self.sys_role = sys_role

    def json(self):
        return {"staff_id": self.staff_id, "fname": self.fname, "lname": self.lname, "dept": self.dept, 
        "phone": self.phone, "email": self.email, "biz_address": self.biz_address, "sys_role": self.sys_role.name}

# get all staffs from db
@app.route("/getAllStaff")
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
@app.route("/getStaff/<string:staff_id>")
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

# create new staff redundant
@app.route("/createStaff/<string:staff_id>", methods=['POST'])
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
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)


# export dbURL=mysql+mysqlconnector://root:root@localhost:3306/staff