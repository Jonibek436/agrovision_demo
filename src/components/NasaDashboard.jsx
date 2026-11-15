
import { useEffect, useState } from "react";
import {
  Satellite,
  Thermometer,
  CloudRain,
  Sun,
  MapPin,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Activity,
  CalendarDays,
  Navigation
} from "lucide-react";

import api from "../services/api";

const styles = {
  panel: {
    background: "#111c2e",
    border: "1px solid #26364d",
    borderRadius: "15px",
    padding: "20px"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    marginTop: "7px",
    background: "#1c2b40",
    color: "#f8fafc",
    border: "1px solid #34445c",
    borderRadius: "8px"
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 18px",
    background: "#16a36a",
    color: "white",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer"
  },
  muted: {
    color: "#91a2b8",
    fontSize: "13px"
  }
};

const translations = {
  uz: {
    title: "NASA Earth Observation",
    subtitle: "NASA POWER orqali tarixiy iqlim ma'lumotlari",
    location: "Hudud joylashuvi",
    latitude: "Kenglik",
    longitude: "Uzunlik",
    gps: "GPS orqali aniqlash",
    gpsLoading: "Joylashuv aniqlanmoqda...",
    gpsSuccess: "GPS joylashuvi muvaffaqiyatli aniqlandi",
    gpsError: "Joylashuvni aniqlab bo'lmadi.",
    gpsDenied: "Joylashuv ruxsati rad etildi. Brauzer sozlamalaridan ruxsat bering.",
    gpsUnavailable: "GPS joylashuvi hozir mavjud emas.",
    gpsTimeout: "Joylashuvni aniqlash vaqti tugadi.",
    gpsUnsupported: "Brauzeringiz GPS funksiyasini qo'llab-quvvatlamaydi.",
    start: "Boshlanish sanasi",
    end: "Tugash sanasi",
    load: "NASA ma'lumotlarini olish",
    loading: "Ma'lumot olinmoqda...",
    temperature: "O'rtacha harorat",
    precipitation: "Jami yog'ingarchilik",
    radiation: "O'rtacha quyosh radiatsiyasi",
    chart: "Kunlik harorat grafigi",
    source: "Ma'lumot manbasi",
    noData: "Tanlangan davr uchun ma'lumot topilmadi.",
    error: "NASA ma'lumotlarini olishda xatolik yuz berdi.",
    success: "NASA ma'lumotlari muvaffaqiyatli olindi",
    info: "Bu tarixiy kunlik ma'lumotlar. Jonli sun'iy yo'ldosh tasviri emas.",
    days: "kun",
    reset: "Qayta yuklash"
  },
  en: {
    title: "NASA Earth Observation",
    subtitle: "Historical climate data through NASA POWER",
    location: "Location",
    latitude: "Latitude",
    longitude: "Longitude",
    gps: "Detect My Location (GPS)",
    gpsLoading: "Detecting location...",
    gpsSuccess: "GPS location detected successfully",
    gpsError: "Unable to detect location.",
    gpsDenied: "Location permission denied. Allow access in browser settings.",
    gpsUnavailable: "Location is currently unavailable.",
    gpsTimeout: "Location request timed out.",
    gpsUnsupported: "Your browser does not support geolocation.",
    start: "Start date",
    end: "End date",
    load: "Get NASA Data",
    loading: "Loading data...",
    temperature: "Average temperature",
    precipitation: "Total precipitation",
    radiation: "Average solar radiation",
    chart: "Daily temperature chart",
    source: "Data source",
    noData: "No data found for this period.",
    error: "Failed to retrieve NASA data.",
    success: "NASA data loaded successfully",
    info: "Historical daily data, not live satellite imagery.",
    days: "days",
    reset: "Reload"
  },
  ru: {
    title: "NASA Earth Observation",
    subtitle: "Исторические климатические данные NASA POWER",
    location: "Местоположение",
    latitude: "Широта",
    longitude: "Долгота",
    gps: "Определить местоположение (GPS)",
    gpsLoading: "Определение местоположения...",
    gpsSuccess: "Местоположение успешно определено",
    gpsError: "Не удалось определить местоположение.",
    gpsDenied: "Доступ к местоположению запрещён. Разрешите его в браузере.",
    gpsUnavailable: "Местоположение сейчас недоступно.",
    gpsTimeout: "Время ожидания определения местоположения истекло.",
    gpsUnsupported: "Ваш браузер не поддерживает геолокацию.",
    start: "Дата начала",
    end: "Дата окончания",
    load: "Получить данные NASA",
    loading: "Загрузка данных...",
    temperature: "Средняя температура",
    precipitation: "Общее количество осадков",
    radiation: "Средняя солнечная радиация",
    chart: "График дневной температуры",
    source: "Источник данных",
    noData: "Данные за выбранный период не найдены.",
    error: "Не удалось получить данные NASA.",
    success: "Данные NASA успешно загружены",
    info: "Исторические дневные данные, не спутниковое видео в реальном времени.",
    days: "дней",
    reset: "Обновить"
  }
};

