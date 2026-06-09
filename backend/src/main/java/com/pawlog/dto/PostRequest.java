package com.pawlog.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PostRequest {
    private String content;
    private String imageUrl;
    private List<String> hashtags;
}
