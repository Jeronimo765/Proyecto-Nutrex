package com.nutrex.apigateway.chat.dto;

public record AiChatResponse(
    String respuesta,
    boolean es_seguro
) {
}
