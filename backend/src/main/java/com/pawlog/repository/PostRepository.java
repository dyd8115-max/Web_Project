package com.pawlog.repository;

import com.pawlog.entity.Post;
import com.pawlog.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p JOIN p.hashtags h WHERE h = :tag ORDER BY p.createdAt DESC")
    List<Post> findByHashtag(@Param("tag") String tag);

    @Query("SELECT p FROM Post p WHERE p.user IN :users ORDER BY p.createdAt DESC")
    Page<Post> findByUsersOrderByCreatedAtDesc(@Param("users") List<User> users, Pageable pageable);
}
