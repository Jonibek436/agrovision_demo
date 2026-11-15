
from fastapi import APIRouter

from app.schemas.rotation import RotationRequest
from app.services.rotation_service import analyze_rotation

router = APIRouter(
    prefix="/api/rotation",
    tags=["Crop Rotation"]
)


@router.post("/recommend")
def recommend_rotation(data: RotationRequest):
    return analyze_rotation(data)
