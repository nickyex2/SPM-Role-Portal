from flask import jsonify, request
from . import role
from api import db
import enum

# Role Class definition
class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"
    
class Role(db.Model):
    __tablename__ = 'ROLE_DETAILS'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(50), nullable=False)
    role_description = db.Column(db.String(10000), nullable=False)
    role_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, role_name, role_description, role_status):
        self.role_name = role_name
        self.role_description = role_description
        self.role_status = role_status

    def json(self):
        return {
            "role_id": self.role_id,
            "role_name": self.role_name,
            "role_description": self.role_description,
            "role_status": self.role_status.name
        }
# Get all Roles
@role.route("/getAll")
def get_all_roles():
    roles = Role.query.all()
    if roles:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "roles": [role.json() for role in roles]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No roles in the database."
        }
    ), 404

# Get a specific Role by role_id
@role.route("/getOne/<int:role_id>")
def get_role(role_id):
    role = Role.query.get(role_id)
    if role:
        return jsonify(
            {
                "code": 200,
                "data": role.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"Role with ID {role_id} not found."
        }
    ), 404

@role.route("/getMulti", methods=["POST"])
def get_roles():
    data = request.get_json()
    role_ids = data['role_ids']
    roles = Role.query.filter(Role.role_id.in_(role_ids)).all()
    if roles:
        return jsonify(
            {
                "code": 200,
                "data": [role.json() for role in roles]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"Roles with IDs {role_ids} not found."
        }
    ), 404

# Update a specific Role by role_id
@role.route("/update/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    try:
        data = request.get_json()
        role = Role.query.get(role_id)
        if role:
            role.role_name = data.get("role_name", role.role_name)
            role.role_description = data.get("role_description", role.role_description)
            role.role_status = data.get("role_status", role.role_status)
            db.session.commit()
            return jsonify(
                {
                    "code": 200,
                    "message": f"Role with ID {role_id} updated successfully.",
                    "data": role.json()
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"Role with ID {role_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update Role with ID {role_id}. Error: {str(e)}"
            }
        ), 400

# Create a new Role
@role.route("/create", methods=["POST"])
def create_role():
    try:
        data = request.get_json()
        role = Role(
            role_name=data["role_name"],
            role_description=data["role_description"],
            role_status=data["role_status"]
        )
        db.session.add(role)
        db.session.commit()
        return jsonify(
            {
                "code": 201,
                "message": "Role created successfully.",
                "data": role.json()
            }
        ), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create Role. Error: {str(e)}"
            }
        ), 400

# # Delete a specific Role by role_id
# @role.route("/deleteRole/<int:role_id>", methods=["DELETE"])
# def delete_role(role_id):
#     try:
#         role = Role.query.get(role_id)
#         if role:
#             db.session.delete(role)
#             db.session.commit()
#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"Role with ID {role_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"Role with ID {role_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete Role with ID {role_id}. Error: {str(e)}"
#             }
#         ), 400

# Role Application Class definition
class AppliedEnum(enum.Enum):
    applied = 'applied'
    withdrawn = 'withdrawn'

class RoleApplication(db.Model):
    __tablename__ = 'ROLE_APPLICATIONS'
    role_app_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_listing_id = db.Column(db.Integer, nullable=False)
    staff_id = db.Column(db.Integer, nullable=False)
    role_app_status = db.Column(db.Enum(AppliedEnum), nullable=False)
    role_app_ts_create = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)

    def __init__(self, role_listing_id, staff_id, role_app_status):
        self.role_listing_id = role_listing_id
        self.staff_id = staff_id
        self.role_app_status = role_app_status
    
    def json(self):
        return {
            "role_app_id": self.role_app_id,
            "role_listing_id": self.role_listing_id,
            "staff_id": self.staff_id,
            "role_app_status": self.role_app_status.name,
            "role_app_ts_create": self.role_app_ts_create
        }

# Create a new RoleApplication
@role.route("/roleapp/create", methods=["POST"])
def create_role_application():
    try:
        data = request.get_json()
        role_listing_id = data.get("role_listing_id")
        staff_id = data.get("staff_id")
        role_app_status = data.get("role_app_status")

        role_application = RoleApplication(
            role_listing_id=role_listing_id,
            staff_id=staff_id,
            role_app_status=role_app_status
        )

        db.session.add(role_application)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "RoleApplication created successfully.",
            "data": role_application.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create RoleApplication. Error: {str(e)}"
            }
        ), 400

# Get all RoleApplications
@role.route("/roleapp/getAll")
def get_all_role_applications():
    role_applications = RoleApplication.query.all()
    if role_applications:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_applications": [role_app.json() for role_app in role_applications]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No role applications in the database."
        }
    ), 404

# Get RoleApplication by role_listing_id
@role.route("/roleapp/getOne/<int:role_listing_id>")
def get_role_application(role_listing_id):
    role_application = RoleApplication.query.filter_by(role_listing_id=role_listing_id).all()
    if role_application:
        return jsonify(
            {
                "code": 200,
                "data": [role_app.json() for role_app in role_application]
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with {role_listing_id} not found."
        }
    ), 404

