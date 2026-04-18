package com.nutrex.apigateway.chat;

import com.nutrex.apigateway.chat.dto.AiChatRequest;
import com.nutrex.apigateway.chat.dto.AiChatResponse;
import com.nutrex.apigateway.chat.dto.FrontendChatMessage;
import com.nutrex.apigateway.chat.dto.FrontendChatRequest;
import com.nutrex.apigateway.chat.dto.FrontendChatResponse;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/chat")
public class ChatProxyController {

    private final WebClient aiServiceWebClient;

    public ChatProxyController(WebClient aiServiceWebClient) {
        this.aiServiceWebClient = aiServiceWebClient;
    }

    @PostMapping(value = {"", "/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public Mono<FrontendChatResponse> sendMessage(@Valid @RequestBody FrontendChatRequest request) {
        AiChatRequest aiRequest = new AiChatRequest(
            request.message(),
            toAiHistory(request.history()),
            request.user_conditions(),
            request.user_name()
        );

        return aiServiceWebClient
            .post()
            .uri("/nutrition/chat")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(aiRequest)
            .retrieve()
            .bodyToMono(AiChatResponse.class)
            .map(response -> new FrontendChatResponse(response.respuesta(), 0));
    }

    private List<Map<String, String>> toAiHistory(List<FrontendChatMessage> history) {
        if (history == null || history.isEmpty()) {
            return Collections.emptyList();
        }

        return history.stream()
            .map(message -> Map.of(
                "role", message.role(),
                "content", message.content()
            ))
            .toList();
    }
}
