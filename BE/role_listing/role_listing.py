from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import sys
import os
from flask_cors import CORS
import enum
from sqlalchemy import TIMESTAMP
import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3306/spm'
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

class roleListingStatus(enum.Enum):
    active = "active"
    inactive = "inactive"

class Role_listing(db.Model):
    __tablename__ = 'ROLE_LISTINGS'  
    role_listing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_id = db.Column(db.Integer) #this is a secondary key
    role_listing_desc =  db.Column(db.String(10000), nullable = False)
    role_listing_source = db.Column(db.Integer,secondary_key = True) #this is a secondary key 
    role_listing_open = db.Column(db.DateTime)
    role_listing_close = db.Column(db.DateTime)
    role_listing_creator  = db.Column(db.Integer) #this is a secondary key 
    role_listing_ts_create = db.Column(TIMESTAMP)
    role_listing_status =db.Column(db.Enum(roleListingStatus),nullable = False)
    role_listing_updater = db.Column(db.Integer) #this is a secodnary key
    role_listing_ts_update = db.Column(TIMESTAMP, default=datetime.datetime.utcnow)

    def __init__(self, role_id, role_listing_desc, role_listing_source,
                 role_listing_open, role_listing_close, role_listing_creator,
                 role_listing_status, role_listing_updater):
        self.role_id = role_id
        self.role_listing_desc = role_listing_desc
        self.role_listing_source = role_listing_source
        self.role_listing_open = role_listing_open
        self.role_listing_close = role_listing_close
        self.role_listing_creator = role_listing_creator
        self.role_listing_status = role_listing_status
        self.role_listing_updater = role_listing_updater
        self.role_listing_ts_create = datetime.datetime.utcnow()


    def json(self):
        return {
            "role_listing_id": self.role_listing_id,
            "role_id": self.role_id,
            "role_listing_desc": self.role_listing_desc,
            "role_listing_source": self.role_listing_source,
            "role_listing_open": self.role_listing_open.strftime("%Y-%m-%d %H:%M:%S") if self.role_listing_open else None,
            "role_listing_close": self.role_listing_close.strftime("%Y-%m-%d %H:%M:%S") if self.role_listing_close else None,
            "role_listing_creator": self.role_listing_creator,
            "role_listing_ts_create": self.role_listing_ts_create.strftime("%Y-%m-%d %H:%M:%S") if self.role_listing_ts_create else None,
            "role_listing_status": self.role_listing_status.value,
            "role_listing_updater": self.role_listing_updater,
            "role_listing_ts_update": self.role_listing_ts_update.strftime("%Y-%m-%d %H:%M:%S") if self.role_listing_ts_update else None
        }
    
@app.route("/getAllRoleListings")
def get_all_role_listings():
    role_listings = Role_listing.query.all()
    if len(role_listings):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "role_listings": [role.json() for role in role_listings]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Oops. No role listings in the ROLE_LISTINGS database."
        }
    ), 404

@app.route("/getRoleListing/<int:role_listing_id>")
def get_role_listing(role_listing_id):
    role_listing = Role_listing.query.get(role_listing_id)
    
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
            "message": f"Role listing with ID {role_listing_id} not found."
        }
    ), 404

@app.route("/createRoleListing", methods=["POST"])
def create_role_listing():
    try:
        # Parse JSON data from the request
        data = request.get_json()

        # Create a new Role_listing instance
        new_role_listing = Role_listing(
            role_id=data["role_id"],
            role_listing_desc=data["role_listing_desc"],
            role_listing_source=data["role_listing_source"],
            role_listing_open=data["role_listing_open"],
            role_listing_close=data["role_listing_close"],
            role_listing_creator=data["role_listing_creator"],
            role_listing_status=data["role_listing_status"],
            role_listing_updater=data["role_listing_updater"]
        )

        # Add the new Role_listing to the database
        db.session.add(new_role_listing)
        db.session.commit()

        return jsonify(
            {
                "code": 201,
                "message": "Role listing created successfully.",
                "data": new_role_listing.json()
            }
        ), 201

    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to create Role listing. Error: {str(e)}"
            }
        ), 400
    
@app.route("/deleteRoleListing/<int:role_listing_id>", methods=["DELETE"])
def delete_role_listing(role_listing_id):
    try:
        # Check if the Role_listing with the specified role_listing_id exists
        role_listing = Role_listing.query.get(role_listing_id)

        if role_listing:
            # Delete the Role_listing
            db.session.delete(role_listing)
            db.session.commit()
            
            return jsonify(
                {
                    "code": 200,
                    "message": f"Role listing with ID {role_listing_id} deleted successfully."
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"Role listing with ID {role_listing_id} not found. Nothing deleted."
                }
            ), 404

    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to delete Role listing with ID {role_listing_id}. Error: {str(e)}"
            }
        ), 400

@app.route("/updateRoleListing/<int:role_listing_id>", methods=["PUT"])
def update_role_listing(role_listing_id):
    try:
        # Check if the Role_listing with the specified role_listing_id exists
        role_listing = Role_listing.query.get(role_listing_id)

        if role_listing:
            # Parse JSON data from the request
            data = request.get_json()

            # Update the Role_listing attributes
            role_listing.role_id = data.get("role_id", role_listing.role_id)
            role_listing.role_listing_desc = data.get("role_listing_desc", role_listing.role_listing_desc)
            role_listing.role_listing_source = data.get("role_listing_source", role_listing.role_listing_source)
            role_listing.role_listing_open = data.get("role_listing_open", role_listing.role_listing_open)
            role_listing.role_listing_close = data.get("role_listing_close", role_listing.role_listing_close)
            role_listing.role_listing_creator = data.get("role_listing_creator", role_listing.role_listing_creator)
            role_listing.role_listing_status = data.get("role_listing_status", role_listing.role_listing_status)
            role_listing.role_listing_updater = data.get("role_listing_updater", role_listing.role_listing_updater)

            # Commit the changes to the database
            db.session.commit()

            return jsonify(
                {
                    "code": 200,
                    "message": f"Role listing with ID {role_listing_id} updated successfully."
                }
            ), 200
        else:
            return jsonify(
                {
                    "code": 404,
                    "message": f"Role listing with ID {role_listing_id} not found. Nothing updated."
                }
            ), 404

    except Exception as e:
        return jsonify(
            {
                "code": 400,
                "message": f"Failed to update Role listing with ID {role_listing_id}. Error: {str(e)}"
            }
        ), 400
    
if __name__ == '__main__':
    # host=’0.0.0.0’ allows the service to be accessible from any other in the network 
    # and not only from your own computer
    app.run(host='0.0.0.0', port=5002, debug=True)

