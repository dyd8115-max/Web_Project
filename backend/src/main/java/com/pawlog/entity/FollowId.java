package com.pawlog.entity;

import java.io.Serializable;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class FollowId implements Serializable {
    private String follower;
    private String followee;
}
