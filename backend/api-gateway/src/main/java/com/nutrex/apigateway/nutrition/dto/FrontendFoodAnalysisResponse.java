package com.nutrex.apigateway.nutrition.dto;

import java.util.List;

public record FrontendFoodAnalysisResponse(
    String food_name,
    int calories,
    int carbs_g,
    int protein_g,
    int fats_g,
    int fiber_g,
    int sodium_mg,
    Integer glycemic_index,
    boolean is_suitable,
    String recommendation,
    List<String> warnings
) {
}
