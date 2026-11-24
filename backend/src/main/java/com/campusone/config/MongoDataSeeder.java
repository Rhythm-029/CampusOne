package com.campusone.config;

import com.campusone.auth.model.RoleName;
import com.campusone.lostfound.model.ItemVocabulary;
import com.campusone.lostfound.repository.ItemVocabularyRepository;
import com.campusone.lostfound.repository.LostFoundReportRepository;
import com.campusone.lostfound.service.LostFoundAutocompleteService;
import com.campusone.model.RoomDocument;
import com.campusone.model.UserDocument;
import com.campusone.repository.RoomMongoRepository;
import com.campusone.repository.UserMongoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Initializes verified ground truth data into MongoDB Atlas on startup if collections are empty.
 * Strictly adheres to requirement:
 * 1. Zero fake verified lost & found reports.
 * 2. Ground truth 74 rooms across Floors 1-6 (Floors 1, 4, 5, 6: 12 rooms cap ~60; Floors 2, 3: 12 ordinary + 1 large room 213/313 cap ~200).
 * 3. Verified university accounts.
 */
@Component
public class MongoDataSeeder implements CommandLineRunner {

    private final UserMongoRepository userRepository;
    private final RoomMongoRepository roomRepository;
    private final ItemVocabularyRepository itemVocabularyRepository;
    private final PasswordEncoder passwordEncoder;
    private final LostFoundAutocompleteService autocompleteService;

