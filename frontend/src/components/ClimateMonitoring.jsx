
import { useEffect, useState } from "react";
import {
  CloudSun, Thermometer, Droplets, Sun,
  RefreshCw, MapPin, AlertTriangle
} from "lucide-react";
import api from "../services/api";

export default function ClimateMonitoring({ language = "uz" }) {
  const [latitude, setLatitude] = useState("41.2995");
  const [longitude, setLongitude] = useState("69.2401");
  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState("2025-01-31");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const words = {
    uz: {
      title: "Iqlim monitoringi",
      desc: "NASA POWER tarixiy iqlim ma'lumotlari",
      lat: "Kenglik", lon: "Uzunlik",
      start: "Boshlanish sanasi", end: "Tugash sanasi",
      load: "Ma'lumotlarni yuklash",
      temp: "O'rtacha harorat", rain: "Yog'ingarchilik",
      sun: "Quyosh radiatsiyasi", chart: "Harorat ko'rsatkichlari",
      source: "Ma'lumot manbasi: NASA POWER",
      loading: "Ma'lumotlar yuklanmoqda...",
      empty: "Ma'lumot topilmadi",
      error: "Ma'lumotlarni yuklashda xatolik yuz berdi."
    },
    en: {
      title: "Climate Monitoring",
      desc: "Historical climate data from NASA POWER",
      lat: "Latitude", lon: "Longitude",
      start: "Start date", end: "End date",
      load: "Load data",
      temp: "Average temperature", rain: "Precipitation",
      sun: "Solar radiation", chart: "Temperature indicators",
      source: "Data source: NASA POWER",
      loading: "Loading data...",
      empty: "No data found",
      error: "Failed to load climate data."
    },
    ru: {
      title: "Мониторинг климата",
      desc: "Исторические климатические данные NASA POWER",
      lat: "Широта", lon: "Долгота",
      start: "Начальная дата", end: "Конечная дата",
      load: "Загрузить данные",
      temp: "Средняя температура", rain: "Осадки",
      sun: "Солнечная радиация", chart: "Показатели температуры",
      source: "Источник данных: NASA POWER",
      loading: "Загрузка данных...",
      empty: "Данные не найдены",
      error: "Не удалось загрузить климатические данные."
    }
  };

  const t = words[language] || words.uz;

  async function loadClimate() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/nasa/climate", {
        params: {
          latitude: Number(latitude),
          longitude: Number(longitude),
          start: start.replaceAll("-", ""),
          end: end.replaceAll("-", "")
        }
      });

      setData(response.data.data || {});
    } catch (err) {
      console.error(err);
      setData(null);
      setError(err.response?.data?.detail || t.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClimate();
  }, []);

  const getValues = (key) => {
    const values = data?.[key] || {};
    return Object.values(values)
      .map(Number)
      .filter(v => Number.isFinite(v) && v > -900);
  };

  const average = (values) =>
    values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null;

  const temperatures = getValues("T2M");
  const rainfall = getValues("PRECTOTCORR");
  const radiation = getValues("ALLSKY_SFC_SW_DWN");

  const avgTemp = average(temperatures);
  const totalRain = rainfall.length
    ? rainfall.reduce((a, b) => a + b, 0)
    : null;
  const avgRadiation = average(radiation);

  const chartValues = temperatures.slice(-14);
  const maxTemp = Math.max(...chartValues, 1);

  const cardStyle = {
    background: "#172033",
    border: "1px solid #29364d",
    borderRadius: "16px",
    padding: "20px",
    color: "#f8fafc"
  };

  const inputStyle = {
    width: "100%",
    padding: "11px",
    borderRadius: "9px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    marginTop: "7px",
    boxSizing: "border-box"
  };

  return (
    <div style={{ color: "#f8fafc", padding: "10px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "27px", marginBottom: "7px" }}>
          <CloudSun size={27} style={{ verticalAlign: "middle" }} /> {t.title}
        </h1>
        <p style={{ color: "#94a3b8" }}>{t.desc}</p>
      </div>

      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h3><MapPin size={18} /> Hudud va vaqt oralig'i</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "14px"
        }}>
          <label>{t.lat}
            <input style={inputStyle} type="number" step="any"
              value={latitude}
              onChange={e => setLatitude(e.target.value)} />
          </label>

          <label>{t.lon}
            <input style={inputStyle} type="number" step="any"
              value={longitude}
              onChange={e => setLongitude(e.target.value)} />
          </label>

          <label>{t.start}
            <input style={inputStyle} type="date"
              value={start}
              onChange={e => setStart(e.target.value)} />
          </label>

          <label>{t.end}
            <input style={inputStyle} type="date"
              value={end}
              onChange={e => setEnd(e.target.value)} />
          </label>
        </div>

        <button onClick={loadClimate} disabled={loading}
          style={{
            marginTop: "18px", padding: "12px 20px",
            border: 0, borderRadius: "9px",
            background: "#16a34a", color: "white",
            cursor: "pointer", fontWeight: "bold"
          }}>
          <RefreshCw size={16} style={{ verticalAlign: "middle" }} />
          {" "}{loading ? t.loading : t.load}
        </button>
      </div>

      {error && (
        <div style={{
          ...cardStyle, marginBottom: "18px",
          color: "#fca5a5"
        }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {loading && <p>{t.loading}</p>}

      {data && !loading && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: "15px",
            marginBottom: "20px"
          }}>
            <div style={cardStyle}>
              <Thermometer color="#f97316" size={25} />
              <p style={{ color: "#94a3b8" }}>{t.temp}</p>
              <h2>{avgTemp === null ? "--" : `${avgTemp.toFixed(1)} °C`}</h2>
            </div>

            <div style={cardStyle}>
              <Droplets color="#38bdf8" size={25} />
              <p style={{ color: "#94a3b8" }}>{t.rain}</p>
              <h2>{totalRain === null ? "--" : `${totalRain.toFixed(1)} mm`}</h2>
            </div>

            <div style={cardStyle}>
              <Sun color="#facc15" size={25} />
              <p style={{ color: "#94a3b8" }}>{t.sun}</p>
              <h2>{avgRadiation === null ? "--" : avgRadiation.toFixed(2)}</h2>
              <small style={{ color: "#94a3b8" }}>NASA POWER birliklari</small>
            </div>
          </div>

          <div style={cardStyle}>
            <h3>{t.chart}</h3>

            {chartValues.length ? (
              <div style={{
                display: "flex", alignItems: "end",
                gap: "8px", height: "190px",
                paddingTop: "20px"
              }}>
                {chartValues.map((value, index) => (
                  <div key={index} title={`${value.toFixed(1)} °C`}
                    style={{
                      flex: 1,
                      height: `${Math.max(8, (value / maxTemp) * 140)}px`,
                      background: "linear-gradient(#38bdf8,#2563eb)",
                      borderRadius: "6px 6px 0 0",
                      minWidth: "5px"
                    }} />
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8" }}>{t.empty}</p>
            )}

            <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "15px" }}>
              {t.source}. Bu tarixiy ma'lumotlar bo'lib, real vaqt ob-havo prognozi emas.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
