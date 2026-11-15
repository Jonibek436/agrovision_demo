
import { useState } from "react";
import { Settings, Globe, ShieldCheck, RefreshCw, CheckCircle } from "lucide-react";
import api from "../services/api";

export default function SettingsPage({ language = "uz", setLanguage }) {
  const [apiStatus, setApiStatus] = useState("unknown");
  const [checking, setChecking] = useState(false);

  const text = {
    uz: {
      title: "Sozlamalar",
      desc: "AgroVision AI tizimi sozlamalari",
      lang: "Tizim tili",
      profile: "Foydalanuvchi profili",
      name: "AgroVision AI foydalanuvchisi",
      system: "Tizim holati",
      check: "Ulanishni tekshirish",
      online: "Server ishlamoqda",
      offline: "Server bilan aloqa yo'q",
      info: "Loyiha haqida",
      version: "Versiya: 1.3.0",
      description: "Aqlli qishloq xo'jaligi va ekinlar monitoringi platformasi."
    },
    en: {
      title: "Settings",
      desc: "AgroVision AI system settings",
      lang: "System language",
      profile: "User profile",
      name: "AgroVision AI user",
      system: "System status",
      check: "Check connection",
      online: "Server is running",
      offline: "Server connection failed",
      info: "About project",
      version: "Version: 1.3.0",
      description: "Smart agriculture and crop monitoring platform."
    },
    ru: {
      title: "Настройки",
      desc: "Настройки системы AgroVision AI",
      lang: "Язык системы",
      profile: "Профиль пользователя",
      name: "Пользователь AgroVision AI",
      system: "Состояние системы",
      check: "Проверить соединение",
      online: "Сервер работает",
      offline: "Нет связи с сервером",
      info: "О проекте",
      version: "Версия: 1.3.0",
      description: "Платформа умного сельского хозяйства и мониторинга культур."
    }
  };

  const t = text[language] || text.uz;

  async function checkServer() {
    setChecking(true);
    try {
      await api.get("/api/health");
      setApiStatus("online");
    } catch {
      setApiStatus("offline");
    } finally {
      setChecking(false);
    }
  }

  const card = {
    background: "#172033",
    border: "1px solid #29364d",
    borderRadius: "15px",
    padding: "22px",
    color: "#f8fafc",
    marginBottom: "17px"
  };

  return (
    <div style={{ color: "#f8fafc", padding: "10px" }}>
      <h1><Settings size={27} /> {t.title}</h1>
      <p style={{ color: "#94a3b8" }}>{t.desc}</p>

      <div style={card}>
        <h3><Globe size={19} /> {t.lang}</h3>
        <p style={{ color: "#94a3b8" }}>{t.lang}</p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {[
            ["uz", "🇺🇿 O'zbekcha"],
            ["en", "🇬🇧 English"],
            ["ru", "🇷🇺 Русский"]
          ].map(([code, label]) => (
            <button key={code}
              onClick={() => setLanguage && setLanguage(code)}
              style={{
                padding: "12px 18px",
                borderRadius: "9px",
                border: language === code ? "2px solid #22c55e" : "1px solid #475569",
                background: language === code ? "#14532d" : "#0f172a",
                color: "white",
                cursor: "pointer"
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        <h3>{t.profile}</h3>
        <p style={{ color: "#94a3b8" }}>{t.name}</p>
        <p style={{ color: "#64748b", fontSize: "13px" }}>
          AgroVision AI platform
        </p>
      </div>

      <div style={card}>
        <h3><ShieldCheck size={19} /> {t.system}</h3>

        <p style={{
          color: apiStatus === "online" ? "#4ade80" :
            apiStatus === "offline" ? "#f87171" : "#94a3b8"
        }}>
          {apiStatus === "online" ? t.online :
            apiStatus === "offline" ? t.offline : "Tekshirilmagan"}
        </p>

        <button onClick={checkServer} disabled={checking}
          style={{
            padding: "11px 17px",
            background: "#2563eb",
            border: 0,
            borderRadius: "9px",
            color: "white",
            cursor: "pointer"
          }}>
          <RefreshCw size={15} /> {checking ? "..." : t.check}
        </button>
      </div>

      <div style={card}>
        <h3><CheckCircle size={19} /> {t.info}</h3>
        <p>{t.description}</p>
        <p style={{ color: "#94a3b8" }}>{t.version}</p>
      </div>
    </div>
  );
}
