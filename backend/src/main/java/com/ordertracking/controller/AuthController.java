package com.ordertracking.controller;

import com.ordertracking.dto.AuthResponse;
import com.ordertracking.dto.LoginRequest;
import com.ordertracking.model.AdminUser;
import com.ordertracking.service.AdminService;
import com.ordertracking.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:4200", "http://127.0.0.1:4200" })
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            String token = jwtService.generateToken(loginRequest.getUsername());

            Optional<AdminUser> adminOpt = adminService.findByUsername(loginRequest.getUsername());
            if (adminOpt.isPresent()) {
                AdminUser admin = adminOpt.get();
                AuthResponse response = new AuthResponse(
                        token,
                        admin.getUsername(),
                        admin.getFullName(),
                        admin.getRole());
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body("Invalid credentials");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String username = jwtService.extractUsername(jwt);

            if (jwtService.validateToken(jwt, username)) {
                return ResponseEntity.ok().body("Token is valid");
            } else {
                return ResponseEntity.status(401).body("Invalid token");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}