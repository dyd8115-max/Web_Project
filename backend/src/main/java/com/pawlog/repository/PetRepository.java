package com.pawlog.repository;

import com.pawlog.entity.Pet;
import com.pawlog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetRepository extends JpaRepository<Pet, String> {
    List<Pet> findByUser(User user);
    List<Pet> findByUserId(String userId);
}
