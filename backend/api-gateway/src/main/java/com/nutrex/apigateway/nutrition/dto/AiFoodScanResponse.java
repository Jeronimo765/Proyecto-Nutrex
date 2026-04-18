package com.nutrex.apigateway.nutrition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record AiFoodScanResponse(
    @JsonProperty("alimento_detectado") String alimentoDetectado,
    String descripcion,
    @JsonProperty("porcion_estimada") String porcionEstimada,
    AiFoodMacros macronutrientes,
    List<AiFoodAlert> alertas,
    @JsonProperty("recomendacion_ia") String recomendacionIa,
    @JsonProperty("apto_para_condicion") boolean aptoParaCondicion,
    @JsonProperty("alternativas_saludables") List<String> alternativasSaludables,
    @JsonProperty("score_nutricional") int scoreNutricional
) {
}
