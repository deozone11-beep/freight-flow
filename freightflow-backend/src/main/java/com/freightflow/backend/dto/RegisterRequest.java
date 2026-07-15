package com.freightflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    // CUSTOMER, COMPANY, DRIVER only - self-signup can't create ADMIN/WAREHOUSE_MANAGER accounts
    private String role;

    private String phone;

    private String vehicleNumber; // used when role = DRIVER
}
