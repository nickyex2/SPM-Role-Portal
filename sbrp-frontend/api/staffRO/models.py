from api import db

class StaffReportingOfficer(db.Model):
    __tablename__ = 'STAFF_REPORTING_OFFICER'
    staff_id = db.Column(db.Integer, primary_key=True)
    RO_id = db.Column(db.Integer)

    def __init__(self, staff_id, RO_id):
        self.staff_id = staff_id
        self.RO_id = RO_id

    def json(self):
        return {
            "staff_id": self.staff_id,
            "RO_id": self.RO_id
        }