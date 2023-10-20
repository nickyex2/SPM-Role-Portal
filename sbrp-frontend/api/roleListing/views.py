from flask import jsonify, request
from . import roleListing
from .models import RoleListing, RoleListingChanges
from api import db


@roleListing.route("/create", methods=["POST"])
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
@roleListing.route("/getAll")
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
@roleListing.route("/getOne/<int:role_listing_id>")
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
@roleListing.route("/update/<int:role_listing_id>", methods=["PUT"])
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

@roleListing.route("/getChanges/<int:role_listing_id>")
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
# @roleListing.route("/delete/<int:role_listing_id>", methods=["DELETE"])
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