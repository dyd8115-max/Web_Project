package com.pawlog.service;

import com.pawlog.dto.*;
import com.pawlog.entity.*;
import com.pawlog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final FollowRepository followRepository;

    public Page<PostDto> getAllPosts(String currentUserId, int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        User currentUser = currentUserId != null ? userRepository.findById(currentUserId).orElse(null) : null;
        return posts.map(p -> toDto(p, currentUser));
    }

    public Page<PostDto> getFollowingFeed(String userId, int page) {
        User user = userRepository.findById(userId).orElseThrow();
        List<User> following = followRepository.findByFollower(user).stream()
                .map(Follow::getFollowee).collect(Collectors.toList());
        following.add(user);
        Pageable pageable = PageRequest.of(page, 10);
        return postRepository.findByUsersOrderByCreatedAtDesc(following, pageable)
                .map(p -> toDto(p, user));
    }

    public PostDto createPost(String userId, PostRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = Post.builder()
                .user(user)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .hashtags(request.getHashtags() != null ? request.getHashtags() : List.of())
                .build();
        return toDto(postRepository.save(post), user);
    }

    public void deletePost(String userId, String postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.delete(post);
    }

    public boolean toggleLike(String userId, String postId) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        if (likeRepository.existsByUserAndPost(user, post)) {
            likeRepository.deleteByUserAndPost(user, post);
            return false;
        } else {
            likeRepository.save(Like.builder().user(user).post(post).build());
            return true;
        }
    }

    public Page<PostDto> getUserPosts(String userId, String currentUserId, int page) {
        User user = userRepository.findById(userId).orElseThrow();
        User currentUser = currentUserId != null ? userRepository.findById(currentUserId).orElse(null) : null;
        Pageable pageable = PageRequest.of(page, 10);
        return postRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(p -> toDto(p, currentUser));
    }

    private PostDto toDto(Post post, User currentUser) {
        boolean liked = currentUser != null && likeRepository.existsByUserAndPost(currentUser, post);
        return PostDto.from(post, liked);
    }
}
