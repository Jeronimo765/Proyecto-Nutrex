package com.nutrex.planservice.controller;

import com.nutrex.planservice.dto.PlanResponse;
import com.nutrex.planservice.service.PlanCatalogService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlanController {

    private final PlanCatalogService planCatalogService;

    @GetMapping
    public ResponseEntity<List<PlanResponse>> getPlans() {
        return ResponseEntity.ok(planCatalogService.getPlans());
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Plan Service corriendo.");
    }
}
