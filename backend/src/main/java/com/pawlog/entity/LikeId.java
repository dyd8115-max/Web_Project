package com.pawlog.entity;

import java.io.Serializable;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class LikeId implements Serializable {
    private String user;
    private String post;
}
