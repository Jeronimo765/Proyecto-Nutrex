package com.nutrex.apigateway.chat.dto;

import jakarta.validation.constraints.NotBlank;

public record FrontendChatMessage(
    @NotBlank String role,
    @NotBlank String content
) {
}
