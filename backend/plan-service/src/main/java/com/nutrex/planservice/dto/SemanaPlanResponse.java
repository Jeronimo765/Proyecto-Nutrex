package com.nutrex.planservice.dto;

import lombok.Builder;

@Builder
public record SemanaPlanResponse(
    int semana,
    String desayuno,
    String almuerzo,
    String cena
) {
}
