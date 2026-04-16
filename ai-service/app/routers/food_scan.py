from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import base64

from app.models.food_scan import FoodScanRequest, FoodScanResponse
from app.services.ai_service import analizar_imagen

router = APIRouter(prefix="/scan", tags=["Food Scanner"])

@router.post("/image", response_model=FoodScanResponse)
async def scan_por_archivo(
    file: UploadFile = File(...),
    condicion_medica: Optional[str] = Form(default="ninguna")
):
    contenido = await file.read()
    image_base64 = base64.standard_b64encode(contenido).decode("utf-8")
    try:
        return await analizar_imagen(image_base64, condicion_medica)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/base64", response_model=FoodScanResponse)
async def scan_por_base64(request: FoodScanRequest):
    image_data = request.image_base64
    if "," in image_data:
        image_data = image_data.split(",")[1]
    try:
        return await analizar_imagen(image_data, request.condicion_medica)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))