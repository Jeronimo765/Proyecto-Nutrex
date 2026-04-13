from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.nutribot_service import NutribotService

router = APIRouter(prefix="/chat", tags=["NutriBot"])

@router.post("/", response_model=ChatResponse)
async def chat_with_nutribot(request: ChatRequest):
    try:
        service = NutribotService()
        return service.chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
