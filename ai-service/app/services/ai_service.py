import base64
import json
import os
import re
from typing import Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

from app.models.food_scan import AlertaNutricional, FoodScanResponse, Macronutriente
from app.models.nutrition import (
    ChatRequest,
    ChatResponse,
    NutritionPlanRequest,
    NutritionPlanResponse,
    RecipeRequest,
    RecipesResponse,
)

load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("Falta la variable de entorno GEMINI_API_KEY.")

client = genai.Client(api_key=GEMINI_API_KEY)

CONDICIONES = {
    "diabetes": "Usuario con diabetes. Prioriza fibra, proteina magra y carbohidratos de absorcion lenta.",
    "hipertension": "Usuario con hipertension. Prioriza bajo sodio, alimentos frescos y cocciones simples.",
    "colesterol": "Usuario con colesterol alto. Prioriza fibra soluble y grasas saludables.",
    "renal": "Usuario con enfermedad renal. Evita recomendaciones extremas y recuerda seguimiento clinico.",
    "obesidad": "Usuario en control de peso. Prioriza saciedad, balance y habitos sostenibles.",
    "general": "Usuario sin condicion clinica principal. Usa recomendaciones generales de nutricion y bienestar.",
    "ninguna": "Usuario sin condicion clinica principal. Usa recomendaciones generales de nutricion y bienestar.",
    "DIABETES_T2": "Usuario con diabetes tipo 2. Prioriza fibra, proteina magra y carbohidratos de absorcion lenta.",
}


def _clean_json(raw_text: str) -> str:
    cleaned = re.sub(r"```json|```", "", raw_text or "", flags=re.IGNORECASE).strip()
    if not cleaned:
        raise ValueError("Gemini devolvio una respuesta vacia.")
    return cleaned


def _get_contexto(condicion_medica: Optional[str]) -> str:
    if not condicion_medica:
        return CONDICIONES["ninguna"]
    return CONDICIONES.get(condicion_medica, f"Usuario con condicion o preferencia relevante: {condicion_medica}.")


def _generate_json(prompt: str, system_instruction: str, temperature: float = 0.4) -> dict:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            temperature=temperature,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )
    return json.loads(_clean_json(response.text))


async def analizar_imagen(image_base64: str, condicion_medica: str = "ninguna") -> FoodScanResponse:
    contexto = _get_contexto(condicion_medica)
    image_data = base64.b64decode(image_base64)
    image_part = types.Part.from_bytes(data=image_data, mime_type="image/jpeg")

    prompt = f"""
Analiza esta imagen de comida para Nutrex.
Contexto del usuario: {contexto}

Responde solo JSON valido con este esquema exacto:
{{
  "alimento_detectado": "nombre",
  "descripcion": "descripcion breve",
  "porcion_estimada": "ej. 1 plato (~300 g)",
  "macronutrientes": {{
    "calorias": 0,
    "proteinas_g": 0.0,
    "carbohidratos_g": 0.0,
    "grasas_g": 0.0,
    "fibra_g": 0.0,
    "sodio_mg": 0.0,
    "azucares_g": 0.0
  }},
  "alertas": [
    {{"tipo": "ok|advertencia|peligro", "mensaje": "texto"}}
  ],
  "recomendacion_ia": "consejo breve",
  "apto_para_condicion": true,
  "alternativas_saludables": ["opcion1", "opcion2", "opcion3"],
  "score_nutricional": 75
}}
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=[prompt.strip(), image_part],
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )
    data = json.loads(_clean_json(response.text))

    return FoodScanResponse(
        alimento_detectado=data["alimento_detectado"],
        descripcion=data["descripcion"],
        porcion_estimada=data["porcion_estimada"],
        macronutrientes=Macronutriente(**data["macronutrientes"]),
        alertas=[AlertaNutricional(**alerta) for alerta in data["alertas"]],
        recomendacion_ia=data["recomendacion_ia"],
        apto_para_condicion=data["apto_para_condicion"],
        alternativas_saludables=data["alternativas_saludables"],
        score_nutricional=data["score_nutricional"],
    )


async def process_image(file) -> dict:
    content = await file.read()
    return {
        "filename": file.filename,
        "message": "Archivo recibido correctamente.",
        "size": len(content),
    }


async def generar_plan_nutricional(request: NutritionPlanRequest) -> NutritionPlanResponse:
    prompt = f"""
