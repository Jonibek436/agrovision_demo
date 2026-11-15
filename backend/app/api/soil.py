
from fastapi import APIRouter

from app.schemas.soil import SoilAnalysisRequest
from app.services.soil_service import analyze_soil

router = APIRouter(
    prefix="/api/soil",
    tags=["Soil Analysis"]
)


@router.post("/analyze")
def soil_analysis(data: SoilAnalysisRequest):
    return analyze_soil(data)
