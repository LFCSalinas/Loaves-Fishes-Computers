CREATE TABLE user (
    user_id int NOT NULL AUTO_INCREMENT,
    username varchar(45) NOT NULL UNIQUE,
    password binary(60) NOT NULL UNIQUE,
    role varchar(45) DEFAULT NULL,
    token binary(20) DEFAULT NULL,
    token_expires binary(13) DEFAULT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE address (
   address_id int NOT NULL AUTO_INCREMENT,
   street varchar(30) DEFAULT NULL,
   city varchar(30) DEFAULT NULL,
   state varchar(2) DEFAULT NULL,
   PRIMARY KEY (address_id)
);

CREATE TABLE em_contact (
    em_contact_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(45) DEFAULT NULL,
    last_name varchar(45) DEFAULT NULL,
    phone varchar(20) DEFAULT NULL,
    relation varchar(45) DEFAULT NULL,
    PRIMARY KEY (em_contact_id)
);

CREATE TABLE job (
    job_id int NOT NULL AUTO_INCREMENT,
    company varchar(45) DEFAULT NULL,
    title varchar(45) DEFAULT NULL,
    years varchar(45) DEFAULT NULL,
    duties text,
    PRIMARY KEY (job_id)
);

CREATE TABLE profile (
   profile_id int NOT NULL AUTO_INCREMENT,
   image_filename varchar(45) DEFAULT NULL,
   form_filename varchar(45) DEFAULT NULL,
   motivation text,
   skills text,
   languages tinytext,
   place_of_birth tinytext,
   PRIMARY KEY (profile_id)
);

CREATE TABLE previous_work (
    previous_work_id int NOT NULL AUTO_INCREMENT,
    profile_id int NOT NULL,
    job_id int NOT NULL,
    PRIMARY KEY (previous_work_id),
    FOREIGN KEY (job_id) REFERENCES job (job_id),
    FOREIGN KEY (profile_id) REFERENCES profile (profile_id)
);

CREATE TABLE volunteer (
     volunteer_id int NOT NULL AUTO_INCREMENT,
     first_name varchar(45) DEFAULT NULL,
     last_name varchar(45) DEFAULT NULL,
     email varchar(45) NOT NULL UNIQUE,
     email_aux varchar(45) DEFAULT NULL UNIQUE,
     phone varchar(20) DEFAULT NULL,
     member_since datetime DEFAULT NULL,
     birthday date DEFAULT NULL,
     gender tinyint DEFAULT NULL,
     active tinyint(1) NOT NULL,
     em_contact_id int NOT NULL,
     address_id int NOT NULL,
     profile_id int NOT NULL,
     PRIMARY KEY (volunteer_id),
     FOREIGN KEY (address_id) REFERENCES address (address_id),
     FOREIGN KEY (em_contact_id) REFERENCES em_contact (em_contact_id),
     FOREIGN KEY (profile_id) REFERENCES profile (profile_id)
);
