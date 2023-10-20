from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("dbURL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# load the .env file
load_dotenv()

# @app.route("/api/python")
# def hello_world():
#     return "Hello, World!"

from .staff import staff
from .staffSkills import staffSkills
from .staffRole import staffRole
from .staffRO import staffRO
from .skills import skills
from .role import role
from .roleSkills import roleSkills
from .roleListing import roleListing
from .roleApplication import roleApplication

app.register_blueprint(staff, url_prefix="/api/staff")
app.register_blueprint(staffSkills, url_prefix="/api/staffSkills")
app.register_blueprint(staffRole, url_prefix="/api/staffRole")
app.register_blueprint(staffRO, url_prefix="/api/staffRO")
app.register_blueprint(skills, url_prefix="/api/skills")
app.register_blueprint(role, url_prefix="/api/role")
app.register_blueprint(roleSkills, url_prefix="/api/roleSkills")
app.register_blueprint(roleListing, url_prefix="/api/roleListing")
app.register_blueprint(roleApplication, url_prefix="/api/roleApplication")