Genera un plan nutricional estructurado para Nutrex.
Contexto del usuario: {_get_contexto(request.condicion_medica)}
Preferencias: {request.preferencias or "Sin preferencias especificas."}
Dias a generar: {request.dias}

Responde solo JSON valido usando este esquema exacto:
{{
  "titulo": "Titulo del plan",
  "advertencias_condicion": "Recordatorio breve y prudente",
  "dias": [
    {{
      "dia": 1,
      "recomendacion_diaria": "Tip principal del dia",
      "comidas": [
        {{
          "tipo": "Desayuno",
          "nombre": "Nombre del platillo",
          "descripcion": "Descripcion detallada",
          "calorias": 350
        }}
      ]
    }}
  ]
}}
"""

    data = _generate_json(
        prompt=prompt.strip(),
        system_instruction=(
            "Eres NutriBot, nutricionista digital de Nutrex. "
            "Crea planes claros, utiles y realistas. "
            "No reemplaces el criterio clinico."
        ),
        temperature=0.5,
    )
    return NutritionPlanResponse(**data)


async def generar_recetas(request: RecipeRequest) -> RecipesResponse:
    prompt = f"""
Genera 3 recetas para Nutrex.
Contexto del usuario: {_get_contexto(request.condicion_medica)}
Tipo de comida: {request.tipo_comida}
Ingredientes disponibles o deseados: {request.ingredientes or "No especificados"}

Responde solo JSON valido con este esquema exacto:
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

    data = _generate_json(
        prompt=prompt.strip(),
        system_instruction=(
            "Eres NutriBot, chef y nutricionista digital de Nutrex. "
            "Propone recetas simples, coherentes con la condicion del usuario y faciles de preparar."
        ),
        temperature=0.6,
    )
    return RecipesResponse(**data)


async def chat_nutribot(request: ChatRequest) -> ChatResponse:
    user_name = (request.user_name or "").strip()
    condiciones = ", ".join(request.user_conditions) if request.user_conditions else "Sin condiciones reportadas"
    historial_texto = "\n".join(
        f"{msg.get('role', 'user')}: {msg.get('content', '')}" for msg in (request.historial or [])[-8:]
    ) or "Sin historial previo."

    prompt = f"""
Nombre del usuario: {user_name or "No especificado"}
Condiciones declaradas: {condiciones}
Historial reciente:
{historial_texto}

Mensaje actual:
{request.mensaje}

Responde solo JSON valido con este esquema exacto:
{{
  "respuesta": "respuesta final en markdown simple",
  "es_seguro": true
}}
"""

    data = _generate_json(
        prompt=prompt.strip(),
        system_instruction=(
            "Eres NutriBot, el asistente de Nutrex. "
            "Tu prioridad es ayudar con nutricion, alimentacion, recetas, habitos saludables, bienestar y preguntas generales. "
            "No saludes usando un nombre propio a menos que el nombre del usuario venga claramente informado y no este vacio. "
            "Si no hay nombre, usa saludos neutrales como 'Hola' o responde directo. "
            "Si el usuario pregunta otros temas generales, puedes responder de forma clara y util. "
            "Si pide diagnosticos, dosis de medicamentos, tratamiento medico, autolesion, instrucciones peligrosas o emergencias, "
            "responde con prudencia, sugiere apoyo profesional y marca es_seguro=false. "
            "No digas que eres medico ni inventes datos clinicos."
        ),
        temperature=0.7,
    )
    return ChatResponse(**data)
