package com.ordertracking.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private String role;

    public AuthResponse(String token, String username, String fullName, String role) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
    }
}