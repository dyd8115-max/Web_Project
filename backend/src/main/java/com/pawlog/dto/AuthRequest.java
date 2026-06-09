package com.pawlog.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AuthRequest {
    private String email;
    private String password;
    private String username;
}
