from pydantic import BaseModel
from typing import List, Optional

# --- Modelos de Solicitud (Requests) ---

class NutritionPlanRequest(BaseModel):
    condicion_medica: str
    dias: int = 1
    preferencias: Optional[str] = ""

class RecipeRequest(BaseModel):
    condicion_medica: str
    ingredientes: Optional[str] = ""
    tipo_comida: str = "general" # desayuno, almuerzo, cena

class ChatRequest(BaseModel):
    mensaje: str
    historial: Optional[List[dict]] = []
    user_conditions: Optional[List[str]] = []
    user_name: Optional[str] = ""

# --- Modelos de Respuesta (Responses) ---

# Para el Plan de Nutrición
class ComidaPlan(BaseModel):
    tipo: str # Desayuno, Almuerzo...
    nombre: str
    descripcion: str
    calorias: int

class DiaPlan(BaseModel):
    dia: int
    comidas: List[ComidaPlan]
    recomendacion_diaria: str

class NutritionPlanResponse(BaseModel):
    titulo: str
    dias: List[DiaPlan]
    advertencias_condicion: str

# Para las Recetas
class Ingrediente(BaseModel):
    nombre: str
    cantidad: str

class Receta(BaseModel):
    nombre: str
    descripcion: str
    tiempo_preparacion_min: int
    ingredientes: List[Ingrediente]
    instrucciones: List[str]
    tips_saludables: str

class RecipesResponse(BaseModel):
    recetas: List[Receta]
    
# Para el Chatbot
class ChatResponse(BaseModel):
    respuesta: str
    es_seguro: bool # Si la IA detecta que la pregunta va fuera de nutrición
