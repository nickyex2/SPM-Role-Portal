from flask import Blueprint

skills = Blueprint('skills', __name__)

from . import views