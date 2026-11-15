
import httpx

NASA_POWER_URL = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
)


async def get_nasa_climate(
    latitude: float,
    longitude: float,
    start: str,
    end: str
):
    params = {
        "parameters": "T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": start,
        "end": end,
        "format": "JSON"
    }

    async with httpx.AsyncClient(timeout=70) as client:
        response = await client.get(
            NASA_POWER_URL,
            params=params
        )
        response.raise_for_status()
        result = response.json()

    properties = result.get("properties", {})

    return {
        "source": "NASA POWER",
        "latitude": latitude,
        "longitude": longitude,
        "period": {
            "start": start,
            "end": end
        },
        "data": properties.get("parameter", {}),
        "metadata": properties.get("parameter", {})
    }
