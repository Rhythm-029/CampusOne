package com.campusone.auth;

import com.campusone.auth.dto.AuthDtos.*;
import com.campusone.auth.model.Role;
import com.campusone.auth.model.RoleName;
import com.campusone.auth.model.User;
import com.campusone.auth.repository.RoleRepository;
import com.campusone.auth.repository.UserRepository;
import com.campusone.auth.security.JwtUtil;
import com.campusone.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthService authService;
    private final List<String> allowedDomains = List.of("atlasuniversity.edu.in", "ugdx.edu.in");

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        jwtUtil = new JwtUtil("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970", 86400000L);
        authService = new AuthService(
                userRepository,
                roleRepository,
                passwordEncoder,
                jwtUtil,
                authenticationManager,
                allowedDomains
        );
    }

    @Test
    @DisplayName("Validate Email: Authorized University Domains Pass")
    void testUniversityEmailValidationPasses() {
        assertDoesNotThrow(() -> authService.validateUniversityEmail("student@atlasuniversity.edu.in"));
        assertDoesNotThrow(() -> authService.validateUniversityEmail("faculty@ugdx.edu.in"));
    }

    @Test
    @DisplayName("Validate Email: Unauthorized Generic Domains are Rejected")
    void testGenericEmailRejected() {
        Exception ex = assertThrows(IllegalArgumentException.class,
                () -> authService.validateUniversityEmail("intruder@gmail.com"));
        assertTrue(ex.getMessage().contains("not authorized"));
    }

    @Test
    @DisplayName("Register: Successfully Assigns Multiple Roles (Student & Club Coordinator)")
    void testMultiRoleRegistration() {
        RegisterRequest req = new RegisterRequest(
                "coordinator@atlasuniversity.edu.in",
                "Password123!",
                "Rhythm Singhal",
                "Computer Science",
                List.of("ROLE_STUDENT", "ROLE_CLUB_COORDINATOR")
        );

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_STUDENT)).thenReturn(Optional.of(new Role(RoleName.ROLE_STUDENT)));
        when(roleRepository.findByName(RoleName.ROLE_CLUB_COORDINATOR)).thenReturn(Optional.of(new Role(RoleName.ROLE_CLUB_COORDINATOR)));

        User savedUser = new User(req.getEmail(), passwordEncoder.encode(req.getPassword()), req.getFullName(), req.getDepartment());
        savedUser.addRole(new Role(RoleName.ROLE_STUDENT));
        savedUser.addRole(new Role(RoleName.ROLE_CLUB_COORDINATOR));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse resp = authService.register(req);

        assertNotNull(resp);
        assertNotNull(resp.getToken());
        assertTrue(resp.getRoles().contains("ROLE_STUDENT"));
        assertTrue(resp.getRoles().contains("ROLE_CLUB_COORDINATOR"));
        assertEquals(2, resp.getRoles().size());
        assertEquals(req.getEmail(), jwtUtil.extractEmail(resp.getToken()));
    }

    @Test
    @DisplayName("Login: Bad Credentials Throws Exception")
    void testBadCredentialsLogin() {
        LoginRequest req = new LoginRequest("dr.sharma@atlasuniversity.edu.in", "WrongPassword");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid"));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Login: Deactivated Account is Rejected")
    void testDeactivatedAccountLogin() {
        LoginRequest req = new LoginRequest("inactive@atlasuniversity.edu.in", "Password123!");

        User inactiveUser = new User(req.getEmail(), passwordEncoder.encode(req.getPassword()), "Former Student", "CS");
        inactiveUser.setActive(false);

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(inactiveUser));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("deactivated"));
    }
}
