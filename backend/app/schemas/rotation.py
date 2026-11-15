
from typing import Literal
from pydantic import BaseModel, Field


class RotationRequest(BaseModel):
    years: int = Field(default=4, ge=3, le=5)

    current_crop: str = "Wheat"

    ph: float = Field(default=7.2, ge=0, le=14)
    organic_matter: float = Field(default=2.5, ge=0, le=100)
    moisture: float = Field(default=30, ge=0, le=100)
    salinity: float = Field(default=1.2, ge=0, le=100)

    priority: Literal[
        "balanced",
        "soil_health",
        "water_saving"
    ] = "balanced"
