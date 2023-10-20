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
from .skills import skills
from .role import role

app.register_blueprint(staff, url_prefix="/api/staff")
app.register_blueprint(skills, url_prefix="/api/skills")
app.register_blueprint(role, url_prefix="/api/role")