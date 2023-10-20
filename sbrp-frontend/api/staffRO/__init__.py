from flask import Blueprint

staffRO = Blueprint('staffRO', __name__)

from . import views