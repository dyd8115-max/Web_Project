package com.pawlog.repository;

import com.pawlog.entity.Comment;
import com.pawlog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
}
