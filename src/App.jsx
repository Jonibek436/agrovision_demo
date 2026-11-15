
import { useState, useEffect } from "react";

import {
  LayoutDashboard,
  Sprout,
  Satellite,
  FlaskConical,
  CloudSun,
  FileText,
  Settings,
  Menu,
  Bell,
  MapPin,
  RefreshCw,
  Activity,
  ChevronRight,
  Users,
  BarChart3,
  Leaf,
  X,
  Brain
} from "lucide-react";

import api from "./services/api";

import FarmersFields from "./components/FarmersFields";
import RotationAdvisor from "./components/RotationAdvisor";
import Reports from "./components/Reports";
import Crops from "./components/Crops";
import NasaDashboard from "./components/NasaDashboard";
import ClimateMonitoring from "./components/ClimateMonitoring";
import SettingsPage from "./components/Settings";

import "./App.css";

const translations = {
  uz: {
    dashboard: "Bosh sahifa",
    nasa: "NASA ma'lumotlari",
    soil: "Tuproq tahlili",
    farmer: "Fermerlar",
    fields: "Maydonlar",
    crops: "Ekinlar",
    climate: "Iqlim monitoringi",
    rotation: "Ekin almashinuvi",
    reports: "Hisobotlar",
    settings: "Sozlamalar",
    welcome: "AgroVision AI platformasiga xush kelibsiz",
    subtitle: "Aqlli qishloq xo'jaligi boshqaruv tizimi",
    online: "Tizim faol",
    offline: "Tizim bilan aloqa yo'q",
    loading: "Yuklanmoqda...",
    comingSoon: "Ushbu bo'lim tayyorlanmoqda",
    totalFields: "Jami maydonlar",
    totalFarmers: "Jami fermerlar",
    cropTypes: "Ekin turlari",
    systemStatus: "Tizim holati",
    quickAccess: "Tezkor bo'limlar",
    recentActivity: "So'nggi faoliyat",
    refresh: "Yangilash",
    hectares: "gektar",
    description: "NASA sun'iy yo'ldosh ma'lumotlari va AI asosidagi tahlil platformasi",
    soilDescription: "Tuproq tarkibi va unumdorligini baholash",
    climateDescription: "Tarixiy iqlim ko'rsatkichlarini kuzatish",
    cropsDescription: "Qishloq xo'jaligi ekinlari katalogi",
    rotationDescription: "Ekin almashinuvi variantlarini tahlil qilish",
    farmersDescription: "Fermerlar va yer maydonlarini boshqarish",
    reportsDescription: "Loyiha bo'yicha statistik hisobotlar"
  },

  en: {
    dashboard: "Dashboard",
    nasa: "NASA Data",
    soil: "Soil Analysis",
    farmer: "Farmers",
    fields: "Fields",
    crops: "Crops",
    climate: "Climate Monitoring",
    rotation: "Crop Rotation",
    reports: "Reports",
    settings: "Settings",
    welcome: "Welcome to AgroVision AI",
    subtitle: "Smart Agriculture Management Platform",
    online: "System Online",
    offline: "System Offline",
    loading: "Loading...",
    comingSoon: "This section is under development",
    totalFields: "Total Fields",
    totalFarmers: "Total Farmers",
    cropTypes: "Crop Types",
    systemStatus: "System Status",
    quickAccess: "Quick Access",
    recentActivity: "Recent Activity",
    refresh: "Refresh",
    hectares: "hectares",
    description: "Satellite data and AI-powered agriculture platform",
    soilDescription: "Analyze soil composition and fertility",
    climateDescription: "Monitor historical climate data",
    cropsDescription: "Agricultural crop catalog",
    rotationDescription: "Analyze crop rotation strategies",
    farmersDescription: "Manage farmers and fields",
    reportsDescription: "Project statistics and reports"
  },

  ru: {
    dashboard: "Главная",
    nasa: "Данные NASA",
    soil: "Анализ почвы",
    farmer: "Фермеры",
    fields: "Поля",
    crops: "Культуры",
    climate: "Мониторинг климата",
    rotation: "Севооборот",
    reports: "Отчёты",
    settings: "Настройки",
    welcome: "Добро пожаловать в AgroVision AI",
    subtitle: "Умная платформа сельского хозяйства",
    online: "Система активна",
    offline: "Система недоступна",
    loading: "Загрузка...",
    comingSoon: "Раздел находится в разработке",
    totalFields: "Всего полей",
    totalFarmers: "Всего фермеров",
    cropTypes: "Виды культур",
    systemStatus: "Статус системы",
    quickAccess: "Быстрый доступ",
    recentActivity: "Последняя активность",
    refresh: "Обновить",
    hectares: "гектаров",
    description: "Платформа сельского хозяйства на основе NASA и AI",
    soilDescription: "Анализ состава и плодородия почвы",
    climateDescription: "Мониторинг исторических климатических данных",
    cropsDescription: "Каталог сельскохозяйственных культур",
    rotationDescription: "Анализ вариантов севооборота",
    farmersDescription: "Управление фермерами и полями",
    reportsDescription: "Статистика и отчёты проекта"
  }
};

