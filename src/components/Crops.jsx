
import { useEffect, useState } from "react";
import { Sprout, RefreshCw, AlertCircle } from "lucide-react";
import api from "../services/api";

export default function Crops({ language = "UZ" }) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const translations = {
    UZ: {
      title: "Ekinlar bazasi",
      subtitle: "Qishloq xo'jaligi ekinlari ro'yxati",
      loading: "Yuklanmoqda...",
      empty: "Ekinlar topilmadi.",
      retry: "Qayta yuklash"
    },
    EN: {
      title: "Crop Database",
      subtitle: "Agricultural crop collection",
      loading: "Loading...",
      empty: "No crops found.",
      retry: "Reload"
    },
    RU: {
      title: "База культур",
      subtitle: "Список сельскохозяйственных культур",
      loading: "Загрузка...",
      empty: "Культуры не найдены.",
      retry: "Обновить"
    }
  };

  const t = translations[language] || translations.UZ;

  async function loadCrops() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/crops");
      const result = response.data.crops || [];
      setCrops(result);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Ekinlar ro'yxatini yuklab bo'lmadi."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrops();
  }, []);

  const descriptions = {
    "Wheat": "Don ekini",
    "Mung bean": "Dukkakli ekin",
    "Cotton": "Texnik ekin",
    "Alfalfa": "Yem-xashak ekini",
    "Maize": "Don va yem-xashak ekini",
    "Sorghum": "Don ekini",
    "Chickpea": "Dukkakli ekin",
    "Pea": "Dukkakli ekin",
    "Sunflower": "Moyli ekin"
  };

  return (
    <div className="module-page">
      <div className="module-heading">
        <div>
          <h1><Sprout size={27} /> {t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <button onClick={loadCrops} disabled={loading}>
          <RefreshCw size={17} /> {t.retry}
        </button>
      </div>

      {loading && <p>{t.loading}</p>}

      {error && (
        <div className="climate-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {!loading && !error && crops.length === 0 && (
        <p>{t.empty}</p>
      )}

      <div className="crop-grid">
        {crops.map((crop, index) => {
          const name = typeof crop === "string" ? crop : crop.name;

          return (
            <div className="crop-card" key={crop.id || name || index}>
              <div className="crop-icon">
                <Sprout size={27} />
              </div>
              <h3>{name}</h3>
              <p>{descriptions[name] || "Qishloq xo'jaligi ekini"}</p>
              <span>AgroVision AI</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
