import enum
from api import db

class sysRoleEnum(enum.Enum):
    staff = 'staff'
    hr = 'hr'
    manager = 'manager'
    inactive = 'inactive'

# staff table setup
class Staff(db.Model):
    __tablename__ = 'STAFF_DETAILS'  
    staff_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    dept = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    biz_address = db.Column(db.String(255), nullable=False)
    sys_role = db.Column(db.Enum(sysRoleEnum), nullable=False)

    def __init__(self, staff_id, fname, lname, dept, phone, email, biz_address, sys_role):
        self.staff_id = staff_id
        self.fname = fname
        self.lname = lname
        self.dept = dept
        self.phone = phone
        self.email = email
        self.biz_address = biz_address
        self.sys_role = sys_role

    def json(self):
        return {"staff_id": self.staff_id, "fname": self.fname, "lname": self.lname, "dept": self.dept, 
        "phone": self.phone, "email": self.email, "biz_address": self.biz_address, "sys_role": self.sys_role.name}
