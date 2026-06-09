package com.pawlog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "likes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(LikeId.class)
public class Like {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
}
