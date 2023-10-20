from api import db

class RoleSkills(db.Model):
    __tablename__ = 'ROLE_SKILLS'
    role_id = db.Column(db.Integer, primary_key=True)
    skill_id = db.Column(db.Integer, primary_key=True)

    def __init__(self, role_id, skill_id):
        self.role_id = role_id
        self.skill_id = skill_id

    def json(self):
        return {
            "role_id": self.role_id,
            "skill_id": self.skill_id
        }