from fastapi import APIRouter, UploadFile, File
from app.services.ai_service import process_image

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    result = await process_image(file)
    return result