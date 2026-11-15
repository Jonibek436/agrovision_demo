
import { useState } from "react";
import {
  Brain,
  Sprout,
  Droplets,
  Leaf,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  BarChart3
} from "lucide-react";

import api from "../services/api";

const translations = {
  UZ: {
    title: "Aqlli ekin almashinuvi",
    subtitle: "Tuproq holati va fermer ustuvorliklari asosida ekin rejasini tahlil qiling.",
    years: "Rejalashtirish davri",
    current: "Hozirgi ekin",
    ph: "Tuproq pH",
    organic: "Organik modda (%)",
    moisture: "Tuproq namligi (%)",
    salinity: "Sho‘rlanish (EC dS/m)",
    priority: "Asosiy ustuvorlik",
    balanced: "Muvozanatli reja",
    soil_health: "Tuproq salomatligi",
    water_saving: "Suvni tejash",
    analyze: "Ekin rejasini tahlil qilish",
    loading: "Tahlil qilinmoqda...",
    results: "Tahlil natijalari",
    score: "Dastlabki ball",
    reasons: "Afzalliklari",
    tradeoffs: "E'tibor berish kerak",
    warnings: "Ogohlantirishlar",
    disclaimer: "Muhim eslatma",
    error: "Tahlilni bajarib bo‘lmadi. Backend server ishlayotganini tekshiring.",
    year: "Yil",
    noWarnings: "Hozircha ogohlantirish yo‘q.",
    selectCrop: "Ekinni tanlang",
    plans: "Tavsiya etilgan rejalar",
    method: "Tahlil usuli"
  },
  EN: {
    title: "Smart Crop Rotation",
    subtitle: "Explore crop rotation plans based on soil indicators and farmer priorities.",
    years: "Planning period",
    current: "Current crop",
    ph: "Soil pH",
    organic: "Organic matter (%)",
    moisture: "Soil moisture (%)",
    salinity: "Salinity (EC dS/m)",
    priority: "Main priority",
    balanced: "Balanced plan",
    soil_health: "Soil health",
    water_saving: "Water awareness",
    analyze: "Analyze crop plan",
    loading: "Analyzing...",
    results: "Analysis results",
    score: "Preliminary score",
    reasons: "Benefits",
    tradeoffs: "Things to consider",
    warnings: "Warnings",
    disclaimer: "Important note",
    error: "Analysis failed. Check whether the backend is running.",
    year: "Year",
    noWarnings: "No warnings at this stage.",
    selectCrop: "Select crop",
    plans: "Suggested plans",
    method: "Analysis method"
  },
  RU: {
    title: "Умный севооборот",
    subtitle: "Изучите варианты севооборота с учетом почвы и приоритетов фермера.",
    years: "Период планирования",
    current: "Текущая культура",
    ph: "pH почвы",
    organic: "Органическое вещество (%)",
    moisture: "Влажность почвы (%)",
    salinity: "Засоленность (EC dS/m)",
    priority: "Главный приоритет",
    balanced: "Сбалансированный план",
    soil_health: "Здоровье почвы",
    water_saving: "Экономия воды",
    analyze: "Анализировать план",
    loading: "Анализ...",
    results: "Результаты анализа",
    score: "Предварительный балл",
    reasons: "Преимущества",
    tradeoffs: "Что учитывать",
    warnings: "Предупреждения",
    disclaimer: "Важное примечание",
    error: "Не удалось выполнить анализ. Проверьте сервер.",
    year: "Год",
    noWarnings: "На данном этапе предупреждений нет.",
    selectCrop: "Выберите культуру",
    plans: "Предлагаемые планы",
    method: "Метод анализа"
  }
};

const crops = [
  "Wheat",
  "Mung bean",
  "Cotton",
  "Alfalfa",
  "Maize",
  "Sorghum",
  "Chickpea",
  "Pea",
  "Sunflower"
];

