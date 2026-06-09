package com.pawlog.dto;

import com.pawlog.entity.Comment;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommentDto {
    private String id;
    private String content;
    private UserDto author;
    private LocalDateTime createdAt;

    public static CommentDto from(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(UserDto.from(comment.getUser()))
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
