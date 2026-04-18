package com.nutrex.apigateway.nutrition;

import com.nutrex.apigateway.nutrition.dto.FoodTextAnalysisRequest;
import com.nutrex.apigateway.nutrition.dto.FrontendFoodAnalysisResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/food")
public class FoodProxyController {

    private final FoodAnalysisService foodAnalysisService;

    public FoodProxyController(FoodAnalysisService foodAnalysisService) {
        this.foodAnalysisService = foodAnalysisService;
    }

    @PostMapping(
        value = "/analyze-image",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Mono<FrontendFoodAnalysisResponse> analyzeImage(
        @RequestPart("photo") FilePart photo,
        @RequestPart(value = "conditions", required = false) List<String> conditions
    ) {
        return foodAnalysisService.analyzeImage(photo, conditions);
    }

    @PostMapping("/analyze-text")
    public FrontendFoodAnalysisResponse analyzeText(@Valid @RequestBody FoodTextAnalysisRequest request) {
        return foodAnalysisService.analyzeText(request);
    }
}
