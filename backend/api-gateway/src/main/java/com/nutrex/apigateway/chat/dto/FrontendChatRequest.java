package com.nutrex.apigateway.chat.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record FrontendChatRequest(
    @NotBlank String message,
    @Valid List<FrontendChatMessage> history,
    List<String> user_conditions,
    String user_name
) {
}
