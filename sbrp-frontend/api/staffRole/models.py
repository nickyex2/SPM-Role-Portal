import enum
from api import db

class StaffRole(db.Model):
    __tablename__ = 'STAFF_ROLES'
    staff_id = db.Column(db.Integer, primary_key=True)
    staff_role = db.Column(db.Integer, primary_key=True)
    role_type = db.Column(db.Enum('primary', 'secondary'), nullable=False)
    sr_status = db.Column(db.Enum('active', 'inactive'), nullable=False)

    def __init__(self, staff_id, staff_role, role_type, sr_status):
        self.staff_id = staff_id
        self.staff_role = staff_role
        self.role_type = role_type
        self.sr_status = sr_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "staff_role": self.staff_role,
            "role_type": self.role_type,
            "sr_status": self.sr_status
        }