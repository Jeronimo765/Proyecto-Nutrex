package com.nutrex.nutritionservice.controller;

import com.nutrex.nutritionservice.dto.DailySummaryResponse;
import com.nutrex.nutritionservice.service.DailySummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DailySummaryController {

    private final DailySummaryService dailySummaryService;

    @GetMapping("/daily-summary")
    public ResponseEntity<DailySummaryResponse> getDailySummary(
        @RequestParam(required = false) String date
    ) {
        return ResponseEntity.ok(dailySummaryService.getDailySummary(date));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Nutrition Service corriendo.");
    }
}
