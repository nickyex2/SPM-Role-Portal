CREATE DATABASE IF NOT EXISTS SPM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE SPM;

-- DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS skillset (
skill_id int NOT NULL AUTO_INCREMENT,
skill_name varchar(300) NOT NULL,
skill_description varchar(500) NOT NULL,

PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO staff (`skill_id`, `skill_name`, `skill_description`) VALUES
('SQL', 'sql language'),
('Python', 'python language');
COMMIT;