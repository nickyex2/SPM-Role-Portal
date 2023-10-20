from flask import Blueprint

roleListing = Blueprint('roleListing', __name__)

from . import views