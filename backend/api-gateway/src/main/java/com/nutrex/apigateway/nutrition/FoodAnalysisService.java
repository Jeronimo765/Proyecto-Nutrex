package com.nutrex.apigateway.nutrition;

import com.nutrex.apigateway.nutrition.dto.AiFoodScanResponse;
import com.nutrex.apigateway.nutrition.dto.FoodTextAnalysisRequest;
import com.nutrex.apigateway.nutrition.dto.FrontendFoodAnalysisResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class FoodAnalysisService {

    private final WebClient aiServiceWebClient;

    public FoodAnalysisService(WebClient aiServiceWebClient) {
        this.aiServiceWebClient = aiServiceWebClient;
    }

    public Mono<FrontendFoodAnalysisResponse> analyzeImage(FilePart photo, List<String> conditions) {
        String condition = normalizeCondition(conditions);
        return DataBufferUtils.join(photo.content())
            .flatMap(dataBuffer -> {
                byte[] bytes = new byte[dataBuffer.readableByteCount()];
                dataBuffer.read(bytes);
                DataBufferUtils.release(dataBuffer);

                MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
                bodyBuilder.part("file", asResource(bytes, photo.filename()))
                    .filename(photo.filename())
                    .contentType(resolveMediaType(photo.headers().getContentType()));
                bodyBuilder.part("condicion_medica", condition);

                return aiServiceWebClient
                    .post()
                    .uri("/scan/image")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                    .retrieve()
                    .bodyToMono(AiFoodScanResponse.class)
                    .map(this::toFrontendResponse);
            });
    }

    public FrontendFoodAnalysisResponse analyzeText(FoodTextAnalysisRequest request) {
        String description = request.food_description().toLowerCase(Locale.ROOT);
        String condition = normalizeCondition(request.user_conditions());

        int calories = 220;
        int carbs = 20;
        int protein = 12;
        int fats = 8;
        int fiber = 4;
        int sodium = 180;
        Integer glycemicIndex = null;
        List<String> warnings = new ArrayList<>();

        if (containsAny(description, "arroz", "pasta", "pan", "arepa")) {
            carbs += 28;
            calories += 140;
            glycemicIndex = 70;
        }

        if (containsAny(description, "pollo", "atun", "huevo", "salmon", "pescado", "carne")) {
            protein += 18;
            calories += 120;
        }

        if (containsAny(description, "frito", "papas fritas", "hamburguesa", "tocineta", "salchicha")) {
            fats += 14;
            sodium += 260;
            calories += 180;
            warnings.add("Tiene grasas o frituras que conviene moderar.");
        }

        if (containsAny(description, "ensalada", "brocoli", "espinaca", "verduras", "avena", "chia")) {
            fiber += 5;
            calories += 40;
            if (glycemicIndex == null) {
                glycemicIndex = 45;
            }
        }

        if (containsAny(description, "dulce", "gaseosa", "postre", "azucar", "helado")) {
            carbs += 18;
            calories += 110;
            glycemicIndex = 78;
            warnings.add("Puede elevar mas rapido la glucosa por su contenido de azucar.");
        }

        if ("diabetes".equals(condition) && carbs > 45) {
            warnings.add("La carga de carbohidratos parece alta para diabetes tipo 2.");
        }

        if ("hipertension".equals(condition) && sodium > 400) {
            warnings.add("El sodio estimado es elevado para hipertension.");
        }

        boolean suitable = warnings.isEmpty();
        String recommendation = buildRecommendation(condition, suitable, carbs, sodium, fiber);

        return new FrontendFoodAnalysisResponse(
            buildFoodName(description),
            calories,
            carbs,
            protein,
            fats,
            fiber,
            sodium,
            glycemicIndex,
            suitable,
            recommendation,
            warnings
        );
    }

    private FrontendFoodAnalysisResponse toFrontendResponse(AiFoodScanResponse response) {
        List<String> warnings = response.alertas() == null
            ? List.of()
            : response.alertas().stream()
                .map(alert -> alert.mensaje())
                .filter(StringUtils::hasText)
                .toList();

        Integer glycemicIndex = response.scoreNutricional() > 0
            ? Math.max(35, 100 - response.scoreNutricional())
            : null;

        return new FrontendFoodAnalysisResponse(
            response.alimentoDetectado(),
            response.macronutrientes().calorias(),
            (int) Math.round(response.macronutrientes().carbohidratosG()),
            (int) Math.round(response.macronutrientes().proteinasG()),
            (int) Math.round(response.macronutrientes().grasasG()),
            (int) Math.round(response.macronutrientes().fibraG()),
            (int) Math.round(response.macronutrientes().sodioMg()),
            glycemicIndex,
            response.aptoParaCondicion(),
            response.recomendacionIa(),
            warnings
        );
    }

    private String normalizeCondition(List<String> conditions) {
        if (conditions == null || conditions.isEmpty()) {
            return "ninguna";
        }

        String first = conditions.get(0).toLowerCase(Locale.ROOT);

        return switch (first) {
            case "diabetes_t2", "diabetes" -> "diabetes";
            case "hipertension", "hypertension" -> "hipertension";
            case "colesterol", "cholesterol" -> "colesterol";
            case "renal", "kidney" -> "renal";
            default -> "ninguna";
        };
    }

    private boolean containsAny(String value, String... terms) {
        for (String term : terms) {
            if (value.contains(term)) {
                return true;
            }
        }
        return false;
    }

    private String buildFoodName(String description) {
        if (!StringUtils.hasText(description)) {
            return "Comida analizada";
        }

        String cleaned = description.trim();
        return Character.toUpperCase(cleaned.charAt(0)) + cleaned.substring(1);
    }

    private String buildRecommendation(String condition, boolean suitable, int carbs, int sodium, int fiber) {
        if (!suitable) {
            return switch (condition) {
                case "diabetes" -> "Conviene ajustar la porcion o combinarlo con mas proteina y fibra para evitar picos de glucosa.";
                case "hipertension" -> "Lo ideal es buscar una version con menos sodio y mas ingredientes frescos.";
                default -> "Puedes consumirlo con moderacion, pero seria mejor balancearlo con opciones mas frescas y menos procesadas.";
            };
        }

        if (fiber >= 8) {
            return "Buena eleccion. Tiene un perfil mas favorable y la fibra ayuda a mejorar saciedad y control metabolico.";
        }

        if (carbs <= 35 && sodium <= 250) {
            return "Se ve bastante equilibrado. Puede encajar bien en una comida principal si lo acompanias con vegetales.";
        }

        return "Es una opcion aceptable. Si quieres mejorarla, agrega verduras y cuida la porcion total.";
    }

    private ByteArrayResource asResource(byte[] bytes, String filename) {
        return new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return filename;
            }
        };
    }

    private MediaType resolveMediaType(MediaType contentType) {
        return contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM;
    }

    private MediaType resolveMediaType(String contentType) {
        try {
            return contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM;
        } catch (Exception exception) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
