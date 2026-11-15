
def analyze_soil(data):
    score = 100
    recommendations = []
    warnings = []

    # pH screening
    if data.ph < 5.5:
        score -= 15
        recommendations.append(
            "Tuproq kislotali bo‘lishi mumkin. "
            "Laboratoriya tahlili asosida tuzatish choralarini belgilang."
        )
    elif data.ph > 8.0:
        score -= 15
        recommendations.append(
            "Tuproq ishqoriy bo‘lishi mumkin. "
            "Tuproq tarkibini laboratoriyada tekshirtiring."
        )

    # Organic matter
    if data.organic_matter < 1:
        score -= 20
        recommendations.append(
            "Organik modda miqdori past. "
            "Organik modda manbalarini agronom bilan baholang."
        )
    elif data.organic_matter < 2:
        score -= 10
        recommendations.append(
            "Organik modda miqdorini yaxshilash imkoniyatini ko‘rib chiqing."
        )

    # Nitrogen
    if data.nitrogen < 20:
        score -= 10
        recommendations.append(
            "Azot ko‘rsatkichi past bo‘lishi mumkin. "
            "O‘g‘itlashni laboratoriya tavsiyasiga moslang."
        )

    # Phosphorus
    if data.phosphorus < 10:
        score -= 10
        recommendations.append(
            "Fosfor ko‘rsatkichi past bo‘lishi mumkin."
        )

    # Potassium
    if data.potassium < 100:
        score -= 10
        recommendations.append(
            "Kaliy ko‘rsatkichi past bo‘lishi mumkin."
        )

    # Moisture
    if data.moisture < 15:
        score -= 10
        recommendations.append(
            "Tuproq namligi past. Sug‘orish ehtiyojini "
            "ekin va tuproq turiga qarab baholang."
        )
    elif data.moisture > 80:
        score -= 10
        recommendations.append(
            "Namlik yuqori. Drenaj va suv turib qolishi holatini tekshiring."
        )

    # Salinity (EC, dS/m)
    if data.salinity > 4:
        score -= 20
        warnings.append(
            "Sho‘rlanish ko‘rsatkichi yuqori bo‘lishi mumkin. "
            "EC o‘lchov usuli va laboratoriya natijasini tekshiring."
        )
    elif data.salinity > 2:
        score -= 10
        warnings.append(
            "Sho‘rlanish xavfi mavjud. Mahalliy laboratoriya bilan tasdiqlang."
        )

    score = max(0, min(100, score))

    if score >= 80:
        status = "Good"
        summary = "Kiritilgan ko‘rsatkichlar dastlabki baholashda yaxshi."
    elif score >= 60:
        status = "Moderate"
        summary = "Ayrim ko‘rsatkichlarni yaxshilash talab qilinishi mumkin."
    else:
        status = "Needs attention"
        summary = "Bir nechta ko‘rsatkich bo‘yicha qo‘shimcha tekshiruv zarur."

    if not recommendations:
        recommendations.append(
            "Ko‘rsatkichlarda keskin ogohlantirish aniqlanmadi. "
            "Muntazam monitoringni davom ettiring."
        )

    return {
        "score": score,
        "status": status,
        "summary": summary,
        "indicators": {
            "ph": data.ph,
            "organic_matter_percent": data.organic_matter,
            "nitrogen_mg_kg": data.nitrogen,
            "phosphorus_mg_kg": data.phosphorus,
            "potassium_mg_kg": data.potassium,
            "moisture_percent": data.moisture,
            "salinity_ec_ds_m": data.salinity
        },
        "recommendations": recommendations,
        "warnings": warnings
    }
