CREATE DATABASE IF NOT EXISTS SPM DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE SPM;

-- SKILL_DETAILS TABLE
CREATE TABLE IF NOT EXISTS SKILL_DETAILS (
skill_id int NOT NULL AUTO_INCREMENT,
skill_name varchar(50) NOT NULL,
skill_status ENUM ('active', 'inactive') NOT NULL,
PRIMARY KEY (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- STAFF_DETAILS TABLE
CREATE TABLE IF NOT EXISTS STAFF_DETAILS (
staff_id int NOT NULL AUTO_INCREMENT,
fname VARCHAR(50) NOT NULL,
lname VARCHAR(50) NOT NULL,
dept VARCHAR(50) NOT NULL,
email VARCHAR(50) NOT NULL,
phone VARCHAR(20) NOT NULL,
biz_address VARCHAR(255) NOT NULL,
sys_role ENUM ('staff', 'hr', 'manager', 'inactive') NOT NULL,
PRIMARY KEY (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_DETAILS TABLE
CREATE TABLE IF NOT EXISTS ROLE_DETAILS (
role_id int NOT NULL AUTO_INCREMENT,
role_name VARCHAR(50) NOT NULL,
role_description VARCHAR(10000) NOT NULL,
role_status ENUM ('active', 'inactive') NOT NULL,
PRIMARY KEY (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- STAFF_REPORTING_OFFICER TABLE
CREATE TABLE IF NOT EXISTS STAFF_REPORTING_OFFICER (
staff_id int NOT NULL,
RO_id int NOT NULL,
PRIMARY KEY (staff_id),
FOREIGN KEY (RO_id) REFERENCES STAFF_DETAILS(staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- STAFF_ROLES TABLE
CREATE TABLE IF NOT EXISTS STAFF_ROLES (
staff_id int NOT NULL ,
staff_role int NOT NULL,
role_type ENUM ('primary', 'secondary') NOT NULL,
sr_status ENUM ('active', 'inactive') NOT NULL,
PRIMARY KEY (staff_id, staff_role),
FOREIGN KEY (staff_id) REFERENCES STAFF_DETAILS(staff_id),
FOREIGN KEY (staff_role) REFERENCES ROLE_DETAILS(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- STAFF_SKILLS TABLE
CREATE TABLE IF NOT EXISTS STAFF_SKILLS (
staff_id int NOT NULL,
skill_id int NOT NULL,
ss_status ENUM ('active', 'unverified', 'in progress') NOT NULL,
PRIMARY KEY (staff_id, skill_id),
FOREIGN KEY (staff_id) REFERENCES STAFF_DETAILS(staff_id),
FOREIGN KEY (skill_id) REFERENCES SKILL_DETAILS(skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_SKILLS TABLE
CREATE TABLE IF NOT EXISTS ROLE_SKILLS (
role_id int NOT NULL,
skill_id int NOT NULL,
PRIMARY KEY (role_id, skill_id),
FOREIGN KEY (role_id) REFERENCES ROLE_DETAILS(role_id),
FOREIGN KEY (skill_id) REFERENCES SKILL_DETAILS(skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_LISTINGS TABLE
CREATE TABLE IF NOT EXISTS ROLE_LISTINGS (
  role_listing_id int NOT NULL,
  role_id int NOT NULL,
  role_listing_desc VARCHAR(10000) NOT NULL,
  role_listing_source int NOT NULL,
  role_listing_open DATE NOT NULL,
  role_listing_close DATE NOT NULL,
  role_listing_creator int NOT NULL,
  role_listing_ts_create TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  role_listing_status ENUM ('active', 'inactive') NOT NULL,
  role_listing_updater int NOT NULL,
  role_listing_ts_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (role_listing_id),
  FOREIGN KEY (role_id) REFERENCES ROLE_DETAILS(role_id),
  FOREIGN KEY (role_listing_source) REFERENCES STAFF_DETAILS(staff_id),
  FOREIGN KEY (role_listing_creator) REFERENCES STAFF_DETAILS(staff_id),
  FOREIGN KEY (role_listing_updater) REFERENCES STAFF_DETAILS(staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS ROLE_APPLICATIONS (
  role_app_id int NOT NULL AUTO_INCREMENT,
  role_listing_id int NOT NULL,
  staff_id int NOT NULL,
  role_app_status ENUM ('applied', 'withdrawn') NOT NULL,
  PRIMARY KEY (role_app_id),
  FOREIGN KEY (role_listing_id) REFERENCES ROLE_LISTINGS(role_listing_id),
  FOREIGN KEY (staff_id) REFERENCES STAFF_DETAILS(staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_LISTING_CHANGES TABLE
CREATE TABLE IF NOT EXISTS ROLE_LISTING_CHANGES (
  change_id int NOT NULL,
  role_listing_id int NOT NULL,
  change_no int NOT NULL,
  log_time TIMESTAMP NOT NULL,
  role_listing_updater int NOT NULL,
  changed_field VARCHAR(255) NOT NULL,
  old_value VARCHAR(10000) NOT NULL,
  new_value VARCHAR(10000) NOT NULL,
  PRIMARY KEY (change_id, role_listing_id, change_no),
  FOREIGN KEY (role_listing_id) REFERENCES ROLE_LISTINGS(role_listing_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ROLE_LISTING_TABLE TRIGGER
DELIMITER //
CREATE TRIGGER role_listing_change_trigger AFTER UPDATE ON ROLE_LISTINGS FOR EACH ROW
BEGIN
  DECLARE change_no INT;
  DECLARE change_id INT;
  DECLARE log_time TIMESTAMP;
  SET change_id = RAND() * 100000000;
  SET change_no = 1;
  SET log_time = CURRENT_TIMESTAMP;
  IF NEW.role_listing_desc != OLD.role_listing_desc THEN
    INSERT INTO ROLE_LISTING_CHANGES (change_id, role_listing_id, change_no, log_time, role_listing_updater, changed_field, old_value, new_value)
    VALUES (change_id, NEW.role_listing_id, change_no, log_time, NEW.role_listing_updater, 'role_listing_desc', OLD.role_listing_desc, NEW.role_listing_desc);
    SET change_no = change_no + 1;
  END IF;
  IF NEW.role_listing_open != OLD.role_listing_open THEN
    INSERT INTO ROLE_LISTING_CHANGES (change_id, role_listing_id, change_no, log_time, role_listing_updater, changed_field, old_value, new_value)
    VALUES (change_id, NEW.role_listing_id, change_no, log_time, NEW.role_listing_updater, 'role_listing_open', OLD.role_listing_open, NEW.role_listing_open);
    SET change_no = change_no + 1;
  END IF;
  IF NEW.role_listing_close != OLD.role_listing_close THEN
    INSERT INTO ROLE_LISTING_CHANGES (change_id, role_listing_id, change_no, log_time, role_listing_updater, changed_field, old_value, new_value)
    VALUES (change_id, NEW.role_listing_id, change_no, log_time, NEW.role_listing_updater, 'role_listing_close', OLD.role_listing_close, NEW.role_listing_close);
    SET change_no = change_no + 1;
  END IF;
  IF NEW.role_listing_status != OLD.role_listing_status THEN
    INSERT INTO ROLE_LISTING_CHANGES (change_id, role_listing_id, change_no, log_time, role_listing_updater, changed_field, old_value, new_value)
    VALUES (change_id, NEW.role_listing_id, change_no, log_time, NEW.role_listing_updater, 'role_listing_status', OLD.role_listing_status, NEW.role_listing_status);
    SET change_no = change_no + 1;
  END IF;
END//
DELIMITER ;

COMMIT;