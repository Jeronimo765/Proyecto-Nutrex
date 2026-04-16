import google.generativeai as genai
import json, re, os
from dotenv import load_dotenv
from typing import Optional
from app.models.food_scan import FoodScanResponse, Macronutriente, AlertaNutricional
from app.models.nutrition import (
    NutritionPlanRequest, NutritionPlanResponse, 
    RecipeRequest, RecipesResponse, 
    ChatRequest, ChatResponse
)
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

CONDICIONES = {
    "diabetes": "Usuario con DIABETES. Máx 45g carbohidratos/comida, sin azúcares simples.",
    "hipertension": "Usuario con HIPERTENSIÓN. Máx 600mg sodio/comida.",
    "colesterol": "Usuario con COLESTEROL ALTO. Sin grasas saturadas ni frituras.",
    "renal": "Usuario con ENFERMEDAD RENAL. Restricción proteínas, potasio y fósforo.",
    "ninguna": "Usuario sano. Evalúa con criterios generales de nutrición."
}

async def analizar_imagen(image_base64: str, condicion_medica: str = "ninguna") -> FoodScanResponse:
    import base64
    contexto = CONDICIONES.get(condicion_medica, CONDICIONES["ninguna"])

    prompt = f"""Eres NutriBot. Analiza la imagen de comida. Contexto: {contexto}
Responde SOLO JSON válido sin texto extra:
{{
  "alimento_detectado": "nombre",
  "descripcion": "descripción breve",
  "porcion_estimada": "ej: 1 plato (~300g)",
  "macronutrientes": {{
    "calorias": 0, "proteinas_g": 0.0, "carbohidratos_g": 0.0,
    "grasas_g": 0.0, "fibra_g": 0.0, "sodio_mg": 0.0, "azucares_g": 0.0
  }},
  "alertas": [{{"tipo": "ok|advertencia|peligro", "mensaje": "texto"}}],
  "recomendacion_ia": "consejo en máx 3 oraciones",
  "apto_para_condicion": true,
  "alternativas_saludables": ["opcion1", "opcion2", "opcion3"],
  "score_nutricional": 75
}}"""

    image_data = base64.b64decode(image_base64)
    image_part = {"mime_type": "image/jpeg", "data": image_data}

    response = model.generate_content([prompt, image_part])
    raw = re.sub(r"```json|```", "", response.text).strip()
    data = json.loads(raw)

    return FoodScanResponse(
        alimento_detectado=data["alimento_detectado"],
        descripcion=data["descripcion"],
        porcion_estimada=data["porcion_estimada"],
        macronutrientes=Macronutriente(**data["macronutrientes"]),
        alertas=[AlertaNutricional(**a) for a in data["alertas"]],
        recomendacion_ia=data["recomendacion_ia"],
        apto_para_condicion=data["apto_para_condicion"],
        alternativas_saludables=data["alternativas_saludables"],
        score_nutricional=data["score_nutricional"]
    )

async def generar_plan_nutricional(request: NutritionPlanRequest) -> NutritionPlanResponse:
    contexto = CONDICIONES.get(request.condicion_medica, f"Usuario con condición: {request.condicion_medica}.")
    preferencias_txt = f"Preferencias: {request.preferencias}" if request.preferencias else ""
    
    prompt = f"""Eres NutriBot, un nutricionista experto. Crea un plan nutricional estructurado.
Contexto mético: {contexto}
{preferencias_txt}
Días a generar: {request.dias}

Responde SOLO con un JSON válido usando este esquema exacto:
{{
  "titulo": "Título atractivo y motivador del plan",
  "advertencias_condicion": "Breve recordatorio médico sobre qué evitar",
  "dias": [
    {{
      "dia": 1,
      "recomendacion_diaria": "Tip principal del día",
      "comidas": [
        {{
          "tipo": "Desayuno",
          "nombre": "Nombre del platillo",
          "descripcion": "Descripción detallada",
          "calorias": 350
        }}
        // (Agrega Almuerzo, Cena, Snack según consideres)
      ]
    }}
  ]
}}
"""
    response = model.generate_content(prompt)
    raw = re.sub(r"```json|```", "", response.text).strip()
    return NutritionPlanResponse(**json.loads(raw))

async def generar_recetas(request: RecipeRequest) -> RecipesResponse:
    contexto = CONDICIONES.get(request.condicion_medica, f"Condición: {request.condicion_medica}.")
    ingredientes_txt = f"Ingredientes disponibles o deseados: {request.ingredientes}" if request.ingredientes else ""

    prompt = f"""Eres NutriBot, un chef y nutricionista experto. Genera 3 recetas para {request.tipo_comida}.
Contexto médico: {contexto}
{ingredientes_txt}

Responde SOLO JSON válido usando este formato exacto:
{{
  "recetas": [
    {{
      "nombre": "Nombre de receta",
      "descripcion": "Breve y atractiva",
      "tiempo_preparacion_min": 15,
      "ingredientes": [
        {{"nombre": "item", "cantidad": "cant"}}
      ],
      "instrucciones": ["paso 1", "paso 2"],
      "tips_saludables": "Consejo"
    }}
  ]
}}
"""
    response = model.generate_content(prompt)
    raw = re.sub(r"```json|```", "", response.text).strip()
    return RecipesResponse(**json.loads(raw))

async def chat_nutribot(request: ChatRequest) -> ChatResponse:
    historial_texto = "\n".join([f"{msg.get('role', 'user')}: {msg.get('content', '')}" for msg in request.historial[-5:]])
    
    prompt = f"""Eres NutriBot, un asistente virtual experto en nutrición, dietética y bienestar. 
Eres empático, directo y coherente. Limítate a temas de salud, alimentación y bienestar.
Si el usuario pregunta algo fuera de lugar o peligroso (como dosis de medicinas o temas no relacionados a nutrición), responde amablemente que solo puedes ayudar con nutrición y marca es_seguro como false.

Historial reciente:
{historial_texto}

Mensaje actual del usuario: "{request.mensaje}"

Responde SOLO en formato JSON válido:
{{
  "respuesta": "Tu respuesta empática y experta en formato texto/markdown",
  "es_seguro": true o false
}}
"""
    response = model.generate_content(prompt)
    raw = re.sub(r"```json|```", "", response.text).strip()
    return ChatResponse(**json.loads(raw))