package com.nutrex.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    WebClient aiServiceWebClient(
        WebClient.Builder builder,
        @Value("${services.ai-service.url}") String aiServiceUrl
    ) {
        return builder.baseUrl(aiServiceUrl).build();
    }
}
