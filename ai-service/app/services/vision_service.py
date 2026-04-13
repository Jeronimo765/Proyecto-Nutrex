from app.models.schemas import FoodAnalysisResponse, FoodTextRequest


class VisionService:
    """Minimal service that keeps the food analyzer router importable."""

    def analyze_food_image(
        self,
        image_bytes: bytes,
        media_type: str,
        conditions: list[str],
    ) -> FoodAnalysisResponse:
        return FoodAnalysisResponse(
            food_name="Analisis pendiente",
            calories=None,
            carbs_g=None,
            protein_g=None,
            fats_g=None,
            fiber_g=None,
            sodium_mg=None,
            glycemic_index=None,
            is_suitable=False,
            recommendation="El analizador de imagen aun no esta implementado.",
            warnings=["No se pudo procesar la imagen todavia."],
        )

    def analyze_food_text(self, request: FoodTextRequest) -> FoodAnalysisResponse:
        return FoodAnalysisResponse(
            food_name=request.food_description,
            calories=None,
            carbs_g=None,
            protein_g=None,
            fats_g=None,
            fiber_g=None,
            sodium_mg=None,
            glycemic_index=None,
            is_suitable=False,
            recommendation="El analizador de texto aun no esta implementado.",
            warnings=["No se pudo analizar el alimento todavia."],
        )
