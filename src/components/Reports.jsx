
import { useState } from "react";
import {
  FileText,
  Download,
  ClipboardList,
  CheckCircle,
  Database,
  Satellite,
  Sprout,
  CalendarDays
} from "lucide-react";

const translations = {
  UZ: {
    title: "Hisobotlar markazi",
    subtitle: "AgroVision AI loyihasi bo‘yicha hisobot tayyorlang.",
    overview: "Loyiha ko‘rsatkichlari",
    project: "Loyiha",
    platform: "Platforma",
    nasa: "NASA ma'lumotlari",
    soil: "Tuproq tahlili",
    rotation: "Ekin almashinuvi",
    available: "Modul mavjud",
    report: "Hisobot ma'lumotlari",
    name: "Hisobot nomi",
    region: "Hudud",
    description: "Qo‘shimcha izoh",
    generate: "CSV hisobotni yuklab olish",
    generated: "Hisobot tayyorlandi",
    date: "Hisobot sanasi",
    format: "Fayl formati",
    note: "Ushbu hisobot platformaning modul va imkoniyatlari haqida ma'lumot beradi. U avtomatik ravishda laboratoriya yoki hosildorlik natijalarini yaratmaydi.",
    download: "Yuklab olish"
  },
  EN: {
    title: "Reports Center",
    subtitle: "Create a report about the AgroVision AI platform.",
    overview: "Project overview",
    project: "Project",
    platform: "Platform",
    nasa: "NASA data",
    soil: "Soil analysis",
    rotation: "Crop rotation",
    available: "Module available",
    report: "Report details",
    name: "Report name",
    region: "Region",
    description: "Additional notes",
    generate: "Download CSV report",
    generated: "Report generated",
    date: "Report date",
    format: "File format",
    note: "This report describes platform modules and capabilities. It does not generate laboratory or yield results.",
    download: "Download"
  },
  RU: {
    title: "Центр отчетов",
    subtitle: "Создайте отчет о платформе AgroVision AI.",
    overview: "Обзор проекта",
    project: "Проект",
    platform: "Платформа",
    nasa: "Данные NASA",
    soil: "Анализ почвы",
    rotation: "Севооборот",
    available: "Модуль доступен",
    report: "Данные отчета",
    name: "Название отчета",
    region: "Регион",
    description: "Дополнительное описание",
    generate: "Скачать CSV отчет",
    generated: "Отчет подготовлен",
    date: "Дата отчета",
    format: "Формат файла",
    note: "Отчет содержит сведения о модулях платформы. Он не создает лабораторные данные или прогноз урожайности.",
    download: "Скачать"
  }
};

const cardStyle = {
  background: "var(--card, #151d2e)",
  border: "1px solid var(--border, #26334a)",
  borderRadius: "15px",
  padding: "20px"
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "9px",
  border: "1px solid var(--border, #34415a)",
  background: "var(--input, #101827)",
  color: "var(--text, #ffffff)",
  fontSize: "14px"
};

export default function Reports({ language = "UZ" }) {
  const t = translations[language] || translations.UZ;

  const [reportName, setReportName] = useState("AgroVision AI hisoboti");
  const [region, setRegion] = useState("Qamashi, Qashqadaryo");
  const [description, setDescription] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const modules = [
    {
      name: t.nasa,
      icon: Satellite,
      status: "Available",
      color: "#4299e1"
    },
    {
      name: t.soil,
      icon: Database,
      status: "Available",
      color: "#16c784"
    },
    {
      name: t.rotation,
      icon: Sprout,
      status: "Available",
      color: "#d6a94b"
    }
  ];

  function downloadReport(event) {
    event.preventDefault();

    const date = new Date().toLocaleDateString("uz-UZ");

    const rows = [
      ["AgroVision AI - Project Report"],
      ["Report name", reportName],
      ["Region", region],
      ["Report date", date],
      ["Platform", "React + FastAPI"],
      [],
      ["Module", "Availability"],
      ...modules.map((module) => [module.name, t.available]),
      [],
      ["Additional notes", description],
      [],
      ["Disclaimer", t.note]
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "").replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "AgroVision_AI_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    setDownloaded(true);
  }

  return (
    <div style={{
      width: "100%",
      color: "var(--text, #ffffff)"
    }}>
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
          <FileText size={25} color="#16c784" />
        </div>

        <div>
          <h2 style={{ margin: 0, fontSize: "23px" }}>
            {t.title}
          </h2>
          <p style={{
            color: "var(--muted, #9ca9bd)",
            fontSize: "13px",
            margin: "6px 0 0"
          }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginTop: 0
        }}>
          <ClipboardList color="#16c784" size={20} />
          {t.overview}
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px"
        }}>
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <div
                key={module.name}
                style={{
                  padding: "17px",
                  borderRadius: "12px",
                  background: "var(--input, #101827)",
                  border: "1px solid var(--border, #26334a)"
                }}
              >
                <Icon
                  size={24}
                  color={module.color}
                />

                <h4 style={{ margin: "12px 0 8px" }}>
                  {module.name}
                </h4>

                <span style={{
                  color: "#16c784",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}>
                  <CheckCircle size={14} />
                  {t.available}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={downloadReport}
        style={{ ...cardStyle, marginTop: "20px" }}
      >
        <h3 style={{ marginTop: 0 }}>
          {t.report}
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px"
        }}>
          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "8px"
            }}>
              {t.name}
            </label>

            <input
              style={inputStyle}
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "8px"
            }}>
              {t.region}
            </label>

            <input
              style={inputStyle}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{
              display: "block",
              fontSize: "13px",
              marginBottom: "8px"
            }}>
              {t.description}
            </label>

            <textarea
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical"
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hisobot uchun qo‘shimcha ma'lumot..."
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "13px 20px",
            background: "#16a36a",
            color: "#ffffff",
            border: "none",
            borderRadius: "9px",
            cursor: "pointer",
            fontWeight: "700",
            display: "inline-flex",
            alignItems: "center",
            gap: "9px"
          }}
        >
          <Download size={18} />
          {t.generate}
        </button>

        {downloaded && (
          <p style={{
            color: "#16c784",
            fontSize: "13px",
            marginTop: "14px"
          }}>
            <CheckCircle
              size={16}
              style={{ verticalAlign: "middle", marginRight: "7px" }}
            />
            {t.generated}
          </p>
        )}
      </form>

      <div style={{
        ...cardStyle,
        marginTop: "20px",
        borderLeft: "4px solid #d6a94b"
      }}>
        <p style={{
          color: "var(--muted, #9ca9bd)",
          fontSize: "13px",
          lineHeight: 1.7,
          margin: 0
        }}>
          {t.note}
        </p>
      </div>
    </div>
  );
}
