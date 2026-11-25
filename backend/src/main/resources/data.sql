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
VALUES (1, 'admin@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Campus Super Admin', 'Central Administration', TRUE);

-- 2. Space Admin
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (2, 'spaces@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Prof. Rajesh Verma', 'Estate & Facilities Management', TRUE);

-- 3. Event Admin
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (3, 'events@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Dr. Meera Nambiar', 'Student Affairs & Cultural Affairs', TRUE);

-- 4. Faculty Member
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (4, 'dr.sharma@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Dr. Vikram Sharma', 'Computer Science & AI/ML', TRUE);

-- 5. Student & Club Coordinator (Multi-Role User)
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (5, 'rhythm.coordinator@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Rhythm Singhal', 'Computer Science (Semester V)', TRUE);

-- 6. Student
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (6, 'ananya.student@atlasuniversity.edu.in', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Ananya Sharma', 'Computer Science (Semester V)', TRUE);

-- 7. ATLAS SkillTech Admin (For single-password Admin Login & Portal Access)
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (7, 'admin@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Prof. Rajesh Verma', 'Estate & Space Operations', TRUE);

-- 8. ATLAS SkillTech Verified Student
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (8, 'ananya.student@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Ananya Sharma', 'Computer Science (Semester V)', TRUE);

-- 8 Specified Professors
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (11, 'nimesh.bumb@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Nimesh Bumb', 'Computer Science & AI/ML', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (12, 'yogesh.jadhav@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Yogesh Jadhav', 'Computer Science & Systems', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (13, 'kunal.meher@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Kunal Meher', 'Computer Science & Data', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (14, 'rabindra.henry@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Rabindra Henry', 'Computer Science & Networking', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (15, 'lipika.majumdar@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Lipika Majumdar', 'AI & Data Science', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (16, 'mayank.srivastava@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Mayank Srivastava', 'AI & Computational Systems', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (17, 'maria.acharya@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Maria Acharya', 'Human-Computer Interaction & Design', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (18, 'amrita.banerjee@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Amrita Banerjee', 'Cloud Computing & AI', TRUE);

-- 2 Specified Club Coordinators
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (19, 'kunal.ramchandani@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Kunal Ramchandani', 'INC - The corporate club', TRUE);
MERGE INTO users (id, email, password_hash, full_name, department, is_active) KEY(email)
VALUES (20, 'aaren@atlasskilltech.university', '$2a$10$FAYQtkpWS7DrYwdMaKk/4uvSOlXXh7KD8F6FBLcGuSxCKmeTLuwFi', 'Aaren', 'Highflyers', TRUE);

-- Assign User Roles
-- Faculty (2) for 11..18
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (11, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (12, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (13, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (14, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (15, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (16, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (17, 2);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (18, 2);

-- Club Coordinators (1, 3)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (19, 1);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (19, 3);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (20, 1);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (20, 3);

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

-- ATLAS SkillTech Admin (7): SUPER_ADMIN (6), SPACE_ADMIN (4), EVENT_ADMIN (5)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (7, 6);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (7, 4);
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (7, 5);

-- ATLAS SkillTech Student (8): STUDENT (1)
MERGE INTO user_roles (user_id, role_id) KEY(user_id, role_id) VALUES (8, 1);

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

-- Assign Prof. Nimesh Bumb to teach CS501 Section A
MERGE INTO faculty_assignments (id, course_offering_id, faculty_id) KEY(course_offering_id, faculty_id)
VALUES (1, 1, 11);