const cropNames = {
  UZ: {
    "Wheat": "Bug‘doy",
    "Mung bean": "Mosh",
    "Cotton": "Paxta",
    "Alfalfa": "Beda",
    "Maize": "Makkajo‘xori",
    "Sorghum": "Jo‘xori",
    "Chickpea": "No‘xat",
    "Pea": "Ko‘k no‘xat",
    "Sunflower": "Kungaboqar"
  },
  EN: {},
  RU: {
    "Wheat": "Пшеница",
    "Mung bean": "Маш",
    "Cotton": "Хлопок",
    "Alfalfa": "Люцерна",
    "Maize": "Кукуруза",
    "Sorghum": "Сорго",
    "Chickpea": "Нут",
    "Pea": "Горох",
    "Sunflower": "Подсолнечник"
  }
};

const styles = {
  card: {
    background: "var(--card, #151d2e)",
    border: "1px solid var(--border, #26334a)",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "20px"
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "var(--muted, #9ca9bd)",
    marginBottom: "8px"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "9px",
    border: "1px solid var(--border, #34415a)",
    background: "var(--input, #101827)",
    color: "var(--text, #ffffff)",
    outline: "none",
    fontSize: "14px"
  },
  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#16a36a",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "18px"
  },
  muted: {
    color: "var(--muted, #9ca9bd)",
    fontSize: "13px"
  }
};

