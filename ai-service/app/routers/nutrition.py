from fastapi import APIRouter, HTTPException
from app.models.nutrition import (
    NutritionPlanRequest, NutritionPlanResponse,
    RecipeRequest, RecipesResponse,
    ChatRequest, ChatResponse
)
from app.services.ai_service import (
    generar_plan_nutricional,
    generar_recetas,
    chat_nutribot
)

router = APIRouter(prefix="/nutrition", tags=["Nutricion"])

@router.post("/plans", response_model=NutritionPlanResponse)
async def get_nutrition_plan(request: NutritionPlanRequest):
    try:
        return await generar_plan_nutricional(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recipes", response_model=RecipesResponse)
async def get_recipes(request: RecipeRequest):
    try:
        return await generar_recetas(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat", response_model=ChatResponse)
async def chat_with_nutribot(request: ChatRequest):
    try:
        return await chat_nutribot(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