const navigation = [
  { id: "dashboard", label: "dashboard", icon: LayoutDashboard },
  { id: "nasa", label: "nasa", icon: Satellite },
  { id: "soil", label: "soil", icon: FlaskConical },
  { id: "farmer", label: "farmer", icon: Users },
  { id: "fields", label: "fields", icon: MapPin },
  { id: "crops", label: "crops", icon: Sprout },
  { id: "climate", label: "climate", icon: CloudSun },
  { id: "rotation", label: "rotation", icon: Leaf },
  { id: "reports", label: "reports", icon: BarChart3 },
  { id: "settings", label: "settings", icon: Settings }
];

const panelStyle = {
  background: "#111c2e",
  border: "1px solid #26364d",
  borderRadius: "16px",
  padding: "22px"
};

const mutedStyle = {
  color: "#91a2b8",
  fontSize: "14px"
};

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "11px 17px",
  marginTop: "20px",
  background: "#16a36a",
  border: "none",
  borderRadius: "9px",
  color: "white",
  cursor: "pointer"
};

const secondaryButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px",
  background: "#1c2b40",
  border: "1px solid #34445c",
  borderRadius: "9px",
  color: "#dbeafe",
  cursor: "pointer"
};

function PageHeading({ icon: Icon, title, description }) {
  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          background: "#123b32",
          padding: "12px",
          borderRadius: "12px"
        }}>
          <Icon color="#22c987" size={25} />
        </div>

        <div>
          <h2 style={{ margin: 0, color: "#f1f5f9" }}>
            {title}
          </h2>

          <p style={{ ...mutedStyle, margin: "5px 0 0" }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div style={panelStyle}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <span style={mutedStyle}>{title}</span>
        <Icon color={color} size={24} />
      </div>

      <h2 style={{
        color: "#f8fafc",
        fontSize: "30px",
        margin: "17px 0 5px"
      }}>
        {value}
      </h2>

      <span style={mutedStyle}>{subtitle}</span>
    </div>
  );
}

