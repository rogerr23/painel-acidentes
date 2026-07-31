from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.acidentes import router as acidentes_router
from backend.app.api.dashboard import router as dashboard_router
from backend.app.settings import settings


app = FastAPI(
    title="Painel de Acidentes",
    description="API para visualização e análise de acidentes de trânsito.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(acidentes_router)
app.include_router(dashboard_router)
