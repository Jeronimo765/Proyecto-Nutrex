from pydantic import BaseModel
from typing import Optional, List

class FoodScanRequest(BaseModel):
    image_base64: str
    condicion_medica: Optional[str] = "ninguna"

class Macronutriente(BaseModel):
    calorias: int
    proteinas_g: float
    carbohidratos_g: float
    grasas_g: float
    fibra_g: float
    sodio_mg: float
    azucares_g: float

class AlertaNutricional(BaseModel):
    tipo: str
    mensaje: str

class FoodScanResponse(BaseModel):
    alimento_detectado: str
    descripcion: str
    porcion_estimada: str
    macronutrientes: Macronutriente
    alertas: List[AlertaNutricional]
    recomendacion_ia: str
    apto_para_condicion: bool
    alternativas_saludables: List[str]
    score_nutricional: int