
def analyze_rotation(data):
    plans = [
        {
            "id": "balanced",
            "title": "Balanced Rotation",
            "crops": [
                "Wheat",
                "Mung bean",
                "Cotton",
                "Alfalfa",
                "Maize"
            ],
            "reasons": [
                "Turli ekin guruhlarini navbatlashtirishga yordam beradi.",
                "Dukkakli ekinlar almashinuvi rejasiga kiritilgan.",
                "Bir nechta ekin turini solishtirish imkonini beradi."
            ],
            "tradeoffs": [
                "Suv va tuproq talablari har bir ekin uchun alohida tekshiriladi."
            ]
        },
        {
            "id": "soil_health",
            "title": "Soil Health Strategy",
            "crops": [
                "Mung bean",
                "Wheat",
                "Chickpea",
                "Alfalfa",
                "Sorghum"
            ],
            "reasons": [
                "Dukkakli ekinlar almashinuvida qatnashadi.",
                "Tuproq holatini uzoq muddat kuzatishga yo‘naltirilgan.",
                "Ekinlar xilma-xilligini oshirishga yordam beradi."
            ],
            "tradeoffs": [
                "Natija tuproq turi, ekin navlari va boshqaruvga bog‘liq."
            ]
        },
        {
            "id": "water_saving",
            "title": "Water Awareness Strategy",
            "crops": [
                "Sorghum",
                "Chickpea",
                "Wheat",
                "Mung bean",
                "Sorghum"
            ],
            "reasons": [
                "Suvga ehtiyoj turlicha bo‘lgan ekinlarni taqqoslash imkonini beradi.",
                "Sug‘orish rejasini alohida baholashga yordam beradi.",
                "Suv resurslarini hisobga olishga yo‘naltirilgan."
            ],
            "tradeoffs": [
                "Haqiqiy suv sarfi nav, mavsum va sug‘orish usuliga bog‘liq."
            ]
        }
    ]

    selected = []

    for plan in plans:
        crops = plan["crops"][:data.years]

        score = 70

        if plan["id"] == data.priority:
            score += 15

        if data.organic_matter < 2:
            if plan["id"] == "soil_health":
                score += 5

        if data.moisture < 20:
            if plan["id"] == "water_saving":
                score += 5

        if data.salinity > 4:
            score -= 5

        if data.ph < 5.5 or data.ph > 8:
            score -= 5

        if data.current_crop.lower() == crops[0].lower():
            score -= 3

        selected.append({
            "id": plan["id"],
            "title": plan["title"],
            "score": min(100, max(0, score)),
            "crops": [
                {
                    "year": index + 1,
                    "crop": crop
                }
                for index, crop in enumerate(crops)
            ],
            "reasons": plan["reasons"],
            "tradeoffs": plan["tradeoffs"]
        })

    selected.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    warnings = []

    if data.salinity > 4:
        warnings.append(
            "Sho‘rlanish yuqori bo‘lishi mumkin. "
            "Laboratoriya natijasi bilan tasdiqlang."
        )

    if data.ph < 5.5 or data.ph > 8:
        warnings.append(
            "Tuproq pH ko‘rsatkichi alohida agronomik baholashni talab qiladi."
        )

    return {
        "status": "success",
        "method": "Rule-based preliminary planning",
        "years": data.years,
        "priority": data.priority,
        "input_summary": {
            "current_crop": data.current_crop,
            "ph": data.ph,
            "organic_matter": data.organic_matter,
            "moisture": data.moisture,
            "salinity": data.salinity
        },
        "plans": selected,
        "warnings": warnings,
        "disclaimer": (
            "Bu dastlabki rejalashtirish namunasi. "
            "Ballar hosildorlik prognozi emas. "
            "Ekin tanlovini mahalliy agronom bilan tekshiring."
        )
    }
