package com.pawlog.service;

import com.pawlog.dto.CommentDto;
import com.pawlog.entity.*;
import com.pawlog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentDto> getComments(String postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        return commentRepository.findByPostOrderByCreatedAtDesc(post).stream()
                .map(CommentDto::from).collect(Collectors.toList());
    }

    public CommentDto addComment(String userId, String postId, String content) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        Comment comment = Comment.builder().user(user).post(post).content(content).build();
        return CommentDto.from(commentRepository.save(comment));
    }

    public void deleteComment(String userId, String commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();
        if (!comment.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        commentRepository.delete(comment);
    }
}
