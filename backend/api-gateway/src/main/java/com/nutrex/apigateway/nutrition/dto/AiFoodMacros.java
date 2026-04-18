package com.nutrex.apigateway.nutrition.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiFoodMacros(
    int calorias,
    @JsonProperty("carbohidratos_g") double carbohidratosG,
    @JsonProperty("proteinas_g") double proteinasG,
    @JsonProperty("grasas_g") double grasasG,
    @JsonProperty("fibra_g") double fibraG,
    @JsonProperty("sodio_mg") double sodioMg,
    @JsonProperty("azucares_g") double azucaresG
) {
}
