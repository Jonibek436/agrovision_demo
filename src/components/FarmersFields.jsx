
import { useEffect, useState } from "react";
import {
  Tractor,
  Sprout,
  Plus,
  Trash2,
  RefreshCw,
  MapPin,
  User,
  Ruler,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import api from "../services/api";

const crops = [
  "Bug‘doy",
  "Mosh",
  "Paxta",
  "Beda",
  "Makkajo‘xori",
  "Jo‘xori",
  "No‘xat",
  "Kungaboqar"
];

const cardStyle = {
  background: "var(--card, #151d2e)",
  border: "1px solid var(--border, #26334a)",
  borderRadius: "15px",
  padding: "20px",
  color: "var(--text, #ffffff)"
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

const buttonStyle = {
  border: "none",
  borderRadius: "9px",
  background: "#16a36a",
  color: "#ffffff",
  padding: "12px 17px",
  fontWeight: "700",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

const tableHeader = {
  padding: "12px",
  textAlign: "left",
  color: "var(--muted, #9ca9bd)",
  borderBottom: "1px solid var(--border, #26334a)",
  whiteSpace: "nowrap"
};

const tableCell = {
  padding: "13px 12px",
  borderBottom: "1px solid var(--border, #26334a)",
  whiteSpace: "nowrap"
};

const deleteButton = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 10px",
  border: "1px solid rgba(220,86,86,0.4)",
  borderRadius: "7px",
  background: "rgba(220,86,86,0.1)",
  color: "#ef7777",
  cursor: "pointer"
};

// MUHIM: FormField endi asosiy komponentdan tashqarida
function FormField({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "13px",
        color: "var(--muted, #9ca9bd)",
        marginBottom: "8px"
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function FarmersFields({ language = "UZ" }) {
  const [farmers, setFarmers] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [farmerForm, setFarmerForm] = useState({
    name: "",
    phone: "",
    location: ""
  });

  const [fieldForm, setFieldForm] = useState({
    name: "",
    location: "",
    area_hectares: "",
    crop: "Bug‘doy",
    farmer_id: ""
  });

  const labels = {
    UZ: {
      farmers: "Fermerlar",
      fields: "Ekin maydonlari",
      addFarmer: "Fermer qo‘shish",
      addField: "Maydon qo‘shish",
      name: "Ism va familiya",
      phone: "Telefon raqami",
      location: "Manzil / hudud",
      fieldName: "Maydon nomi",
      area: "Maydon hajmi (gektar)",
      crop: "Ekin turi",
      farmer: "Fermer",
      choose: "Fermerni tanlang",
      save: "Saqlash",
      delete: "O‘chirish",
      refresh: "Yangilash",
      noFarmers: "Hozircha fermerlar yo‘q.",
      noFields: "Hozircha maydonlar yo‘q.",
      loading: "Yuklanmoqda...",
      totalFarmers: "Jami fermerlar",
      totalFields: "Jami maydonlar",
      totalArea: "Umumiy maydon",
      error: "Xatolik yuz berdi.",
      saved: "Ma'lumot muvaffaqiyatli saqlandi.",
      confirm: "Ushbu ma'lumotni o‘chirishni xohlaysizmi?",
      unassigned: "Biriktirilmagan"
    },
    EN: {
      farmers: "Farmers",
      fields: "Crop fields",
      addFarmer: "Add farmer",
      addField: "Add field",
      name: "Full name",
      phone: "Phone number",
      location: "Address / region",
      fieldName: "Field name",
      area: "Area (hectares)",
      crop: "Crop type",
      farmer: "Farmer",
      choose: "Select farmer",
      save: "Save",
      delete: "Delete",
      refresh: "Refresh",
      noFarmers: "No farmers yet.",
      noFields: "No fields yet.",
      loading: "Loading...",
      totalFarmers: "Total farmers",
      totalFields: "Total fields",
      totalArea: "Total area",
      error: "An error occurred.",
      saved: "Information saved successfully.",
      confirm: "Are you sure you want to delete this item?",
      unassigned: "Unassigned"
    },
    RU: {
      farmers: "Фермеры",
      fields: "Поля",
      addFarmer: "Добавить фермера",
      addField: "Добавить поле",
      name: "ФИО",
      phone: "Номер телефона",
      location: "Адрес / регион",
      fieldName: "Название поля",
      area: "Площадь (гектары)",
      crop: "Тип культуры",
      farmer: "Фермер",
      choose: "Выберите фермера",
      save: "Сохранить",
      delete: "Удалить",
      refresh: "Обновить",
      noFarmers: "Фермеров пока нет.",
      noFields: "Полей пока нет.",
      loading: "Загрузка...",
      totalFarmers: "Всего фермеров",
      totalFields: "Всего полей",
      totalArea: "Общая площадь",
      error: "Произошла ошибка.",
      saved: "Данные успешно сохранены.",
      confirm: "Вы действительно хотите удалить эту запись?",
      unassigned: "Не назначен"
    }
  };

  const t = labels[language] || labels.UZ;

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [farmerResponse, fieldResponse] = await Promise.all([
        api.get("/api/farmers"),
        api.get("/api/fields")
      ]);

      setFarmers(farmerResponse.data.farmers || []);
      setFields(fieldResponse.data.fields || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || t.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitFarmer(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/farmers", farmerForm);

      setFarmerForm({
        name: "",
        phone: "",
        location: ""
      });

      setSuccess(t.saved);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || t.error);
    } finally {
      setSaving(false);
    }
  }

  async function submitField(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/fields", {
        name: fieldForm.name,
        location: fieldForm.location,
        area_hectares: Number(fieldForm.area_hectares),
        crop: fieldForm.crop,
        farmer_id: fieldForm.farmer_id
          ? Number(fieldForm.farmer_id)
          : null
      });

      setFieldForm({
        name: "",
        location: "",
        area_hectares: "",
        crop: "Bug‘doy",
        farmer_id: ""
      });

      setSuccess(t.saved);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || t.error);
    } finally {
      setSaving(false);
    }
  }

  async function removeFarmer(id) {
    if (!window.confirm(t.confirm)) return;

    try {
      await api.delete(`/api/farmers/${id}`);
      setSuccess(t.saved);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || t.error);
    }
  }

  async function removeField(id) {
    if (!window.confirm(t.confirm)) return;

    try {
      await api.delete(`/api/fields/${id}`);
      setSuccess(t.saved);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.detail || t.error);
    }
  }

  const totalArea = fields.reduce(
    (sum, field) => sum + Number(field.area_hectares || 0),
    0
  );

  return (
    <div style={{
      width: "100%",
      color: "var(--text, #ffffff)"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "23px"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "23px" }}>
            {t.farmers} & {t.fields}
          </h2>
          <p style={{
            color: "var(--muted, #9ca9bd)",
            fontSize: "13px"
          }}>
            Fermerlar va qishloq xo‘jaligi maydonlarini boshqarish
          </p>
        </div>

        <button onClick={loadData} style={buttonStyle}>
          <RefreshCw size={16} />
          {t.refresh}
        </button>
      </div>

      {error && (
        <div style={{
          ...cardStyle,
          borderColor: "#dc5656",
          color: "#ff8585",
          marginBottom: "15px"
        }}>
          <AlertTriangle
            size={17}
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {error}
        </div>
      )}

      {success && (
        <div style={{
          ...cardStyle,
          borderColor: "#16a36a",
          color: "#16c784",
          marginBottom: "15px"
        }}>
          <CheckCircle
            size={17}
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {success}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginBottom: "20px"
      }}>
        {[
          { label: t.totalFarmers, value: farmers.length, icon: Tractor },
          { label: t.totalFields, value: fields.length, icon: Sprout },
          { label: t.totalArea, value: `${totalArea.toFixed(2)} ha`, icon: Ruler }
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} style={cardStyle}>
              <Icon size={23} color="#16c784" />
              <p style={{
                color: "var(--muted, #9ca9bd)",
                fontSize: "13px",
                margin: "12px 0 6px"
              }}>
                {item.label}
              </p>
              <strong style={{ fontSize: "27px" }}>
                {item.value}
              </strong>
            </div>
          );
        })}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "18px",
        marginBottom: "20px"
      }}>
        <form onSubmit={submitFarmer} style={cardStyle}>
          <h3 style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            marginTop: 0
          }}>
            <User color="#16c784" />
            {t.addFarmer}
          </h3>

          <FormField label={t.name}>
            <input
              style={inputStyle}
              value={farmerForm.name}
              onChange={(e) => setFarmerForm(prev => ({
                ...prev,
                name: e.target.value
              }))}
              minLength={2}
              required
            />
          </FormField>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.phone}>
              <input
                style={inputStyle}
                value={farmerForm.phone}
                onChange={(e) => setFarmerForm(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                placeholder="+998..."
              />
            </FormField>
          </div>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.location}>
              <input
                style={inputStyle}
                value={farmerForm.location}
                onChange={(e) => setFarmerForm(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                placeholder="Qamashi"
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ ...buttonStyle, marginTop: "18px" }}
          >
            <Plus size={17} />
            {saving ? t.loading : t.save}
          </button>
        </form>

        <form onSubmit={submitField} style={cardStyle}>
          <h3 style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            marginTop: 0
          }}>
            <Sprout color="#16c784" />
            {t.addField}
          </h3>

          <FormField label={t.fieldName}>
            <input
              style={inputStyle}
              value={fieldForm.name}
              onChange={(e) => setFieldForm(prev => ({
                ...prev,
                name: e.target.value
              }))}
              required
            />
          </FormField>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.location}>
              <input
                style={inputStyle}
                value={fieldForm.location}
                onChange={(e) => setFieldForm(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                required
              />
            </FormField>
          </div>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.area}>
              <input
                type="number"
                min="0.01"
                step="0.01"
                style={inputStyle}
                value={fieldForm.area_hectares}
                onChange={(e) => setFieldForm(prev => ({
                  ...prev,
                  area_hectares: e.target.value
                }))}
                required
              />
            </FormField>
          </div>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.crop}>
              <select
                style={inputStyle}
                value={fieldForm.crop}
                onChange={(e) => setFieldForm(prev => ({
                  ...prev,
                  crop: e.target.value
                }))}
              >
                {crops.map(crop => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div style={{ marginTop: "15px" }}>
            <FormField label={t.farmer}>
              <select
                style={inputStyle}
                value={fieldForm.farmer_id}
                onChange={(e) => setFieldForm(prev => ({
                  ...prev,
                  farmer_id: e.target.value
                }))}
              >
                <option value="">{t.choose}</option>
                {farmers.map(farmer => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ ...buttonStyle, marginTop: "18px" }}
          >
            <Plus size={17} />
            {saving ? t.loading : t.save}
          </button>
        </form>
      </div>

      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h3 style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginTop: 0
        }}>
          <Tractor color="#16c784" />
          {t.farmers}
        </h3>

        {loading ? (
          <p>{t.loading}</p>
        ) : farmers.length === 0 ? (
          <p style={{ color: "var(--muted, #9ca9bd)" }}>
            {t.noFarmers}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px"
            }}>
              <thead>
                <tr>
                  {["ID", t.name, t.phone, t.location, t.delete].map(label => (
                    <th key={label} style={tableHeader}>{label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {farmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td style={tableCell}>{farmer.id}</td>
                    <td style={tableCell}>{farmer.name}</td>
                    <td style={tableCell}>{farmer.phone || "—"}</td>
                    <td style={tableCell}>{farmer.location || "—"}</td>
                    <td style={tableCell}>
                      <button
                        type="button"
                        onClick={() => removeFarmer(farmer.id)}
                        style={deleteButton}
                      >
                        <Trash2 size={15} />
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          marginTop: 0
        }}>
          <MapPin color="#16c784" />
          {t.fields}
        </h3>

        {loading ? (
          <p>{t.loading}</p>
        ) : fields.length === 0 ? (
          <p style={{ color: "var(--muted, #9ca9bd)" }}>
            {t.noFields}
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px"
            }}>
              <thead>
                <tr>
                  {[
                    "ID",
                    t.fieldName,
                    t.location,
                    t.area,
                    t.crop,
                    t.farmer,
                    t.delete
                  ].map(label => (
                    <th key={label} style={tableHeader}>{label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {fields.map(field => (
                  <tr key={field.id}>
                    <td style={tableCell}>{field.id}</td>
                    <td style={tableCell}>{field.name}</td>
                    <td style={tableCell}>{field.location}</td>
                    <td style={tableCell}>
                      {Number(field.area_hectares).toFixed(2)} ha
                    </td>
                    <td style={tableCell}>{field.crop}</td>
                    <td style={tableCell}>
                      {field.farmer_name || t.unassigned}
                    </td>
                    <td style={tableCell}>
                      <button
                        type="button"
                        onClick={() => removeField(field.id)}
                        style={deleteButton}
                      >
                        <Trash2 size={15} />
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
