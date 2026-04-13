from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import chat, food_analyzer

# Carga las variables del archivo .env
load_dotenv()

app = FastAPI(
    title="Nutrex AI Service",
    description="NutriBot — Asistente nutricional con IA",
    version="1.0.0"
)

# Permite que Angular se comunique con este servicio
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Registra los routers
app.include_router(chat.router,         prefix="/api")
app.include_router(food_analyzer.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Nutrex AI Service corriendo ✅", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}