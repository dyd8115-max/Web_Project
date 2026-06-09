package com.pawlog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "follows", uniqueConstraints = @UniqueConstraint(columnNames = {"follower_id", "followee_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@IdClass(FollowId.class)
public class Follow {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id")
    private User follower;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "followee_id")
    private User followee;
}
