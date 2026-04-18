package com.nutrex.apigateway.chat.dto;

public record FrontendChatResponse(
    String response,
    int tokens_used
) {
}
