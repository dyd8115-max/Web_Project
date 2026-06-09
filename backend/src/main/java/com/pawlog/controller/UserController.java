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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentId = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(userService.getUser(id, currentId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateProfile(@PathVariable String id,
            @RequestBody UserDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (!id.equals(userDetails.getUsername())) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Map<String, Boolean>> toggleFollow(@PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean following = userService.toggleFollow(userDetails.getUsername(), id);
        return ResponseEntity.ok(Map.of("following", following));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<PostDto>> getUserPosts(@PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal UserDetails userDetails) {
        String currentId = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(postService.getUserPosts(id, currentId, page));
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserDto>> getFollowers(@PathVariable String id) {
        return ResponseEntity.ok(userService.getFollowers(id));
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserDto>> getFollowing(@PathVariable String id) {
        return ResponseEntity.ok(userService.getFollowing(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(userService.searchUsers(q));
    }
}