@role.route("/roleapp/getByStaff/<int:staff_id>")
def get_applications_staff(staff_id):
    role_applications = RoleApplication.query.filter_by(staff_id=staff_id)
    if role_applications:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_applications": [role_app.json() for role_app in role_applications]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with staff ID {staff_id} not found."
        }
    ), 404

# get role application by role_listing_id and staff_id
@role.route("/roleapp/getByRoleLStaff/<int:role_listing_id>/<int:staff_id>")
def get_applications_staff_role(role_listing_id, staff_id):
    role_application = RoleApplication.query.filter_by(role_listing_id=role_listing_id, staff_id=staff_id).first()
    if role_application:
        return jsonify(
            {
                "code": 200,
                "data": role_application.json() 
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleApplication with role_listing_id {role_listing_id} and staff ID {staff_id} not found."
        }
    ), 404

# Update a specific RoleApplication by role_app_id
@role.route("/roleapp/update/<int:role_app_id>", methods=["PUT"])
def update_role_application(role_app_id):
    try:
        data = request.get_json()
        role_app_status = data.get("role_app_status")

        role_application = RoleApplication.query.get(role_app_id)
        if role_application:
            role_application.role_app_status = role_app_status
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"RoleApplication with ID {role_app_id} updated successfully.",
                "data": role_application.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"RoleApplication with ID {role_app_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update RoleApplication with ID {role_app_id}. Error: {str(e)}"
            }
        ), 400

# # Delete a specific RoleApplication by role_app_id
# @role.route("/roleapp/delete/<int:role_app_id>", methods=["DELETE"])
# def delete_role_application(role_app_id):
#     try:
#         role_application = RoleApplication.query.get(role_app_id)
#         if role_application:
#             db.session.delete(role_application)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"RoleApplication with ID {role_app_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"RoleApplication with ID {role_app_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete RoleApplication with ID {role_app_id}. Error: {str(e)}"
#             }
#         ), 400

# Role Listing Class definition
class RoleListing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'
    role_listing_id = db.Column(
        db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, nullable=False)
    role_listing_desc = db.Column(db.String(10000), nullable=False)
    role_listing_source = db.Column(db.Integer, nullable=False)
    role_listing_open = db.Column(db.Date, nullable=False)
    role_listing_close = db.Column(db.Date, nullable=False)
    role_listing_creator = db.Column(db.Integer, nullable=False)
    role_listing_ts_create = db.Column(
        db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp())
    role_listing_status = db.Column(db.Enum(statusEnum), nullable=False)
    role_listing_updater = db.Column(db.Integer, nullable=False)
    role_listing_ts_update = db.Column(
        db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __init__(self, role_listing_id, role_id, role_listing_desc, role_listing_source, role_listing_open, role_listing_close, role_listing_creator, role_listing_status, role_listing_updater):
        self.role_listing_id = role_listing_id
        self.role_id = role_id
        self.role_listing_desc = role_listing_desc
        self.role_listing_source = role_listing_source
        self.role_listing_open = role_listing_open
        self.role_listing_close = role_listing_close
        self.role_listing_creator = role_listing_creator
        self.role_listing_status = role_listing_status
        self.role_listing_updater = role_listing_updater

    def json(self):
        return {
            "role_listing_id": self.role_listing_id,
            "role_id": self.role_id,
            "role_listing_desc": self.role_listing_desc,
            "role_listing_source": self.role_listing_source,
            "role_listing_open": self.role_listing_open.isoformat(),
            "role_listing_close": self.role_listing_close.isoformat(),
            "role_listing_creator": self.role_listing_creator,
            "role_listing_ts_create": self.role_listing_ts_create.isoformat(),
            "role_listing_status": self.role_listing_status.name,
            "role_listing_updater": self.role_listing_updater,
            "role_listing_ts_update": self.role_listing_ts_update.isoformat()
        }

class RoleListingChanges(db.Model):
    __tablename__ = 'ROLE_LISTING_CHANGES'
    change_id = db.Column(db.Integer, primary_key=True)
    role_listing_id = db.Column(db.Integer, nullable=False, primary_key=True)
    change_no = db.Column(db.Integer, nullable=False, primary_key=True)
    log_time = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp())
    role_listing_updater = db.Column(db.Integer, nullable=False)
    changed_field = db.Column(db.String(255), nullable=False)
    old_value = db.Column(db.String(10000), nullable=False)
    new_value = db.Column(db.String(10000), nullable=False)

    def __init__(self, role_listing_id, change_no, role_listing_updater, changed_field, old_value, new_value):
        self.role_listing_id = role_listing_id
        self.change_no = change_no
        self.role_listing_updater = role_listing_updater
        self.changed_field = changed_field
        self.old_value = old_value
        self.new_value = new_value

    def json(self):
        return {
            "role_listing_id": self.role_listing_id,
            "change_no": self.change_no,
            "log_time": self.log_time.isoformat(),
            "role_listing_updater": self.role_listing_updater,
            "changed_field": self.changed_field,
            "old_value": self.old_value,
            "new_value": self.new_value
        }

