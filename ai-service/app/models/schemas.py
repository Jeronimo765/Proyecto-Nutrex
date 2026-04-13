from typing import List, Optional

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = Field(default_factory=list)
    user_conditions: List[str] = Field(default_factory=list)
    user_name: Optional[str] = "amigo"


class ChatResponse(BaseModel):
    response: str
    tokens_used: int


class FoodTextRequest(BaseModel):
    food_description: str
    user_conditions: List[str] = Field(default_factory=list)


class FoodAnalysisResponse(BaseModel):
    food_name: str
    calories: Optional[float]
    carbs_g: Optional[float]
    protein_g: Optional[float]
    fats_g: Optional[float]
    fiber_g: Optional[float]
    sodium_mg: Optional[float]
    glycemic_index: Optional[int]
    is_suitable: bool
    recommendation: str
    warnings: List[str] = Field(default_factory=list)
