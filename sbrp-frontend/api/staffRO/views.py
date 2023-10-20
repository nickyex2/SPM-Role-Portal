from flask import jsonify, request
from . import staffRO
from .models import StaffReportingOfficer
from api import db


# Create a new StaffReportingOfficer
@staffRO.route("/create", methods=["POST"])
def create_staff_reporting_officer():
    try:
        data = request.get_json()
        staff_id = data.get("staff_id")
        RO_id = data.get("RO_id")

        staff_reporting_officer = StaffReportingOfficer(
            staff_id=staff_id,
            RO_id=RO_id
        )

        db.session.add(staff_reporting_officer)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "StaffReportingOfficer created successfully.",
            "data": staff_reporting_officer.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create StaffReportingOfficer. Error: {str(e)}"
            }
        ), 400

@staffRO.route("/getOne/<int:staff_id>")
def get_staff_reporting_officers_by_staff_id(staff_id):
    staff_reporting_officers = StaffReportingOfficer.query.filter_by(staff_id=staff_id).first()
    if staff_reporting_officers:
        return jsonify(
            {
                "code": 200,
                "data": staff_reporting_officers.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No staff reporting officers found for staff_id {staff_id}."
        }
    ), 404

# Get all StaffReportingOfficers
@staffRO.route("/getAll")
def get_all_staff_reporting_officers():
    staff_reporting_officers = StaffReportingOfficer.query.all()
    if staff_reporting_officers:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_reporting_officers": [sro.json() for sro in staff_reporting_officers]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No staff reporting officers in the database."
        }
    ), 404

# # Get a specific StaffReportingOfficer by staff_id and RO_id
# @staffRO.route("/getStaffReportingOfficer/<int:staff_id>/<int:RO_id>")
# def get_staff_reporting_officer(staff_id, RO_id):
#     staff_reporting_officer = StaffReportingOfficer.query.filter_by(
#         staff_id=staff_id, RO_id=RO_id
#     ).first()
#     if staff_reporting_officer:
#         return jsonify(
#             {
#                 "code": 200,
#                 "data": staff_reporting_officer.json()
#             }
#         )
#     return jsonify(
#         {
#             "code": 404,
#             "message": f"StaffReportingOfficer with staff_id {staff_id} and RO_id {RO_id} not found."
#         }
#     ), 404

# # Delete a specific StaffReportingOfficer by staff_id and RO_id
# @staffRO.route("/deleteStaffReportingOfficer/<int:staff_id>/<int:RO_id>", methods=["DELETE"])
# def delete_staff_reporting_officer(staff_id, RO_id):
#     try:
#         staff_reporting_officer = StaffReportingOfficer.query.filter_by(
#             staff_id=staff_id, RO_id=RO_id
#         ).first()
#         if staff_reporting_officer:
#             db.session.delete(staff_reporting_officer)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"StaffReportingOfficer with staff_id {staff_id} and RO_id {RO_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"StaffReportingOfficer with staff_id {staff_id} and RO_id {RO_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete StaffReportingOfficer with staff_id {staff_id} and RO_id {RO_id}. Error: {str(e)}"
#             }
#         ), 400