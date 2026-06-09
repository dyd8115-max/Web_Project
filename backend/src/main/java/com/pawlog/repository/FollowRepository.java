package com.pawlog.repository;

import com.pawlog.entity.Follow;
import com.pawlog.entity.FollowId;
import com.pawlog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    boolean existsByFollowerAndFollowee(User follower, User followee);
    void deleteByFollowerAndFollowee(User follower, User followee);
    List<Follow> findByFollower(User follower);
    List<Follow> findByFollowee(User followee);
    long countByFollower(User follower);
    long countByFollowee(User followee);
}
