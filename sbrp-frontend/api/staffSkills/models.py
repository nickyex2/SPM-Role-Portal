import enum
from api import db

class statusEnum(enum.Enum):
    active = "active"
    unverified = "unverified"
    in_progress = "in progress"

class StaffSkills(db.Model):
    __tablename__ = 'STAFF_SKILLS'
    staff_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)
    ss_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, staff_id, skill_id, ss_status):
        self.staff_id = staff_id
        self.skill_id = skill_id
        self.ss_status = ss_status

    def json(self):
        return {
            "staff_id": self.staff_id,
            "skill_id": self.skill_id,
            "ss_status": self.ss_status.name
        }
