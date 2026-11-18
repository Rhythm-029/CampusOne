-- Roles Seeding
MERGE INTO roles (id, name) KEY(name) VALUES (1, 'ROLE_STUDENT');
MERGE INTO roles (id, name) KEY(name) VALUES (2, 'ROLE_FACULTY');
MERGE INTO roles (id, name) KEY(name) VALUES (3, 'ROLE_CLUB_COORDINATOR');
MERGE INTO roles (id, name) KEY(name) VALUES (4, 'ROLE_SPACE_ADMIN');
MERGE INTO roles (id, name) KEY(name) VALUES (5, 'ROLE_EVENT_ADMIN');
MERGE INTO roles (id, name) KEY(name) VALUES (6, 'ROLE_SUPER_ADMIN');

-- 8 Standard Daily Academic Time Slots Seeding
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (1, 1, '08:30:00', '09:30:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (2, 2, '09:30:00', '10:30:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (3, 3, '10:45:00', '11:45:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (4, 4, '11:45:00', '12:45:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (5, 5, '13:30:00', '14:30:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (6, 6, '14:30:00', '15:30:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (7, 7, '15:45:00', '16:45:00');
MERGE INTO time_slots (id, slot_number, start_time, end_time) KEY(id) VALUES (8, 8, '16:45:00', '17:45:00');

-- Default Seed Users (BCrypt for 'Password123!')
-- 1. Super Admin
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (1, 'admin@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Campus Super Admin', 'Central Administration', TRUE);

-- 2. Space Admin
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (2, 'spaces@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Prof. Rajesh Verma', 'Estate & Facilities Management', TRUE);

-- 3. Event Admin
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (3, 'events@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Dr. Meera Nambiar', 'Student Affairs & Cultural Affairs', TRUE);

-- 4. Faculty Member
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (4, 'dr.sharma@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Dr. Vikram Sharma', 'Computer Science & AI/ML', TRUE);

-- 5. Student & Club Coordinator (Multi-Role User)
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (5, 'rhythm.coordinator@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Rhythm Singhal', 'Computer Science (Semester V)', TRUE);

-- 6. Student
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (6, 'ananya.student@atlasuniversity.edu.in', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.89L3WqCj5zN5k2K/L3pQ9K0M1R4WKu', 'Ananya Sharma', 'Computer Science (Semester V)', TRUE);

-- Assign User Roles
-- Admin has SUPER_ADMIN (6), SPACE_ADMIN (4), EVENT_ADMIN (5)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (1, 6);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (1, 4);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (1, 5);

-- Space Admin (4)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (2, 4);

-- Event Admin (5)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (3, 5);

-- Faculty (2)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (4, 2);

-- Rhythm: STUDENT (1) and CLUB_COORDINATOR (3)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (5, 1);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (5, 3);

-- Ananya: STUDENT (1)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (6, 1);

-- Seed Academic Term
MERGE INTO academic_terms (id, term_name, start_date, end_date, is_current) KEY(term_name)
VALUES (1, 'Semester V 2026-27', '2026-07-15', '2026-12-10', TRUE);

-- Seed Core Courses
MERGE INTO courses (id, course_code, course_name, department, credits) KEY(course_code)
VALUES (1, 'CS501', 'Advanced Algorithms', 'Computer Science', 4);
MERGE INTO courses (id, course_code, course_name, department, credits) KEY(course_code)
VALUES (2, 'CS502', 'Distributed Operating Systems', 'Computer Science', 4);
MERGE INTO courses (id, course_code, course_name, department, credits) KEY(course_code)
VALUES (3, 'AI503', 'Machine Learning Foundations', 'AI & Data Science', 4);

-- Seed Course Offerings & Faculty Assignment
MERGE INTO course_offerings (id, course_id, academic_term_id, section, max_seats) KEY(course_id, academic_term_id, section)
VALUES (1, 1, 1, 'Section A', 60);
MERGE INTO course_offerings (id, course_id, academic_term_id, section, max_seats) KEY(course_id, academic_term_id, section)
VALUES (2, 2, 1, 'Section A', 60);

-- Assign Dr. Vikram Sharma to teach CS501 Section A
MERGE INTO faculty_assignments (id, course_offering_id, faculty_id) KEY(course_offering_id, faculty_id)
VALUES (1, 1, 4);
