package com.nutrex.nutritionservice.service;

import com.nutrex.nutritionservice.dto.DailySummaryResponse;
import org.springframework.stereotype.Service;

@Service
public class DailySummaryService {

    public DailySummaryResponse getDailySummary(String date) {
        return DailySummaryResponse.builder()
            .calories(1240)
            .caloriesGoal(1800)
            .carbs(110)
            .carbsGoal(200)
            .protein(62)
            .proteinGoal(80)
            .fats(24)
            .fatsGoal(65)
            .fiber(22)
            .fiberGoal(25)
            .build();
    }
}