function SoilAnalysis({ language }) {
  const [form, setForm] = useState({
    nitrogen: 50,
    phosphorus: 40,
    potassium: 45,
    ph: 6.5,
    moisture: 35
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const labels = {
    uz: {
      nitrogen: "Azot (N)",
      phosphorus: "Fosfor (P)",
      potassium: "Kaliy (K)",
      ph: "Tuproq pH",
      moisture: "Namlik (%)",
      analyze: "Tuproqni tahlil qilish",
      result: "Tahlil natijasi",
      error: "Tahlil amalga oshmadi."
    },
    en: {
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      ph: "Soil pH",
      moisture: "Moisture (%)",
      analyze: "Analyze Soil",
      result: "Analysis Result",
      error: "Analysis failed."
    },
    ru: {
      nitrogen: "Азот (N)",
      phosphorus: "Фосфор (P)",
      potassium: "Калий (K)",
      ph: "Кислотность pH",
      moisture: "Влажность (%)",
      analyze: "Анализировать почву",
      result: "Результат анализа",
      error: "Ошибка анализа."
    }
  };

  const text = labels[language] || labels.uz;

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post("/api/soil/analyze", form);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || text.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={panelStyle}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: "20px"
      }}>
        {Object.keys(form).map(key => (
          <label key={key} style={{ color: "#dbeafe" }}>
            {text[key]}

            <input
              type="number"
              step="0.1"
              value={form[key]}
              onChange={e => setForm(old => ({
                ...old,
                [key]: Number(e.target.value)
              }))}
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "9px",
                padding: "12px",
                background: "#1c2b40",
                border: "1px solid #34445c",
                borderRadius: "8px",
                color: "white"
              }}
            />
          </label>
        ))}
      </div>

      <button onClick={analyze} disabled={loading} style={primaryButton}>
        <Brain size={18} />
        {loading ? "..." : text.analyze}
      </button>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}

      {result && (
        <div style={{
          marginTop: "25px",
          padding: "20px",
          background: "#123b32",
          borderRadius: "12px"
        }}>
          <h3 style={{ color: "#22c987" }}>{text.result}</h3>

          <pre style={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            color: "#e2e8f0"
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("agro-language") || "uz";
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [systemOnline, setSystemOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    farmers: 0,
    fields: 0,
    crops: 9
  });

  const t = translations[language] || translations.uz;

  // Tilni o'zgartirish va saqlash
  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
    localStorage.setItem("agro-language", newLanguage);
  }

  useEffect(() => {
    checkSystem();
    loadStats();
  }, []);

  async function checkSystem() {
    try {
      await api.get("/api/health");
      setSystemOnline(true);
    } catch {
      setSystemOnline(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const [farmersResponse, fieldsResponse, cropsResponse] =
        await Promise.all([
          api.get("/api/farmers"),
          api.get("/api/fields"),
          api.get("/api/crops")
        ]);

      setStats({
        farmers: Array.isArray(farmersResponse.data)
          ? farmersResponse.data.length
          : farmersResponse.data.farmers?.length || 0,

        fields: Array.isArray(fieldsResponse.data)
          ? fieldsResponse.data.length
          : fieldsResponse.data.fields?.length || 0,

        crops: cropsResponse.data.crops?.length || 0
      });
    } catch {
      // API statistikasi olinmasa boshlang'ich qiymatlar saqlanadi.
    }
  }

  function renderDashboard() {
    const quickLinks = [
      {
        id: "nasa",
        title: t.nasa,
        icon: Satellite,
        description: t.description
      },
      {
        id: "soil",
        title: t.soil,
        icon: FlaskConical,
        description: t.soilDescription
      },
      {
        id: "climate",
        title: t.climate,
        icon: CloudSun,
        description: t.climateDescription
      },
      {
        id: "rotation",
        title: t.rotation,
        icon: Leaf,
        description: t.rotationDescription
      }
    ];

    return (
      <div>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#f8fafc", fontSize: "29px" }}>
            {t.welcome}
          </h1>

          <p style={mutedStyle}>{t.subtitle}</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginBottom: "28px"
        }}>
          <StatCard
            title={t.totalFarmers}
            value={stats.farmers}
            icon={Users}
            color="#22c987"
            subtitle="Fermerlar"
          />

          <StatCard
            title={t.totalFields}
            value={stats.fields}
            icon={MapPin}
            color="#60a5fa"
            subtitle={t.hectares}
          />

          <StatCard
            title={t.cropTypes}
            value={stats.crops}
            icon={Sprout}
            color="#eab308"
            subtitle="Ekin turlari"
          />

          <StatCard
            title={t.systemStatus}
            value={loading ? "..." : systemOnline ? "ONLINE" : "OFFLINE"}
            icon={Activity}
            color={systemOnline ? "#22c987" : "#ef4444"}
            subtitle={systemOnline ? t.online : t.offline}
          />
        </div>

        <h3 style={{ color: "#f8fafc" }}>{t.quickAccess}</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px"
        }}>
          {quickLinks.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  ...panelStyle,
                  textAlign: "left",
                  color: "#f8fafc",
                  cursor: "pointer"
                }}
              >
                <Icon size={28} color="#22c987" />
                <h3>{item.title}</h3>
                <p style={mutedStyle}>{item.description}</p>

                <span style={{ color: "#22c987" }}>
                  Ochish <ChevronRight size={16} />
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ ...panelStyle, marginTop: "25px" }}>
          <h3 style={{ color: "#f8fafc" }}>{t.recentActivity}</h3>
          <p style={mutedStyle}>
            AgroVision AI platformasi ishga tushirilgan.
          </p>
          <p style={mutedStyle}>
            NASA POWER ma'lumotlari moduli mavjud.
          </p>
          <p style={mutedStyle}>
            Tuproq va ekin almashinuvi modullari mavjud.
          </p>
        </div>
      </div>
    );
  }

  function renderSoil() {
    return (
      <div>
        <PageHeading
          icon={FlaskConical}
          title={t.soil}
          description={t.soilDescription}
        />

        <SoilAnalysis language={language} />
      </div>
    );
  }

  function renderContent() {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();

      case "nasa":
        return <NasaDashboard language={language} />;

      case "soil":
        return renderSoil();

      case "farmer":
      case "fields":
        return <FarmersFields language={language} />;

      case "crops":
        return <Crops language={language} />;

      case "climate":
        return <ClimateMonitoring language={language} />;

      case "rotation":
        return <RotationAdvisor language={language} />;

      case "reports":
        return <Reports language={language} />;

      case "settings":
        return (
          <SettingsPage
            language={language}
            setLanguage={changeLanguage}
          />
        );

      default:
        return renderDashboard();
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0a1220",
      color: "#f8fafc",
      fontFamily: "Arial, sans-serif"
    }}>
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "#0009",
            zIndex: 10
          }}
        />
      )}

      <aside style={{
        width: sidebarOpen ? "245px" : "75px",
        background: "#111c2e",
        borderRight: "1px solid #26364d",
        padding: "20px 12px",
        transition: "width .2s",
        position: mobileMenu ? "fixed" : "relative",
        zIndex: 11,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "35px",
          padding: "5px"
        }}>
          <div style={{
            background: "#123b32",
            padding: "10px",
            borderRadius: "12px"
          }}>
            <Sprout color="#22c987" size={27} />
          </div>

          {sidebarOpen && (
            <div>
              <h3 style={{ margin: 0, color: "#22c987" }}>
                AgroVision
              </h3>

              <span style={{ ...mutedStyle, fontSize: "11px" }}>
                AI PLATFORM
              </span>
            </div>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          {navigation.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenu(false);
                }}
                title={t[item.label]}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  padding: "12px",
                  marginBottom: "6px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  background: active ? "#164735" : "transparent",
                  color: active ? "#22c987" : "#a8b5c7",
                  textAlign: "left",
                  fontSize: "14px"
                }}
              >
                <Icon size={20} />

                {sidebarOpen && (
                  <span>{t[item.label]}</span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={secondaryButton}
        >
          <Menu size={19} />
          {sidebarOpen && "Menyuni yig'ish"}
        </button>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <header style={{
          minHeight: "72px",
          background: "#111c2e",
          borderBottom: "1px solid #26364d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              style={secondaryButton}
            >
              {mobileMenu ? <X size={19} /> : <Menu size={19} />}
            </button>

            <div>
              <strong style={{ color: "#f8fafc" }}>
                AgroVision AI
              </strong>

              <div style={{ ...mutedStyle, fontSize: "11px" }}>
                Smart Agriculture
              </div>
            </div>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "13px"
          }}>
            <span style={{
              color: systemOnline ? "#22c987" : "#ef4444",
              fontSize: "12px"
            }}>
              ● {systemOnline ? "ONLINE" : "OFFLINE"}
            </span>

            <select
              value={language}
              onChange={e => changeLanguage(e.target.value)}
              style={{
                background: "#1c2b40",
                color: "white",
                padding: "9px",
                border: "1px solid #34445c",
                borderRadius: "8px"
              }}
            >
              <option value="uz">UZ</option>
              <option value="en">EN</option>
              <option value="ru">RU</option>
            </select>

            <button
              onClick={() => {
                checkSystem();
                loadStats();
              }}
              title={t.refresh}
              style={secondaryButton}
            >
              <RefreshCw size={18} />
            </button>

            <Bell size={20} color="#a8b5c7" />
          </div>
        </header>

        <div style={{
          padding: "28px",
          maxWidth: "1500px",
          margin: "auto"
        }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
