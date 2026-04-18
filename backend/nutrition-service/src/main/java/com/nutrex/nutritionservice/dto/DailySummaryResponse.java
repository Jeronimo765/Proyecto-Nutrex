package com.nutrex.nutritionservice.dto;

import lombok.Builder;

@Builder
public record DailySummaryResponse(
    int calories,
    int caloriesGoal,
    int carbs,
    int carbsGoal,
    int protein,
    int proteinGoal,
    int fats,
    int fatsGoal,
    int fiber,
    int fiberGoal
) {
}
