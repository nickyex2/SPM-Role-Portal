import enum
from api import db

class statusEnum(enum.Enum):
    active = "active"
    inactive = "inactive"

# skill table setup
class Skill(db.Model):
    __tablename__ = 'SKILL_DETAILS'  
    skill_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    skill_name = db.Column(db.String(300), nullable=False)
    skill_status = db.Column(db.Enum(statusEnum), nullable=False)

    def __init__(self, skill_id, skill_name, skill_status):
        self.skill_id = skill_id
        self.skill_name = skill_name
        self.skill_status = skill_status

    def json(self):
        return {"skill_id": self.skill_id, "skill_name": self.skill_name, "skill_status": self.skill_status.name}

