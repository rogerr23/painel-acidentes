from fastapi import FastAPI

from backend.app.api.acidentes import router as acidentes_router
from backend.app.api.dashboard import router as dashboard_router


app = FastAPI(
    title="Painel de Acidentes",
    description="API para visualização e análise de acidentes de trânsito.",
    version="0.1.0",
)

app.include_router(acidentes_router)
app.include_router(dashboard_router)
