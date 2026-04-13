from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
from app.models.schemas import FoodAnalysisResponse, FoodTextRequest
from app.services.vision_service import VisionService

router = APIRouter(prefix="/food", tags=["Análisis de Alimentos"])
service = VisionService()

# Analizar por foto
@router.post("/analyze-image", response_model=FoodAnalysisResponse)
async def analyze_food_image(
    photo: UploadFile = File(...),
    conditions: List[str] = Form(default=[])
):
    try:
        image_bytes = await photo.read()
        media_type  = photo.content_type or "image/jpeg"
        return service.analyze_food_image(image_bytes, media_type, conditions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analizar por texto
@router.post("/analyze-text", response_model=FoodAnalysisResponse)
async def analyze_food_text(request: FoodTextRequest):
    try:
        return service.analyze_food_text(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))