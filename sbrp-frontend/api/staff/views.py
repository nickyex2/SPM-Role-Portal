from flask import jsonify, request
from . import staff
from .models import Staff
from api import db


@staff.route("/getAll")
def get_all():
    staffProfile = Staff.query.all()
    try:
        if staffProfile:
            return jsonify(
                {
                    "code": 200,
                    "data": {
                        "staffs": [staff.json() for staff in staffProfile]
                    }
                }
            )
    except:
        return jsonify(
            {
                "code": 500,
                "message": "Oops. Something went wrong in the database."
            }
        ), 404
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No staff in the staff database."
        }
    ), 404

    # get staff by id


@staff.route("/getOne/<string:staff_id>")
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


@staff.route("/getMulti", methods=['POST'])
def get_multiple_staff():
    staff_id_list = request.get_json(force=True)['staff_ids']
    staff = Staff.query.filter(Staff.staff_id.in_(staff_id_list)).all()
    if staff:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff": [staff.json() for staff in staff]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Staff not found."
        }
    ), 404

# create new staff redundant


@staff.route("/create/<string:staff_id>", methods=['POST'])
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
