package com.pawlog.dto;

import com.pawlog.entity.Pet;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PetDto {
    private String id;
    private String name;
    private String species;
    private Integer age;
    private String photoUrl;
    private String description;
    private String userId;

    public static PetDto from(Pet pet) {
        return PetDto.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .age(pet.getAge())
                .photoUrl(pet.getPhotoUrl())
                .description(pet.getDescription())
                .userId(pet.getUser().getId())
                .build();
    }
}
