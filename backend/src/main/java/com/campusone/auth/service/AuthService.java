package com.campusone.auth.service;

import com.campusone.auth.dto.AuthDtos.*;
import com.campusone.auth.model.Role;
import com.campusone.auth.model.RoleName;
import com.campusone.auth.model.User;
import com.campusone.auth.repository.RoleRepository;
import com.campusone.auth.repository.UserRepository;
import com.campusone.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final List<String> allowedDomains;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager,
                       @Value("${campusone.auth.allowed-domains}") List<String> allowedDomains) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.allowedDomains = allowedDomains;
    }

    public void validateUniversityEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
        boolean isAllowed = allowedDomains.stream()
                .anyMatch(d -> domain.equalsIgnoreCase(d.trim()) || domain.endsWith("." + d.trim()));

        if (!isAllowed) {
            throw new IllegalArgumentException(String.format(
                    "Email domain '@%s' is not authorized. Must be an official university domain: %s",
                    domain, String.join(", ", allowedDomains)
            ));
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        validateUniversityEmail(request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " is already registered.");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getDepartment()
        );

        // Assign Roles (Multi-Role Support)
        Set<Role> roles = new HashSet<>();
        if (request.getRequestedRoles() != null && !request.getRequestedRoles().isEmpty()) {
            for (String roleStr : request.getRequestedRoles()) {
                String normalized = roleStr.toUpperCase().startsWith("ROLE_") ? roleStr.toUpperCase() : "ROLE_" + roleStr.toUpperCase();
                try {
                    RoleName rName = RoleName.valueOf(normalized);
                    Role role = roleRepository.findByName(rName)
                            .orElseGet(() -> roleRepository.save(new Role(rName)));
                    roles.add(role);
                } catch (IllegalArgumentException ignored) {
                    // Ignore unrecognized role
                }
            }
        }

        if (roles.isEmpty()) {
            Role studentRole = roleRepository.findByName(RoleName.ROLE_STUDENT)
                    .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_STUDENT)));
            roles.add(studentRole);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        List<String> roleNames = savedUser.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(savedUser.getEmail(), roleNames);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getDepartment(),
                roleNames
        );
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid university email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!user.isActive()) {
            throw new IllegalStateException("Your university account has been deactivated. Please contact Central Administration.");
        }

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String token = jwtUtil.generateToken(user.getEmail(), roleNames);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getDepartment(),
                roleNames
        );
    }

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        List<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return new UserProfileDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getDepartment(),
                roleNames,
                user.isActive()
        );
    }
}
