import enum
from api import db

class AppliedEnum(enum.Enum):
    applied = 'applied'
    withdrawn = 'withdrawn'

class RoleApplication(db.Model):
    __tablename__ = 'ROLE_APPLICATIONS'
    role_app_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_listing_id = db.Column(db.Integer, nullable=False)
    staff_id = db.Column(db.Integer, nullable=False)
    role_app_status = db.Column(db.Enum(AppliedEnum), nullable=False)
    role_app_ts_create = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)

    def __init__(self, role_listing_id, staff_id, role_app_status):
        self.role_listing_id = role_listing_id
        self.staff_id = staff_id
        self.role_app_status = role_app_status
    
    def json(self):
        return {
            "role_app_id": self.role_app_id,
            "role_listing_id": self.role_listing_id,
            "staff_id": self.staff_id,
            "role_app_status": self.role_app_status.name,
            "role_app_ts_create": self.role_app_ts_create
        }