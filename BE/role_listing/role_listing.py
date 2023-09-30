from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
import os
from flask_cors import CORS
import enum
from sqlalchemy import TIMESTAMP
import datetime
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('dbURL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"
    
class RoleListing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'
    role_listing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer, nullable=False)
    role_listing_desc = db.Column(db.String(10000), nullable=False)
    role_listing_source = db.Column(db.Integer, nullable=False)
    role_listing_open = db.Column(db.Date, nullable=False)
    role_listing_close = db.Column(db.Date, nullable=False)
    role_listing_creator = db.Column(db.Integer, nullable=False)
    role_listing_ts_create = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp())
    role_listing_status = db.Column(db.Enum(statusEnum), nullable=False)
    role_listing_updater = db.Column(db.Integer, nullable=False)
    role_listing_ts_update = db.Column(db.TIMESTAMP, nullable=False, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __init__(self, role_id, role_listing_desc, role_listing_source, role_listing_open, role_listing_close,
                 role_listing_creator, role_listing_status, role_listing_updater):
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

@app.route("/createRoleListing", methods=["POST"])
def create_role_listing():
    try:
        data = request.get_json()
        role_id = data.get("role_id")
        role_listing_desc = data.get("role_listing_desc")
        role_listing_source = data.get("role_listing_source")
        role_listing_open = data.get("role_listing_open")
        role_listing_close = data.get("role_listing_close")
        role_listing_creator = data.get("role_listing_creator")
        role_listing_status = data.get("role_listing_status")
        role_listing_updater = data.get("role_listing_updater")

        role_listing = RoleListing(
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
@app.route("/getAllRoleListings")
def get_all_role_listings():
    role_listings = RoleListing.query.all()
    if len(role_listings):
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
@app.route("/getRoleListing/<int:role_listing_id>")
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
    
# # delete a rolelisting base on role listing id
# @app.route("/deleteRoleListing/<int:role_listing_id>", methods=["DELETE"])
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
    
# Update a specific RoleListing by role_listing_id
@app.route("/updateRoleListing/<int:role_listing_id>", methods=["PUT"])
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
    
if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=os.environ.get('PORT'), debug=True)

