
from fastapi import APIRouter, HTTPException, Query

from app.services.nasa_service import get_nasa_climate

router = APIRouter(
    prefix="/api/nasa",
    tags=["NASA Data"]
)


@router.get("/climate")
async def climate(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    start: str = Query(..., pattern=r"^\d{8}$"),
    end: str = Query(..., pattern=r"^\d{8}$")
):
    if start > end:
        raise HTTPException(
            status_code=400,
            detail="Start date must not be after end date"
        )

    try:
        return await get_nasa_climate(
            latitude,
            longitude,
            start,
            end
        )
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"NASA data request failed: {str(error)}"
        )