    public MongoDataSeeder(UserMongoRepository userRepository,
                           RoomMongoRepository roomRepository,
                           ItemVocabularyRepository itemVocabularyRepository,
                           PasswordEncoder passwordEncoder,
                           LostFoundAutocompleteService autocompleteService) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.itemVocabularyRepository = itemVocabularyRepository;
        this.passwordEncoder = passwordEncoder;
        this.autocompleteService = autocompleteService;
    }

    @Override
    public void run(String... args) {
        seedUsersIfEmpty();
        seedRoomsIfEmpty();
        seedItemVocabularyIfEmpty();
        autocompleteService.rebuildTrie();
    }

    private void seedUsersIfEmpty() {
        if (userRepository.count() == 0) {
            String encodedPwd = passwordEncoder.encode("Password123!");

            // 1. Master University Admin (Estate & Space Admin, Lost & Found Admin, Super Admin)
            UserDocument admin = new UserDocument(
                    "admin@atlasskilltech.university",
                    encodedPwd,
                    "Prof. Rajesh Verma",
                    "Estate & Space Operations",
                    Set.of(RoleName.ROLE_SUPER_ADMIN, RoleName.ROLE_SPACE_ADMIN, RoleName.ROLE_EVENT_ADMIN, RoleName.ROLE_LOST_FOUND_ADMIN)
            );

            // 2. Verified Student
            UserDocument student = new UserDocument(
                    "ananya.student@atlasskilltech.university",
                    encodedPwd,
                    "Ananya Sharma",
                    "Computer Science (Semester V)",
                    Set.of(RoleName.ROLE_STUDENT)
            );

            // 3. Faculty Member
            UserDocument faculty = new UserDocument(
                    "dr.sharma@atlasskilltech.university",
                    encodedPwd,
                    "Dr. Vikram Sharma",
                    "Computer Science & AI/ML",
                    Set.of(RoleName.ROLE_FACULTY)
            );

            // 4. Student & Club Coordinator
            UserDocument coordinator = new UserDocument(
                    "rhythm.coordinator@atlasskilltech.university",
                    encodedPwd,
                    "Rhythm Singhal",
                    "Computer Science (Semester V)",
                    Set.of(RoleName.ROLE_STUDENT, RoleName.ROLE_CLUB_COORDINATOR)
            );

            userRepository.saveAll(List.of(admin, student, faculty, coordinator));
            System.out.println(">>> [MongoDB Atlas] Seeded verified university users.");
        }
    }

    private void seedRoomsIfEmpty() {
        if (roomRepository.count() == 0) {
            List<RoomDocument> rooms = new ArrayList<>();

            // Floor 1: Rooms 101–112 (12 ordinary classrooms, cap 60)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("1%02d", i);
                rooms.add(new RoomDocument(num, 1, 60, "Smart Classroom", List.of("Laser Projector", "Whiteboard", "Wi-Fi 6"), true, true));
            }

            // Floor 2: Rooms 201–212 (cap 60) + Room 213 (Special Auditorium, cap 200)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("2%02d", i);
                rooms.add(new RoomDocument(num, 2, 60, "Smart Classroom", List.of("Laser Projector", "Whiteboard", "Wi-Fi 6"), true, true));
            }
            rooms.add(new RoomDocument("213", 2, 200, "Special Auditorium", List.of("Dual Laser Projectors", "PA Audio System", "Stage Mic", "Tiered Seating"), true, true));

            // Floor 3: Rooms 301–312 (cap 60) + Room 313 (Special Auditorium, cap 200)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("3%02d", i);
                rooms.add(new RoomDocument(num, 3, 60, "Smart Classroom", List.of("Laser Projector", "Whiteboard", "Wi-Fi 6"), true, true));
            }
            rooms.add(new RoomDocument("313", 3, 200, "Special Auditorium", List.of("Dual Laser Projectors", "PA Audio System", "Stage Mic", "Tiered Seating"), true, true));

            // Floor 4: Rooms 401–412 (12 ordinary classrooms, cap 60)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("4%02d", i);
                rooms.add(new RoomDocument(num, 4, 60, "Smart Classroom", List.of("Laser Projector", "Whiteboard", "Wi-Fi 6"), true, true));
            }

            // Floor 5: Rooms 501–512 (12 ordinary classrooms, cap 60)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("5%02d", i);
                rooms.add(new RoomDocument(num, 5, 60, "Discussion & Seminar Room", List.of("Display Screen", "Whiteboard", "Wi-Fi 6"), true, true));
            }

            // Floor 6: Rooms 601–612 (12 ordinary classrooms, cap 60)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("6%02d", i);
                rooms.add(new RoomDocument(num, 6, 60, "Innovation Lab & Studio", List.of("Workstations", "Interactive Board", "Wi-Fi 6"), true, true));
            }

            roomRepository.saveAll(rooms);
            System.out.printf(">>> [MongoDB Atlas] Seeded %d verified campus rooms across Floors 1–6.%n", rooms.size());
        }
    }

    private void seedItemVocabularyIfEmpty() {
        if (itemVocabularyRepository.count() == 0) {
            List<ItemVocabulary> vocab = List.of(
                    new ItemVocabulary("laptop", "Laptop (MacBook / ThinkPad)", "Electronics", 20, "SEED"),
                    new ItemVocabulary("laptop charger", "Laptop Charger (Type-C / MagSafe)", "Electronics", 15, "SEED"),
                    new ItemVocabulary("headphones", "Headphones (Over-Ear)", "Electronics", 18, "SEED"),
                    new ItemVocabulary("airpods", "Apple AirPods / Earbuds", "Electronics", 22, "SEED"),
                    new ItemVocabulary("student id card", "Student ID Card", "ID & Cards", 30, "SEED"),
                    new ItemVocabulary("scientific calculator", "Scientific Calculator (Casio)", "Electronics", 12, "SEED"),
                    new ItemVocabulary("water bottle", "Water Bottle (Insulated Steel)", "Accessories", 16, "SEED"),
                    new ItemVocabulary("wallet", "Leather Bi-Fold Wallet", "Bags", 14, "SEED"),
                    new ItemVocabulary("backpack", "College Backpack", "Bags", 10, "SEED"),
                    new ItemVocabulary("umbrella", "Folding Umbrella", "Accessories", 8, "SEED"),
                    new ItemVocabulary("keys", "House / Locker Keys Keychain", "Accessories", 9, "SEED")
            );
            itemVocabularyRepository.saveAll(vocab);
            System.out.println(">>> [MongoDB Atlas] Seeded baseline item vocabulary for Unit 4 Trie Autocomplete.");
        }
    }
}

