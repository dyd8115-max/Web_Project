package com.pawlog.controller;

import com.pawlog.dto.*;
import com.pawlog.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getAllPosts(userId, page));
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<PostDto>> getFollowingFeed(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.getFollowingFeed(userDetails.getUsername(), page));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @RequestBody PostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.createPost(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Boolean>> toggleLike(@PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean liked = postService.toggleLike(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDto> addComment(@PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(commentService.addComment(userDetails.getUsername(), id, body.get("content")));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String postId, @PathVariable String commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        commentService.deleteComment(userDetails.getUsername(), commentId);
        return ResponseEntity.noContent().build();
    }
}
