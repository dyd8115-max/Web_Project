package com.pawlog.repository;

import com.pawlog.entity.Like;
import com.pawlog.entity.LikeId;
import com.pawlog.entity.User;
import com.pawlog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, LikeId> {
    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    long countByPost(Post post);
}
