-- CampusOne Unified Schema (v1.1)

-- 1. Identity & Role-Based Access Control
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(60) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 2. Academic Catalog & Faculty Connect Foundation
CREATE TABLE IF NOT EXISTS academic_terms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    term_name VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(100) NOT NULL,
    department VARCHAR(60) NOT NULL,
    credits INT NOT NULL DEFAULT 4
);

CREATE TABLE IF NOT EXISTS course_offerings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    academic_term_id BIGINT NOT NULL,
    section VARCHAR(10) NOT NULL,
    max_seats INT NOT NULL DEFAULT 60,
    CONSTRAINT fk_co_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_co_term FOREIGN KEY (academic_term_id) REFERENCES academic_terms(id) ON DELETE CASCADE,
    CONSTRAINT uq_course_term_section UNIQUE (course_id, academic_term_id, section)
);

CREATE TABLE IF NOT EXISTS faculty_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_offering_id BIGINT NOT NULL,
    faculty_id BIGINT NOT NULL,
    CONSTRAINT fk_fa_offering FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
    CONSTRAINT fk_fa_faculty FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_offering_faculty UNIQUE (course_offering_id, faculty_id)
);

CREATE TABLE IF NOT EXISTS student_course_selections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_offering_id BIGINT NOT NULL,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ENROLLED',
    CONSTRAINT fk_scs_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_scs_offering FOREIGN KEY (course_offering_id) REFERENCES course_offerings(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_offering UNIQUE (student_id, course_offering_id)
);

-- 3. Campus Spaces & Timetable Inventory
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    floor INT NOT NULL,
    capacity INT NOT NULL,
    room_type VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
    is_accessible BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS room_equipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    equipment_code VARCHAR(50) NOT NULL,
    is_functional BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_re_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT uq_room_equipment UNIQUE (room_id, equipment_code)
);

CREATE TABLE IF NOT EXISTS time_slots (
    id INT PRIMARY KEY,
    slot_number INT NOT NULL UNIQUE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS class_timetable (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    slot_id INT NOT NULL,
    course_code VARCHAR(30) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    faculty_id BIGINT,
    section VARCHAR(20) NOT NULL,
    effective_start_date DATE NOT NULL,
    effective_end_date DATE NOT NULL,
    import_batch_id VARCHAR(64) NOT NULL,
    CONSTRAINT fk_ct_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_ct_slot FOREIGN KEY (slot_id) REFERENCES time_slots(id)
);

CREATE TABLE IF NOT EXISTS room_blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    block_date DATE NOT NULL,
    slot_id INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_by BIGINT NOT NULL,
    CONSTRAINT fk_rb_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_rb_slot FOREIGN KEY (slot_id) REFERENCES time_slots(id),
    CONSTRAINT fk_rb_user FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT uq_room_block UNIQUE (room_id, block_date, slot_id)
);

CREATE TABLE IF NOT EXISTS booking_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    request_type VARCHAR(25) NOT NULL,
    requested_room_id BIGINT,
    allocated_room_id BIGINT,
    booking_date DATE NOT NULL,
    expected_attendees INT NOT NULL,
    preferred_room_type VARCHAR(30),
    required_equipment VARCHAR(255),
    title VARCHAR(120) NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(30) NOT NULL,
    conflict_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_br_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_br_req_room FOREIGN KEY (requested_room_id) REFERENCES rooms(id),
    CONSTRAINT fk_br_alloc_room FOREIGN KEY (allocated_room_id) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS booking_request_slots (
    request_id BIGINT NOT NULL,
    slot_id INT NOT NULL,
    PRIMARY KEY (request_id, slot_id),
    CONSTRAINT fk_brs_req FOREIGN KEY (request_id) REFERENCES booking_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_brs_slot FOREIGN KEY (slot_id) REFERENCES time_slots(id)
);

CREATE TABLE IF NOT EXISTS room_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL UNIQUE,
    room_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    approved_by BIGINT NOT NULL,
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bk_req FOREIGN KEY (request_id) REFERENCES booking_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_bk_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_bk_admin FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Multi-Slot Normalized Reservation with Strict Unique Constraint
CREATE TABLE IF NOT EXISTS room_booking_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    slot_id INT NOT NULL,
    CONSTRAINT fk_rbs_booking FOREIGN KEY (booking_id) REFERENCES room_bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_rbs_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT fk_rbs_slot FOREIGN KEY (slot_id) REFERENCES time_slots(id),
    CONSTRAINT uq_room_date_slot UNIQUE (room_id, booking_date, slot_id)
);

-- 4. Clubs & Events Module
CREATE TABLE IF NOT EXISTS clubs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    faculty_coordinator_id BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_club_faculty FOREIGN KEY (faculty_coordinator_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS club_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    club_role VARCHAR(30) NOT NULL,
    CONSTRAINT fk_cm_club FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    CONSTRAINT fk_cm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_club_user UNIQUE (club_id, user_id)
);

CREATE TABLE IF NOT EXISTS event_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    club_id BIGINT NOT NULL,
    submitted_by BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    expected_attendance INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    booking_request_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_er_club FOREIGN KEY (club_id) REFERENCES clubs(id),
    CONSTRAINT fk_er_user FOREIGN KEY (submitted_by) REFERENCES users(id),
    CONSTRAINT fk_er_br FOREIGN KEY (booking_request_id) REFERENCES booking_requests(id)
);

CREATE TABLE IF NOT EXISTS event_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_request_id BIGINT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ed_event FOREIGN KEY (event_request_id) REFERENCES event_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS event_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_request_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    stage VARCHAR(30) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    comments TEXT,
    reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evr_event FOREIGN KEY (event_request_id) REFERENCES event_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_evr_user FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- 5. Faculty Consultation & Appointments
CREATE TABLE IF NOT EXISTS faculty_consultation_slots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    slot_id INT NOT NULL,
    room_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_fcs_faculty FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fcs_slot FOREIGN KEY (slot_id) REFERENCES time_slots(id),
    CONSTRAINT fk_fcs_room FOREIGN KEY (room_id) REFERENCES rooms(id),
    CONSTRAINT uq_faculty_day_slot UNIQUE (faculty_id, day_of_week, slot_id)
);

CREATE TABLE IF NOT EXISTS faculty_appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    faculty_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    slot_id INT NOT NULL,
    topic VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fa_student FOREIGN KEY (student_id) REFERENCES users(id),
    CONSTRAINT fk_fa_teacher FOREIGN KEY (faculty_id) REFERENCES users(id),
    CONSTRAINT fk_fa_aslot FOREIGN KEY (slot_id) REFERENCES time_slots(id),
    CONSTRAINT uq_faculty_date_slot UNIQUE (faculty_id, appointment_date, slot_id)
);
