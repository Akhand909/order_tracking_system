package com.ordertracking.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "admin_users")
@Data
public class AdminUser {

    @Id
    private String id;

    @Field
    private String username;

    @Field
    private String password;

    @Field
    private String email;

    @Field
    private String fullName;

    @Field
    private String role = "ADMIN";
}