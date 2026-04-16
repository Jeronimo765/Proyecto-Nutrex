from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routers.food_scan import router as scan_router
from app.routers.nutrition import router as nutrition_router
from app.routers.ai_router import router as ai_router

app = FastAPI(title="Nutrex AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan_router)
app.include_router(nutrition_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"status": "Nutrex AI corriendo"}