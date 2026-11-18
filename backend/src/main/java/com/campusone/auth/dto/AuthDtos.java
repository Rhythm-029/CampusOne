package com.campusone.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AuthDtos {

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email address")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid university email")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Department is required")
        private String department;

        private List<String> requestedRoles;

        public RegisterRequest() {}

        public RegisterRequest(String email, String password, String fullName, String department, List<String> requestedRoles) {
            this.email = email;
            this.password = password;
            this.fullName = fullName;
            this.department = department;
            this.requestedRoles = requestedRoles;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        public List<String> getRequestedRoles() { return requestedRoles; }
        public void setRequestedRoles(List<String> requestedRoles) { this.requestedRoles = requestedRoles; }
    }

    public static class AuthResponse {
        private String token;
        private Long id;
        private String email;
        private String fullName;
        private String department;
        private List<String> roles;

        public AuthResponse(String token, Long id, String email, String fullName, String department, List<String> roles) {
            this.token = token;
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.department = department;
            this.roles = roles;
        }

        public String getToken() { return token; }
        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getDepartment() { return department; }
        public List<String> getRoles() { return roles; }
    }

    public static class UserProfileDto {
        private Long id;
        private String email;
        private String fullName;
        private String department;
        private List<String> roles;
        private boolean active;

        public UserProfileDto(Long id, String email, String fullName, String department, List<String> roles, boolean active) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.department = department;
            this.roles = roles;
            this.active = active;
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public String getDepartment() { return department; }
        public List<String> getRoles() { return roles; }
        public boolean isActive() { return active; }
    }
}
