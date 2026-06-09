package com.pawlog.dto;

import com.pawlog.entity.User;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserDto {
    private String id;
    private String email;
    private String username;
    private String bio;
    private String profileImageUrl;
    private long followingCount;
    private long followerCount;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
