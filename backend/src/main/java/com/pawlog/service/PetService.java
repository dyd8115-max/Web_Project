package com.pawlog.service;

import com.pawlog.dto.PetDto;
import com.pawlog.entity.Pet;
import com.pawlog.entity.User;
import com.pawlog.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PetService {
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public List<PetDto> getPetsByUserId(String userId) {
        return petRepository.findByUserId(userId).stream()
                .map(PetDto::from).collect(Collectors.toList());
    }

    public PetDto createPet(String userId, PetDto request) {
        User user = userRepository.findById(userId).orElseThrow();
        Pet pet = Pet.builder()
                .user(user)
                .name(request.getName())
                .species(request.getSpecies())
                .age(request.getAge())
                .photoUrl(request.getPhotoUrl())
                .description(request.getDescription())
                .build();
        return PetDto.from(petRepository.save(pet));
    }

    public PetDto updatePet(String userId, String petId, PetDto request) {
        Pet pet = petRepository.findById(petId).orElseThrow();
        if (!pet.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        if (request.getName() != null) pet.setName(request.getName());
        if (request.getSpecies() != null) pet.setSpecies(request.getSpecies());
        if (request.getAge() != null) pet.setAge(request.getAge());
        if (request.getPhotoUrl() != null) pet.setPhotoUrl(request.getPhotoUrl());
        if (request.getDescription() != null) pet.setDescription(request.getDescription());
        return PetDto.from(petRepository.save(pet));
    }

    public void deletePet(String userId, String petId) {
        Pet pet = petRepository.findById(petId).orElseThrow();
        if (!pet.getUser().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        petRepository.delete(pet);
    }
}
