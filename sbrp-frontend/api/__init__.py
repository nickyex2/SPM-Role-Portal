from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
import os
import enum

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# load the .env file
load_dotenv()

@app.route("/api/python")
def hello_world():
    return "Hello, World!"

from .staff import staff

app.register_blueprint(staff, url_prefix="/api/staff")