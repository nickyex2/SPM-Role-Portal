from flask import jsonify, request
from . import staff
from api import db
import enum

# Staff Class Definition
class sysRoleEnum(enum.Enum):
    staff = 'staff'
    hr = 'hr'
    manager = 'manager'
    inactive = 'inactive'

class Staff(db.Model):
    __tablename__ = 'STAFF_DETAILS'  
    staff_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    biz_address = db.Column(db.String(255), nullable=False)
    sys_role = db.Column(db.Enum(sysRoleEnum), nullable=False)

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

# Staff RO Class Definition
class StaffReportingOfficer(db.Model):
    __tablename__ = 'STAFF_REPORTING_OFFICER'
    staff_id = db.Column(db.Integer, primary_key=True)
    RO_id = db.Column(db.Integer)

    def __init__(self, staff_id, RO_id):
        self.staff_id = staff_id
        self.RO_id = RO_id

    def json(self):
        return {
            "staff_id": self.staff_id,
            "RO_id": self.RO_id
        }

# Create a new StaffReportingOfficer
@staff.route("/staffRO/create", methods=["POST"])
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

@staff.route("/staffRO/getOne/<int:staff_id>")
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
@staff.route("/staffRO/getAll")
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
# @staff.route("/staffRO/getStaffReportingOfficer/<int:staff_id>/<int:RO_id>")
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
# @staff.route("/staffRO/deleteStaffReportingOfficer/<int:staff_id>/<int:RO_id>", methods=["DELETE"])
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

# Staff Role Class Definition
class StaffRole(db.Model):
    __tablename__ = 'STAFF_ROLES'
    staff_id = db.Column(db.Integer, primary_key=True)
    staff_role = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.Enum('primary', 'secondary'), nullable=False)
    sr_status = db.Column(db.Enum('active', 'inactive'), nullable=False)

    def __init__(self, staff_id, staff_role, role_type, sr_status):
        self.staff_id = staff_id
        self.staff_role = staff_role
        self.role_type = role_type
        self.sr_status = sr_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "staff_role": self.staff_role,
            "role_type": self.role_type,
            "sr_status": self.sr_status
        }

# Create a new StaffRole
@staff.route("/staffRole/create", methods=["POST"])
def create_staff_role():
    try:
        data = request.get_json()
        staff_id = data.get("staff_id")
        staff_role = data.get("staff_role")
        role_type = data.get("role_type")
        sr_status = data.get("sr_status")

        staff_role = StaffRole(
            staff_id=staff_id,
            staff_role=staff_role,
            role_type=role_type,
            sr_status=sr_status
        )

        db.session.add(staff_role)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "StaffRole created successfully.",
            "data": staff_role.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create StaffRole. Error: {str(e)}"
            }
        ), 400

# Get all StaffRoles
@staff.route("/staffRole/getAll")
def get_all_staff_roles():
    staff_roles = StaffRole.query.all()
    if staff_roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_roles": [staff_role.json() for staff_role in staff_roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No staff roles in the database."
        }
    ), 404

# Get a specific StaffRole by staff_id and staff_role
@staff.route("/staffRole/getOne/<int:staff_id>/<int:staff_role>")
def get_staff_role(staff_id, staff_role):
    staff_role = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
    if staff_role:
        return jsonify(
            {
                "code": 200,
                "data": staff_role.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found."
        }
    ), 404

# Update a specific StaffRole by staff_id and staff_role
@staff.route("/staffRole/updateOne/<int:staff_id>/<int:staff_role>", methods=["PUT"])
def update_staff_role(staff_id, staff_role):
    try:
        data = request.get_json()
        role_type = data.get("role_type")
        sr_status = data.get("sr_status")

        staff_role_obj = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
        if staff_role_obj:
            staff_role_obj.role_type = role_type
            staff_role_obj.sr_status = sr_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} updated successfully.",
                "data": staff_role_obj.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update StaffRole with staff_id {staff_id} and staff_role {staff_role}. Error: {str(e)}"
            }
        ), 400
    
@staff.route("/staffRole/getByStaff/<int:staff_id>")
def get_all_staff_roles_by_staff(staff_id):
    staff_roles = StaffRole.query.filter_by(staff_id=staff_id).all()
    if staff_roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "staff_roles": [staff_role.json() for staff_role in staff_roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No staff roles found for staff with ID {staff_id}."
        }
    ), 404

# # Delete a specific StaffRole by staff_id and staff_role
# @staff.route("/staffRole/deleteStaffRole/<int:staff_id>/<int:staff_role>", methods=["DELETE"])
# def delete_staff_role(staff_id, staff_role):
#     try:
#         staff_role_obj = StaffRole.query.filter_by(staff_id=staff_id, staff_role=staff_role).first()
#         if staff_role_obj:
#             db.session.delete(staff_role_obj)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"StaffRole with staff_id {staff_id} and staff_role {staff_role} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete StaffRole with staff_id {staff_id} and staff_role {staff_role}. Error: {str(e)}"
#             }
#         ), 400

# Staff Skills Class Definition
class statusEnum(enum.Enum):
    active = "active"
    unverified = "unverified"
    in_progress = "in progress"

class StaffSkills(db.Model):
    __tablename__ = 'STAFF_SKILLS'
    staff_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)
    ss_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, staff_id, skill_id, ss_status):
        self.staff_id = staff_id
        self.skill_id = skill_id
        self.ss_status = ss_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "skill_id": self.skill_id,
            "ss_status": self.ss_status.name
        }

@staff.route("/staffSkills/create", methods=["POST"])
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
    
# Get all StaffSkills
@staff.route("/staffSkills/getAll")
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

# Get StaffSkills for a specific staff_id
@staff.route("/staffSkills/getByStaff/<int:staff_id>")
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
@staff.route("/staffSkills/updateByStaffSkill/<int:staff_id>/<int:skill_id>", methods=["PUT"])
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
    
@staff.route("/staffSkills/getBySkill/<int:skill_id>")
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
    
@staff.route("/staffSkills/getMulti", methods=["POST"])
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
# @staff.route("/staffSkills/delete/<int:staff_id>/<int:skill_id>", methods=["DELETE"])
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