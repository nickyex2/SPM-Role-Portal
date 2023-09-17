from flask import Flask,request, jsonify
from flask_sqlalchemy import SQLAlchemy



import os 

app = Flask(__name__)

#Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:@localhost:3306/sbirs'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False

db=SQLAlchemy(app)


#staff class
class Staff(db.Model):
    __tablename__ = 'staff'

    staff_id= db.Column(db.Integer,primary_key=True)
    staff_name = db.Column(db.String(50))
    staff_skills = db.Column(db.String(100))
    current_position = db.Column(db.String(100))

    def __init__(self,staff_id,staff_name,staff_skills,current_position):
        self.staff_id = staff_id
        self.staff_name = staff_name
        self.staff_skills = staff_skills
        self.current_position = current_position

    def json(self):
        return{"staff_id":self.staff_id , "staff_name":self.staff_name,"staff_skills":self.staff_skills,"current_postition":self.current_position}


@app.route("/staff")
def get_all():
    all_staff = Staff.query.all()
    if len(all_staff):
        return jsonify(
            {
                "code":200,
                "data":{
                    "staff":[staff.json() for staff in all_staff]
                }
            }
        )
    return jsonify(
        {
            "code":404,
            "message":"There are no staff"
        }
    )



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)