export default function RotationAdvisor({ language = "UZ" }) {
  const lang = translations[language] || translations.UZ;

  const [form, setForm] = useState({
    years: 4,
    current_crop: "Wheat",
    ph: 7.2,
    organic_matter: 2.5,
    moisture: 30,
    salinity: 1.2,
    priority: "balanced"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  async function analyzeRotation(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/api/rotation/recommend", {
        years: Number(form.years),
        current_crop: form.current_crop,
        ph: Number(form.ph),
        organic_matter: Number(form.organic_matter),
        moisture: Number(form.moisture),
        salinity: Number(form.salinity),
        priority: form.priority
      });

      setResult(response.data);
    } catch (err) {
      console.error("Rotation API error:", err);
      setError(
        err.response?.data?.detail ||
        lang.error
      );
    } finally {
      setLoading(false);
    }
  }

  function displayCrop(crop) {
    return cropNames[language]?.[crop] || crop;
  }

  return (
    <div style={{ width: "100%", color: "var(--text, #ffffff)" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "24px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "13px",
          background: "rgba(22,163,106,0.15)",
          display: "grid",
          placeItems: "center"
        }}>
          <Brain size={26} color="#16c784" />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: "23px" }}>
            {lang.title}
          </h2>
          <p style={{
            ...styles.muted,
            margin: "6px 0 0"
          }}>
            {lang.subtitle}
          </p>
        </div>
      </div>

      <form onSubmit={analyzeRotation}>
        <div style={styles.card}>
          <h3 style={{
            marginTop: 0,
            display: "flex",
            alignItems: "center",
            gap: "9px"
          }}>
            <Sprout color="#16c784" size={20} />
            {lang.title}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "18px"
          }}>
            <div>
              <label style={styles.label}>{lang.years}</label>
              <select
                style={styles.input}
                value={form.years}
                onChange={(e) => updateField("years", e.target.value)}
              >
                {[3, 4, 5].map((year) => (
                  <option key={year} value={year}>
                    {year} {lang.year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>{lang.current}</label>
              <select
                style={styles.input}
                value={form.current_crop}
                onChange={(e) => updateField("current_crop", e.target.value)}
              >
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {displayCrop(crop)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>{lang.ph}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={form.ph}
                onChange={(e) => updateField("ph", e.target.value)}
                required
              />
            </div>

            <div>
              <label style={styles.label}>{lang.organic}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.organic_matter}
                onChange={(e) => updateField("organic_matter", e.target.value)}
                required
              />
            </div>

            <div>
              <label style={styles.label}>{lang.moisture}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.moisture}
                onChange={(e) => updateField("moisture", e.target.value)}
                required
              />
            </div>

            <div>
              <label style={styles.label}>{lang.salinity}</label>
              <input
                style={styles.input}
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.salinity}
                onChange={(e) => updateField("salinity", e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={styles.label}>{lang.priority}</label>
              <select
                style={styles.input}
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
              >
                <option value="balanced">{lang.balanced}</option>
                <option value="soil_health">{lang.soil_health}</option>
                <option value="water_saving">{lang.water_saving}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.65 : 1,
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? (
              <>
                <RefreshCw
                  size={17}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: "8px"
                  }}
                />
                {lang.loading}
              </>
            ) : (
              <>
                <Brain
                  size={17}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: "8px"
                  }}
                />
                {lang.analyze}
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          ...styles.card,
          borderColor: "#dc5656",
          color: "#ff8585"
        }}>
          <AlertTriangle
            size={20}
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {error}
        </div>
      )}

      {result && (
        <div>
          <h3 style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            marginBottom: "18px"
          }}>
            <BarChart3 color="#16c784" />
            {lang.results}
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "20px"
          }}>
            {result.plans?.map((plan, index) => (
              <div
                key={plan.id}
                style={{
                  ...styles.card,
                  borderColor: index === 0 ? "#16a36a" : undefined
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <strong>{plan.title}</strong>
                  {index === 0 && (
                    <CheckCircle size={19} color="#16c784" />
                  )}
                </div>

                <div style={{
                  fontSize: "34px",
                  fontWeight: "800",
                  color: "#16c784",
                  margin: "15px 0 5px"
                }}>
                  {plan.score}
                  <span style={{ fontSize: "14px", color: "var(--muted, #9ca9bd)" }}>
                    /100
                  </span>
                </div>

                <div style={{
                  height: "7px",
                  borderRadius: "10px",
                  background: "var(--border, #26334a)",
                  overflow: "hidden",
                  marginBottom: "17px"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${plan.score}%`,
                    background: "#16c784",
                    borderRadius: "10px"
                  }} />
                </div>

                <p style={styles.muted}>{lang.score}</p>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  marginTop: "15px"
                }}>
                  {plan.crops?.map((item) => (
                    <div
                      key={item.year}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        background: "var(--input, #101827)",
                        borderRadius: "8px"
                      }}
                    >
                      <span style={{
                        color: "#16c784",
                        fontSize: "12px",
                        fontWeight: "700"
                      }}>
                        {lang.year} {item.year}
                      </span>
                      <ChevronRight size={15} color="#7f8da5" />
                      <strong style={{ fontSize: "13px" }}>
                        {displayCrop(item.crop)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "18px" }}>
                  <strong style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "13px"
                  }}>
                    <Leaf size={16} color="#16c784" />
                    {lang.reasons}
                  </strong>

                  {plan.reasons?.map((reason, i) => (
                    <p key={i} style={styles.muted}>
                      • {reason}
                    </p>
                  ))}
                </div>

                <div style={{ marginTop: "16px" }}>
                  <strong style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "13px"
                  }}>
                    <Droplets size={16} color="#e6b84c" />
                    {lang.tradeoffs}
                  </strong>

                  {plan.tradeoffs?.map((item, i) => (
                    <p key={i} style={styles.muted}>
                      • {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <h4 style={{ marginTop: 0 }}>
              <AlertTriangle
                size={18}
                color="#e6b84c"
                style={{ verticalAlign: "middle", marginRight: "8px" }}
              />
              {lang.warnings}
            </h4>

            {result.warnings?.length > 0 ? (
              result.warnings.map((warning, index) => (
                <p key={index} style={styles.muted}>
                  • {warning}
                </p>
              ))
            ) : (
              <p style={styles.muted}>{lang.noWarnings}</p>
            )}

            <div style={{
              borderTop: "1px solid var(--border, #26334a)",
              paddingTop: "14px",
              marginTop: "15px"
            }}>
              <strong>{lang.disclaimer}</strong>
              <p style={styles.muted}>{result.disclaimer}</p>
              <p style={styles.muted}>
                {lang.method}: {result.method}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
