
from pydantic import BaseModel, Field


class SoilAnalysisRequest(BaseModel):
    ph: float = Field(ge=0, le=14)
    organic_matter: float = Field(ge=0, le=100)
    nitrogen: float = Field(ge=0, le=5000)
    phosphorus: float = Field(ge=0, le=5000)
    potassium: float = Field(ge=0, le=5000)
    moisture: float = Field(ge=0, le=100)
    salinity: float = Field(ge=0, le=100)


class SoilAnalysisResponse(BaseModel):
    score: int
    status: str
    summary: str
    indicators: dict
    recommendations: list[str]
    warnings: list[str]
