from flask import jsonify
from . import staff
from .models import Staff


@staff.route("/getAllStaff")
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
