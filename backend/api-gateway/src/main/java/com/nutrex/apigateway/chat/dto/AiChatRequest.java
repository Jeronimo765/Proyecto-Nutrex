package com.nutrex.apigateway.chat.dto;

import java.util.List;
import java.util.Map;

public record AiChatRequest(
    String mensaje,
    List<Map<String, String>> historial
) {
}
