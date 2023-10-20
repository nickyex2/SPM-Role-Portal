import enum
from api import db

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"
    
class Role(db.Model):
    __tablename__ = 'ROLE_DETAILS'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(50), nullable=False)
    role_description = db.Column(db.String(10000), nullable=False)
    role_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, role_name, role_description, role_status):
        self.role_name = role_name
        self.role_description = role_description
        self.role_status = role_status

    def json(self):
        return {
            "role_id": self.role_id,
            "role_name": self.role_name,
            "role_description": self.role_description,
            "role_status": self.role_status.name
        }