@role.route("/roleListing/create", methods=["POST"])
def create_role_listing():
    try:
        data = request.get_json()
        role_listing_id = data.get("role_listing_id")
        role_id = data.get("role_id")
        role_listing_desc = data.get("role_listing_desc")
        role_listing_source = data.get("role_listing_source")
        role_listing_open = data.get("role_listing_open")
        role_listing_close = data.get("role_listing_close")
        role_listing_creator = data.get("role_listing_creator")
        role_listing_status = data.get("role_listing_status")
        role_listing_updater = data.get("role_listing_updater")

        role_listing = RoleListing(
            role_listing_id=role_listing_id,
            role_id=role_id,
            role_listing_desc=role_listing_desc,
            role_listing_source=role_listing_source,
            role_listing_open=role_listing_open,
            role_listing_close=role_listing_close,
            role_listing_creator=role_listing_creator,
            role_listing_status=role_listing_status,
            role_listing_updater=role_listing_updater
        )

        db.session.add(role_listing)
        db.session.commit()

        response_data = {
            "code": 201,
            "message": "RoleListing created successfully.",
            "data": role_listing.json()
        }

        return jsonify(response_data), 201
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create RoleListing. Error: {str(e)}"
            }
        ), 400

# Get all RoleListings
@role.route("/roleListing/getAll")
def get_all_role_listings():
    role_listings = RoleListing.query.all()
    if role_listings:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_listings": [role_listing.json() for role_listing in role_listings]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No role listings in the database."
        }
    ), 404

# Get a specific RoleListing by role_listing_id
@role.route("/roleListing/getOne/<int:role_listing_id>")
def get_role_listing(role_listing_id):
    role_listing = RoleListing.query.get(role_listing_id)
    if role_listing:
        return jsonify(
            {
                "code": 200,
                "data": role_listing.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"RoleListing with ID {role_listing_id} not found."
        }
    ), 404

# Update a specific RoleListing by role_listing_id
@role.route("/roleListing/update/<int:role_listing_id>", methods=["PUT"])
def update_role_listing(role_listing_id):
    try:
        data = request.get_json()
        role_listing_desc = data.get("role_listing_desc")
        role_listing_open = data.get("role_listing_open")
        role_listing_close = data.get("role_listing_close")
        role_listing_status = data.get("role_listing_status")
        role_listing_updater = data.get("role_listing_updater")

        role_listing = RoleListing.query.get(role_listing_id)
        if role_listing:
            role_listing.role_listing_desc = role_listing_desc
            role_listing.role_listing_open = role_listing_open
            role_listing.role_listing_close = role_listing_close
            role_listing.role_listing_status = role_listing_status
            role_listing.role_listing_updater = role_listing_updater
            db.session.commit()

            response_data = {
                "code": 200,
                "message": f"RoleListing with ID {role_listing_id} updated successfully.",
                "data": role_listing.json()
            }

            return jsonify(response_data), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"RoleListing with ID {role_listing_id} not found. Nothing updated."
                }
            ), 404
    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update RoleListing with ID {role_listing_id}. Error: {str(e)}"
            }
        ), 400

@role.route("/roleListing/getChanges/<int:role_listing_id>")
def getRoleListingChanges(role_listing_id):
    role_listing_changes = RoleListingChanges.query.filter_by(role_listing_id=role_listing_id).all()
    if role_listing_changes:
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_listing_changes": [role_listing_change.json() for role_listing_change in role_listing_changes]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": f"No changes for role listing with ID {role_listing_id} found."
        }
    ), 404

# # delete a rolelisting base on role listing id
# @role.route("/roleListing/delete/<int:role_listing_id>", methods=["DELETE"])
# def delete_role_listing(role_listing_id):
#     try:
#         role_listing = RoleListing.query.get(role_listing_id)
#         if role_listing:
#             db.session.delete(role_listing)
#             db.session.commit()

#             return jsonify(
#                 {
#                     "code": 200,
#                     "message": f"RoleListing with ID {role_listing_id} deleted successfully."
#                 }
#             ), 200
#         else:
#             return jsonify(
#                 {
#                     "code": 404,
#                     "message": f"RoleListing with ID {role_listing_id} not found. Nothing deleted."
#                 }
#             ), 404
#     except Exception as e:
#         return jsonify(
#             {
#                 "code": 400,
#                 "message": f"Failed to delete RoleListing with ID {role_listing_id}. Error: {str(e)}"
#             }
#         ), 400

# Role Skills Class definition
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

# Create a new RoleSkills association
@role.route("/roleSkills/create", methods=["POST"])
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
@role.route("/roleSkills/getAll")
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
@role.route("/roleSkills/getByRole/<int:role_id>")
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

@role.route("/roleSkills/getMultiRole", methods=["POST"])
def get_specific_role_skills():
    try:
        data = request.get_json()
        role_ids = data.get("role_ids")
        role_skills = RoleSkills.query.filter(RoleSkills.role_id.in_(role_ids)).all()
        returnDict = {rs: [] for rs in role_ids}
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
# @role.route("/roleSkills/deleteRoleSkills/<int:role_id>/<int:skill_id>", methods=["DELETE"])
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