package com.ordertracking.service;

import com.ordertracking.model.AdminUser;
import com.ordertracking.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdminUser() {
        // Create default admin user if not exists
        if (adminRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = new AdminUser();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("SecureAdmin123!"));
            admin.setEmail("admin@ordertracking.com");
            admin.setFullName("System Administrator");
            admin.setRole("ADMIN");
            adminRepository.save(admin);
        }
    }

    public Optional<AdminUser> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public boolean validateCredentials(String username, String password) {
        Optional<AdminUser> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            AdminUser admin = adminOpt.get();
            return passwordEncoder.matches(password, admin.getPassword());
        }
        return false;
    }
}