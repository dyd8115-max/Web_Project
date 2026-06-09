package com.pawlog.service;

import com.pawlog.dto.*;
import com.pawlog.entity.*;
import com.pawlog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUser(String userId, String currentUserId) {
        User user = userRepository.findById(userId).orElseThrow();
        UserDto dto = UserDto.from(user);
        dto.setFollowingCount(followRepository.countByFollower(user));
        dto.setFollowerCount(followRepository.countByFollowee(user));
        return dto;
    }

    public UserDto updateProfile(String userId, UserDto request) {
        User user = userRepository.findById(userId).orElseThrow();
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getUsername() != null) user.setUsername(request.getUsername());
        return UserDto.from(userRepository.save(user));
    }

    public boolean toggleFollow(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId).orElseThrow();
        User followee = userRepository.findById(followeeId).orElseThrow();
        if (followRepository.existsByFollowerAndFollowee(follower, followee)) {
            followRepository.deleteByFollowerAndFollowee(follower, followee);
            return false;
        } else {
            followRepository.save(Follow.builder().follower(follower).followee(followee).build());
            return true;
        }
    }

    public List<UserDto> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCase(query).stream()
                .map(UserDto::from).collect(Collectors.toList());
    }

    public List<UserDto> getFollowers(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return followRepository.findByFollowee(user).stream()
                .map(f -> UserDto.from(f.getFollower())).collect(Collectors.toList());
    }

    public List<UserDto> getFollowing(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return followRepository.findByFollower(user).stream()
                .map(f -> UserDto.from(f.getFollowee())).collect(Collectors.toList());
    }
}
