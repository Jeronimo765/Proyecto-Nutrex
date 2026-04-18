package com.nutrex.apigateway.nutrition.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record FoodTextAnalysisRequest(
    @NotBlank String food_description,
    List<String> user_conditions
) {
}
