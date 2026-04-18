package com.nutrex.planservice.dto;

import java.util.List;
import lombok.Builder;

@Builder
public record PlanResponse(
    String id,
    String condicion,
    String tipoPlan,
    String objetivo,
    String descripcion,
    List<String> enfoque,
    List<String> alimentos,
    List<String> evitar,
    List<SemanaPlanResponse> semanas
) {
}
