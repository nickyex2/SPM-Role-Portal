CREATE DATABASE IF NOT EXISTS SPM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE SPM;

-- DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS staff (
staff_id int NOT NULL AUTO_INCREMENT,
staff_name varchar(300) NOT NULL,
dob DATE,
gender varchar(10) NOT NULL,
current_position varchar(100) NOT NULL,
email varchar(100) NOT NULL,
contact varchar(100) NOT NULL,
skill_id varchar(50) NOT NULL,
PRIMARY KEY (staff_id),
CONSTRAINT FK_killsetStaff FOREIGN KEY (skill_id)
    REFERENCES skillset(skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO staff (`staff_id`, `staff_name`, `dob`, `gender`,`current_position`, `email`, `contact`, `skill_id`) VALUES
('wyf', '1999-01-14', 'Female','data scientist','wyf102@gmail.com','+6512345678', '1', '2'),
('haha', '1997-01-14', 'Male','data engineer','wyf103@gmail.com','+6512345679', '1', '2');
COMMIT;