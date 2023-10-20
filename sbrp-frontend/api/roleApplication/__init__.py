from flask import Blueprint

roleApplication = Blueprint('roleApplication', __name__)

from . import views