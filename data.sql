-- Create Student table
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    middlename VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isStudent BOOLEAN DEFAULT TRUE
);

-- Create Grade table
CREATE TABLE grade (
    id SERIAL PRIMARY KEY,
    studentId INT REFERENCES student(id),
    subject VARCHAR(255),
    score INT CHECK(score >= 0 AND score <= 100)
);

-- Create Teacher table
CREATE TABLE teacher (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    middlename VARCHAR(255),
    lastname VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isStudent BOOLEAN DEFAULT FALSE
);
