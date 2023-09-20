CREATE DATABASE IF NOT EXISTS SPM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE SPM;

-- DROP TABLE IF EXISTS `staff`;
-- SKILLSET TABLE
CREATE TABLE IF NOT EXISTS skillset (
skill_id int NOT NULL AUTO_INCREMENT,
skill_name varchar(300) NOT NULL,
skill_description varchar(500) NOT NULL,

PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO skillset (`skill_name`, `skill_description`) VALUES
('SQL', 'sql language'),
('Python', 'python language');

-- DROP TABLE IF EXISTS `staff`;
-- STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
staff_id int NOT NULL AUTO_INCREMENT,
staff_name varchar(300) NOT NULL,
dob DATE,
gender varchar(10) NOT NULL,
current_position varchar(100) NOT NULL,
email varchar(100) NOT NULL,
contact varchar(100) NOT NULL,
skill_id int NOT NULL,
PRIMARY KEY (staff_id),
CONSTRAINT FK_killsetStaff FOREIGN KEY (skill_id)
    REFERENCES skillset(skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO staff (`staff_name`, `dob`, `gender`,`current_position`, `email`, `contact`, `skill_id`) VALUES
('wyf', '1999-01-14', 'Female','data scientist','wyf102@gmail.com','+6512345678', '1'),
('haha', '1997-01-14', 'Male','data engineer','wyf103@gmail.com','+6512345679', '1');
COMMIT;