function average(values) {
  const valid = values.filter(
    value => Number.isFinite(value) && value !== -999
  );

  if (!valid.length) return null;

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function sumValues(values) {
  const valid = values.filter(
    value => Number.isFinite(value) && value !== -999
  );

  if (!valid.length) return null;

  return valid.reduce((sum, value) => sum + value, 0);
}

function getValues(parameter) {
  if (!parameter || typeof parameter !== "object") return {};

  return Object.fromEntries(
    Object.entries(parameter)
      .filter(([, value]) =>
        Number.isFinite(Number(value)) &&
        Number(value) !== -999
      )
      .map(([date, value]) => [date, Number(value)])
  );
}

function MetricCard({ icon: Icon, title, value, unit, color }) {
  return (
    <div style={styles.panel}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <span style={styles.muted}>{title}</span>
        <Icon size={24} color={color} />
      </div>

      <div style={{
        color: "#f8fafc",
        fontSize: "29px",
        fontWeight: "bold",
        marginTop: "18px"
      }}>
        {value}
        <span style={{
          color: "#91a2b8",
          fontSize: "13px",
          marginLeft: "6px"
        }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function NasaDashboard({ language = "uz" }) {
  const t = translations[language] || translations.uz;

  const [latitude, setLatitude] = useState("41.2995");
  const [longitude, setLongitude] = useState("69.2401");

  const [start, setStart] = useState("2025-01-01");
  const [end, setEnd] = useState("2025-01-31");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState("");
  const [gpsError, setGpsError] = useState("");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  async function loadData(customLatitude, customLongitude) {
    const lat = Number(customLatitude ?? latitude);
    const lon = Number(customLongitude ?? longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      setError("Koordinatalar noto'g'ri kiritilgan.");
      return;
    }

    if (!start || !end || start > end) {
      setError("Sanalarni to'g'ri tanlang.");
      return;
    }

    setLoading(true);
    setError("");
    setLoaded(false);

    try {
      const response = await api.get("/api/nasa/climate", {
        params: {
          latitude: lat,
          longitude: lon,
          start: start.replaceAll("-", ""),
          end: end.replaceAll("-", "")
        }
      });

      const parameters =
        response.data?.data ||
        response.data?.properties?.parameter ||
        {};

      const temperature = getValues(parameters.T2M);
      const precipitation = getValues(parameters.PRECTOTCORR);
      const radiation = getValues(parameters.ALLSKY_SFC_SW_DWN);

      const dates = Object.keys(temperature).sort();

      const result = {
        temperature,
        precipitation,
        radiation,
        dates,
        averageTemperature: average(Object.values(temperature)),
        totalPrecipitation: sumValues(Object.values(precipitation)),
        averageRadiation: average(Object.values(radiation)),
        source: response.data?.source || "NASA POWER"
      };

      if (!dates.length) {
        throw new Error(t.noData);
      }

      setData(result);
      setLoaded(true);

    } catch (err) {
      setData(null);
      setError(
        err.response?.data?.detail ||
        err.message ||
        t.error
      );
    } finally {
      setLoading(false);
    }
  }

  function detectGPS() {
    setGpsError("");
    setGpsMessage("");

    if (!navigator.geolocation) {
      setGpsError(t.gpsUnsupported);
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lon = position.coords.longitude.toFixed(5);

        setLatitude(lat);
        setLongitude(lon);
        setGpsLoading(false);
        setGpsMessage(t.gpsSuccess);

        await loadData(lat, lon);
      },
      (err) => {
        setGpsLoading(false);

        switch (err.code) {
          case 1:
            setGpsError(t.gpsDenied);
            break;
          case 2:
            setGpsError(t.gpsUnavailable);
            break;
          case 3:
            setGpsError(t.gpsTimeout);
            break;
          default:
            setGpsError(t.gpsError);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  useEffect(() => {
    loadData();
  }, []);

  const chartDates = data?.dates.slice(-14) || [];

  const chartValues = chartDates.map(date => ({
    date,
    value: data.temperature[date]
  }));

  const minTemp = chartValues.length
    ? Math.min(...chartValues.map(item => item.value))
    : 0;

  const maxTemp = chartValues.length
    ? Math.max(...chartValues.map(item => item.value))
    : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px"
      }}>
        <div style={{
          background: "#123b32",
          padding: "13px",
          borderRadius: "13px"
        }}>
          <Satellite color="#22c987" size={30} />
        </div>

        <div>
          <h2 style={{ color: "#f8fafc", margin: 0 }}>
            {t.title}
          </h2>
          <p style={{ ...styles.muted, marginTop: "6px" }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      <div style={styles.panel}>
        <h3 style={{ color: "#f8fafc", marginTop: 0 }}>
          <MapPin size={19} style={{ marginRight: "8px" }} />
          {t.location}
        </h3>

        <button
          onClick={detectGPS}
          disabled={gpsLoading || loading}
          style={{
            ...styles.button,
            marginBottom: "18px",
            opacity: gpsLoading || loading ? 0.65 : 1
          }}
        >
          <Navigation size={17} />
          {gpsLoading ? t.gpsLoading : t.gps}
        </button>

        {gpsMessage && (
          <p style={{ color: "#22c987", fontSize: "13px" }}>
            <CheckCircle size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {gpsMessage}
          </p>
        )}

        {gpsError && (
          <p style={{ color: "#fca5a5", fontSize: "13px" }}>
            <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
            {gpsError}
          </p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px"
        }}>
          <label style={styles.label}>
            {t.latitude}
            <input
              style={styles.input}
              type="number"
              step="0.00001"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            {t.longitude}
            <input
              style={styles.input}
              type="number"
              step="0.00001"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            {t.start}
            <input
              style={styles.input}
              type="date"
              value={start}
              onChange={e => setStart(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            {t.end}
            <input
              style={styles.input}
              type="date"
              value={end}
              onChange={e => setEnd(e.target.value)}
            />
          </label>
        </div>

        <button
          onClick={() => loadData()}
          disabled={loading}
          style={{
            ...styles.button,
            marginTop: "20px",
            opacity: loading ? 0.65 : 1
          }}
        >
          <RefreshCw size={17} />
          {loading ? t.loading : t.load}
        </button>
      </div>

      {error && (
        <div style={{
          ...styles.panel,
          borderColor: "#7f3030",
          color: "#fca5a5"
        }}>
          <AlertTriangle size={20} />
          <p>{error}</p>
        </div>
      )}

      {loaded && data && (
        <>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#22c987",
            fontSize: "13px"
          }}>
            <CheckCircle size={17} />
            {t.success}
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "15px"
          }}>
            <MetricCard
              icon={Thermometer}
              title={t.temperature}
              value={data.averageTemperature === null ? "—" : data.averageTemperature.toFixed(1)}
              unit="°C"
              color="#f59e0b"
            />

            <MetricCard
              icon={CloudRain}
              title={t.precipitation}
              value={data.totalPrecipitation === null ? "—" : data.totalPrecipitation.toFixed(1)}
              unit="mm"
              color="#60a5fa"
            />

            <MetricCard
              icon={Sun}
              title={t.radiation}
              value={data.averageRadiation === null ? "—" : data.averageRadiation.toFixed(2)}
              unit="kWh/m²/day"
              color="#facc15"
            />
          </div>

          <div style={styles.panel}>
            <h3 style={{ color: "#f8fafc" }}>
              <Activity size={19} style={{ marginRight: "8px" }} />
              {t.chart}
            </h3>

            <p style={styles.muted}>
              Oxirgi {chartDates.length} kun ko'rsatilmoqda
            </p>

            {chartValues.length > 0 && (
              <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                height: "210px",
                overflowX: "auto",
                padding: "15px 4px 0"
              }}>
                {chartValues.map(item => {
                  const height = maxTemp === minTemp
                    ? 55
                    : 35 + (
                      (item.value - minTemp) /
                      (maxTemp - minTemp)
                    ) * 125;

                  return (
                    <div
                      key={item.date}
                      title={`${item.date}: ${item.value} °C`}
                      style={{
                        minWidth: "25px",
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "7px"
                      }}
                    >
                      <span style={{ color: "#cbd5e1", fontSize: "10px" }}>
                        {item.value.toFixed(0)}°
                      </span>

                      <div style={{
                        height: `${height}px`,
                        width: "100%",
                        maxWidth: "35px",
                        background: "linear-gradient(180deg, #22c987, #087b58)",
                        borderRadius: "6px 6px 0 0"
                      }} />

                      <span style={{ color: "#91a2b8", fontSize: "10px" }}>
                        {item.date.slice(6, 8)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={styles.panel}>
            <h3 style={{ color: "#f8fafc" }}>
              <CalendarDays size={19} style={{ marginRight: "8px" }} />
              Ma'lumotlar tafsiloti
            </h3>

            <p style={styles.muted}>Davr: {start} — {end}</p>
            <p style={styles.muted}>Koordinatalar: {latitude}, {longitude}</p>
            <p style={styles.muted}>Olingan kunlar: {data.dates.length}</p>
            <p style={styles.muted}>Manba: {data.source}</p>
          </div>
        </>
      )}

      <div style={{
        ...styles.panel,
        borderColor: "#245b4b"
      }}>
        <h3 style={{ color: "#22c987" }}>
          <Satellite size={19} style={{ marginRight: "8px" }} />
          {t.source}
        </h3>

        <p style={styles.muted}>{t.info}</p>

        <a
          href="https://power.larc.nasa.gov/"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#22c987",
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            textDecoration: "none"
          }}
        >
          NASA POWER <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
}
