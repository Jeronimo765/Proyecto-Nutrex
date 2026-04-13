import os

import httpx

from app.models.schemas import ChatRequest, ChatResponse


CONDITIONS_CONTEXT = {
    "DIABETES_T2": """
        - Maximo indice glucemico 55
        - Evitar azucares simples y harinas refinadas
        - Preferir fibra, proteinas magras y grasas saludables
        - Maximo 45-60g de carbohidratos por comida
    """,
    "HYPERTENSION": """
        - Maximo 1500mg de sodio al dia
        - Evitar alimentos procesados y embutidos
        - Preferir frutas, verduras y granos enteros
        - Reducir grasas saturadas
    """,
    "HIGH_CHOLESTEROL": """
        - Maximo 10g de grasas saturadas al dia
        - Evitar grasas trans completamente
        - Preferir omega-3 (salmon, nueces, linaza)
        - Aumentar fibra soluble (avena, legumbres)
    """,
    "RENAL_DISEASE": """
        - Maximo 2000mg de potasio al dia
        - Maximo 800mg de fosforo al dia
        - Limitar proteinas animales
        - Evitar lacteos en exceso
    """,
}


class NutribotService:
    def __init__(self):
        api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
        if not api_key or api_key == "tu_api_key_aqui":
            raise ValueError(
                "GEMINI_API_KEY no esta configurada correctamente en ai-service/.env"
            )

        self.api_key = api_key
        self.model = (os.getenv("GEMINI_MODEL") or "gemini-2.5-flash").strip()
        self.endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.model}:generateContent"
        )

    def _build_system_prompt(self, conditions: list[str], user_name: str) -> str:
        conditions_text = ""
        if conditions:
            conditions_text = "\n\nRESTRICCIONES MEDICAS DEL USUARIO:\n"
            for condition in conditions:
                if condition in CONDITIONS_CONTEXT:
                    conditions_text += f"\n{condition}:{CONDITIONS_CONTEXT[condition]}"

        return f"""Eres NutriBot, el asistente nutricional inteligente de Nutrex.
Estas hablando con {user_name}.

TU ROL:
- Eres un nutricionista virtual experto y empatico
- Das recomendaciones personalizadas segun las condiciones medicas del usuario
- Analizas alimentos y explicas su impacto en la salud del usuario
- Sugieres recetas saludables que respetan las restricciones medicas
- Explicas conceptos nutricionales en lenguaje simple y amigable
- Siempre recuerdas que NO reemplazas al medico; complementas su tratamiento

ESTILO:
- Responde siempre en espanol
- Se calido, motivador y positivo
- Usa emojis ocasionalmente para hacer la conversacion mas amena
- Respuestas cortas y directas, maximo 3 parrafos
- Si el usuario pregunta algo fuera de nutricion, redirige amablemente
{conditions_text}

IMPORTANTE: Siempre basa tus recomendaciones en las restricciones medicas del usuario."""

    def chat(self, request: ChatRequest) -> ChatResponse:
        contents = []

        for msg in request.history[-10:]:
            role = "model" if msg.role == "assistant" else "user"
            contents.append(
                {
                    "role": role,
                    "parts": [{"text": msg.content}],
                }
            )

        contents.append(
            {
                "role": "user",
                "parts": [{"text": request.message}],
            }
        )

        payload = {
            "systemInstruction": {
                "parts": [
                    {
                        "text": self._build_system_prompt(
                            request.user_conditions,
                            request.user_name,
                        )
                    }
                ]
            },
            "contents": contents,
            "generationConfig": {
                "maxOutputTokens": 1024,
                "temperature": 1,
            },
        }

        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                self.endpoint,
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": self.api_key,
                },
                json=payload,
            )

        if response.status_code >= 400:
            error_message = response.text
            try:
                error_message = response.json()["error"]["message"]
            except Exception:
                pass
            raise RuntimeError(error_message)

        data = response.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise RuntimeError("Gemini no devolvio candidatos en la respuesta.")

        parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(part.get("text", "") for part in parts).strip()
        if not text:
            raise RuntimeError("Gemini no devolvio texto util.")

        usage = data.get("usageMetadata", {})

        return ChatResponse(
            response=text,
            tokens_used=usage.get("totalTokenCount", 0),
        )
