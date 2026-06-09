package com.pawlog.controller;

import com.pawlog.dto.PetDto;
import com.pawlog.service.PetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<PetDto>> getPets(@PathVariable String userId) {
        return ResponseEntity.ok(petService.getPetsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<PetDto> createPet(@RequestBody PetDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.createPet(userDetails.getUsername(), request));
    }

    @PutMapping("/{petId}")
    public ResponseEntity<PetDto> updatePet(@PathVariable String petId,
            @RequestBody PetDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.updatePet(userDetails.getUsername(), petId, request));
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable String petId,
            @AuthenticationPrincipal UserDetails userDetails) {
        petService.deletePet(userDetails.getUsername(), petId);
        return ResponseEntity.noContent().build();
    }
}
