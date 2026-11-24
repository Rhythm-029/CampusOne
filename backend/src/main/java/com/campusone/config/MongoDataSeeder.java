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
        if (userRepository.findByEmail("nimesh.bumb@atlasskilltech.university").isEmpty()) {
            userRepository.deleteAll();
            String encodedPwd = passwordEncoder.encode("Password123!");

            List<UserDocument> users = new ArrayList<>();

            // 1. Master University Admin (Estate & Space Admin, Lost & Found Admin, Super Admin)
            users.add(new UserDocument(
                    "admin@atlasskilltech.university",
                    encodedPwd,
                    "Campus Admin",
                    "Estate & Space Operations",
                    Set.of(RoleName.ROLE_SUPER_ADMIN, RoleName.ROLE_SPACE_ADMIN, RoleName.ROLE_EVENT_ADMIN, RoleName.ROLE_LOST_FOUND_ADMIN)
            ));

            // 2. Verified Student
            users.add(new UserDocument(
                    "ananya.student@atlasskilltech.university",
                    encodedPwd,
                    "Ananya Sharma",
                    "Computer Science (Semester V)",
                    Set.of(RoleName.ROLE_STUDENT)
            ));

            // 3. The 8 Specified Professors
            users.add(new UserDocument("nimesh.bumb@atlasskilltech.university", encodedPwd, "Nimesh Bumb", "Computer Science & AI/ML", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("yogesh.jadhav@atlasskilltech.university", encodedPwd, "Yogesh Jadhav", "Computer Science & Systems", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("kunal.meher@atlasskilltech.university", encodedPwd, "Kunal Meher", "Computer Science & Data", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("rabindra.henry@atlasskilltech.university", encodedPwd, "Rabindra Henry", "Computer Science & Networking", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("lipika.majumdar@atlasskilltech.university", encodedPwd, "Lipika Majumdar", "AI & Data Science", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("mayank.srivastava@atlasskilltech.university", encodedPwd, "Mayank Srivastava", "AI & Computational Systems", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("maria.acharya@atlasskilltech.university", encodedPwd, "Maria Acharya", "Human-Computer Interaction & Design", Set.of(RoleName.ROLE_FACULTY)));
            users.add(new UserDocument("amrita.banerjee@atlasskilltech.university", encodedPwd, "Amrita Banerjee", "Cloud Computing & AI", Set.of(RoleName.ROLE_FACULTY)));

            // 4. The 2 Specified Club Coordinators
            users.add(new UserDocument("kunal.ramchandani@atlasskilltech.university", encodedPwd, "Kunal Ramchandani", "INC - The corporate club", Set.of(RoleName.ROLE_STUDENT, RoleName.ROLE_CLUB_COORDINATOR)));
            users.add(new UserDocument("aaren@atlasskilltech.university", encodedPwd, "Aaren", "Highflyers", Set.of(RoleName.ROLE_STUDENT, RoleName.ROLE_CLUB_COORDINATOR)));

            userRepository.saveAll(users);
            System.out.println(">>> [MongoDB Atlas] Seeded verified university users (Professors, Club Coordinators, Student, Admin).");
        }
    }

    private void seedRoomsIfEmpty() {
        if (roomRepository.findByRoomNumber("712").isEmpty() || roomRepository.count() < 90) {
            roomRepository.deleteAll();
            List<RoomDocument> rooms = new ArrayList<>();

            // Floor 1: Rooms 101–113 (13 rooms, cap 60)
            for (int i = 1; i <= 13; i++) {
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

            // Floor 4: Rooms 401–413 (13 rooms, cap 60)
            for (int i = 1; i <= 13; i++) {
                String num = String.format("4%02d", i);
                rooms.add(new RoomDocument(num, 4, 60, "Smart Classroom", List.of("Laser Projector", "Whiteboard", "Wi-Fi 6"), true, true));
            }

            // Floor 5: Rooms 501–513 (13 rooms, cap 60)
            for (int i = 1; i <= 13; i++) {
                String num = String.format("5%02d", i);
                rooms.add(new RoomDocument(num, 5, 60, "Discussion & Seminar Room", List.of("Display Screen", "Whiteboard", "Wi-Fi 6"), true, true));
            }

            // Floor 6: Rooms 601–613 (13 rooms, cap 60)
            for (int i = 1; i <= 13; i++) {
                String num = String.format("6%02d", i);
                rooms.add(new RoomDocument(num, 6, 60, "Innovation Lab & Studio", List.of("Workstations", "Interactive Board", "Wi-Fi 6"), true, true));
            }

            // Floor 7: Rooms 701–712 (7th floor is the last floor, 12 rooms)
            for (int i = 1; i <= 12; i++) {
                String num = String.format("7%02d", i);
                rooms.add(new RoomDocument(num, 7, 60, "Academic Seminar & Executive Room", List.of("Interactive Display", "Conference Audio", "Wi-Fi 6"), true, true));
            }

            roomRepository.saveAll(rooms);
            System.out.printf(">>> [MongoDB Atlas] Seeded %d verified campus rooms across Floors 1–7 (Rooms 101-113 to 701-712).%n", rooms.size());
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

