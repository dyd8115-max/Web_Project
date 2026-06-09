package com.pawlog.dto;

import com.pawlog.entity.Post;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PostDto {
    private String id;
    private String content;
    private String imageUrl;
    private List<String> hashtags;
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;
    private UserDto author;
    private LocalDateTime createdAt;

    public static PostDto from(Post post, boolean liked) {
        return PostDto.builder()
                .id(post.getId())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .hashtags(post.getHashtags())
                .likeCount(post.getLikes().size())
                .commentCount(post.getComments().size())
                .likedByCurrentUser(liked)
                .author(UserDto.from(post.getUser()))
                .createdAt(post.getCreatedAt())
                .build();
    }
}
